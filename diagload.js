import {sample_contexts} from "./contexts.js";

import {default as createBombixModule} from "./bombix.js";
import {default as createLatuileModule} from "./latuile.js";
import {db, init, displayCurrent} from "./table_edit.js";
import {schema} from "./schema.js"
import {sample_diagdata} from "./diagdata.js"

export {mycontexts, contexts, resetContexts, setContexts, drawDiag, compute_links, ApplyRepartition, enforce_bounding_rectangle};
export {data2contexts, compute_tr2_link_tags};
export {MONOSPACE_FONT_PIXEL_WIDTH, CHAR_RECT_HEIGHT, RECTANGLE_BOTTOM_CAP};

const MONOSPACE_FONT_PIXEL_WIDTH=7;
const CHAR_RECT_HEIGHT=17.5;	// in reality 14,8 + 1 + 1 (top and bottom padding) = 16,8
const RECTANGLE_BOTTOM_CAP=200;

var bombixModule;
var latuileModule;

var mycontexts = sample_contexts;

function setContexts(mycontexts_)
{
	mycontexts = mycontexts_;
	contexts = JSON.stringify(mycontexts);
}

var contexts=null;

function resetContexts()
{
	contexts = null;
}

var currentX = 0;
var currentY = 0;
var g = 0;
var sizer = 0;

// FRAME_MARGIN is duplicated in table_input.js, diagload.js and topo_space.js
const FRAME_MARGIN = 20;
const RECT_BORDER = 20;


function hex(i,n) {
	console.assert(i >= 0, "formatting negative number as hex"); 
//encoding positive number
	return i.toString(16).padStart(n,'0');
}


async function compute_tr2_link_tags()
{
	const ret1 = await db.query(`
		DELETE FROM graph
  		WHERE from_table='tag' AND to_table='link' AND from_key=(
  			SELECT idtag FROM tag WHERE type_code='RELATION_CATEGORY' AND code='TR2'	
		);
  	`);

	console.log(ret1);
	
	const ret2 = await db.query(`
		INSERT INTO graph(from_table, from_key, to_table, to_key)
  		SELECT 'tag', t.idtag, 'link', l.idlink
    		FROM link l
      		JOIN tag t ON t.type_code='RELATION_CATEGORY' AND t.code='TR2'
		WHERE EXISTS (
  			SELECT *
    			FROM link l1
      			JOIN link l2 ON l2.idbox_from = l1.idbox_to
	 		WHERE l1.idbox_from = l.idbox_from AND l2.idbox_to = l.idbox_to
    		);
 	`);

	console.log(ret2);
}


async function data2contexts() {

	const ret1 = await db.query(`
 		WITH cte(idbox, width, height) AS (
   			SELECT idbox, 2*4 + LENGTH(title) * ${MONOSPACE_FONT_PIXEL_WIDTH}, 8 + ${CHAR_RECT_HEIGHT} FROM box
    			UNION ALL
       			SELECT idbox, LENGTH(name) * ${MONOSPACE_FONT_PIXEL_WIDTH}, ${CHAR_RECT_HEIGHT}  FROM field
		), cte2 AS (
  			INSERT INTO rectangle(idbox, width, height)
  			SELECT idbox, MAX(width) AS width, LEAST(SUM(height), ${RECTANGLE_BOTTOM_CAP}) AS height
    			FROM cte
      			GROUP BY idbox
	 		ORDER BY idbox
    			RETURNING *
	 	)
   		SELECT STRING_AGG(FORMAT('%1$s%2$s', LPAD(to_hex(width),3,'0'), LPAD(to_hex(height),3,'0')), '' ORDER BY idbox)
      		FROM cte2;
 	`);

	const rectdim = ret1.rows[0].string_agg;

	const ret2 = await db.query(`
 		WITH cte AS (
   			SELECT *, ROW_NUMBER() OVER(PARTITION BY idbox_from, idbox_to ORDER BY idlink) AS rn
      			FROM link
		)
 		SELECT STRING_AGG(FORMAT('%1$s%2$s', LPAD(to_hex(l.idbox_from-1),3,'0'), LPAD(to_hex(l.idbox_to-1),3,'0')),'' ORDER BY l.idlink)
   		FROM cte l
     		WHERE rn=1 AND NOT EXISTS (
     			SELECT *
			FROM graph g 
       			JOIN tag t ON t.idtag = g.from_key AND t.type_code='RELATION_CATEGORY' AND t.code='TR2' 
	  		WHERE g.from_table='tag' AND g.to_table='link' AND g.to_key=l.idlink
     		);
 	`);

	const slinks = ret2.rows[0].string_agg;

	const bombix = bombixModule.cwrap("bombix","string",["string","string","string","string"]);
	const latuile = latuileModule.cwrap("latuile","string",["string","string"]);

	const jsonResponse = latuile(rectdim, slinks);
	console.log(jsonResponse);

	const contexts = JSON.parse(jsonResponse);

	const translations = contexts.contexts
					.map((context, index) => context.translatedBoxes.map(({id,translation:{x,y}}) => ({index, id, x, y})))
					.flat();

	const jsonTranslations = JSON.stringify(translations);
	console.log(jsonTranslations);
	
	const ret3 = await db.query(`
  		INSERT INTO translation(idrectangle, context, x, y)
     		SELECT id+1 AS idrectangle, index+1 AS context, x, y
  		FROM json_to_recordset('${jsonTranslations}') AS transl("index" int, "id" int, "x" int, "y" int)
	`);

	await drawDiag();
}


function selectElement(elmnt)
{
	if (sizer != 0)
		return;
	console.log("selectElement()");
	g = elmnt;
}

function deselectElement(elmnt)
{
	if (g == 0)
		return;
	console.log("deselectElement()");
	handleDeselectElement();
	currentX=0;
	currentY=0;
	g=0;
}

function selectSizer(elmnt)
{
	if (g != 0)
		return;
	console.log("selectSizer()");
	sizer = elmnt;
}

function deselectSizer(elmnt)
{
	if (sizer == 0)
		return;
	console.log("deselectSizer()");
	handleDeselectSizer();
	currentX=0;
	currentY=0;
	sizer = 0;
}

const MOVE_RANGE = 20;

function moveSizer(evt)
{
	if (sizer == 0)
		return;

	if (currentX==0 && currentY==0)
	{
		currentX = evt.clientX;
		currentY = evt.clientY;
	}

	const dx = evt.clientX - currentX;
	const dy = evt.clientY - currentY;
	
	if (dx == 0 && dy == 0)
		return;
	
	console.log(`moveSizer() dx=${dx} dy=${dy}`);

	const idbox = sizer.id.substring("sizer_".length);

	let fO = document.querySelector(`foreignObject[id=box${idbox}]`);

	const width = parseInt(fO.getAttribute("width"));
	const height = parseInt(fO.getAttribute("height"));

	fO.setAttribute("width", `${width+dx}`);
	fO.setAttribute("height", `${height+dy}`);

	let rect = document.querySelector(`rect[id=rect_${idbox}]`);

	rect.setAttribute("width", `${width+dx}`);
	rect.setAttribute("height", `${height+dy}`);

	const x = parseInt(sizer.getAttribute("x"));
	const y = parseInt(sizer.getAttribute("y"));

	sizer.setAttribute("x", `${x+dx}`);
	sizer.setAttribute("y", `${y+dy}`);

	currentX = evt.clientX;
	currentY = evt.clientY;
}

/*
<svg id="0"
  <g id="g_0"
    <rect id="rect_0"
    <foreignObject id="box0"
      <table id="0"...>
	<rect id="sizer_0"...>
  </g>
*/

function translate_draggable(g, dx, dy)
{
	const xForms = g.transform.baseVal;// an SVGTransformList
	const firstXForm = xForms.getItem(0); //an SVGTransform
	console.assert (firstXForm.type == SVGTransform.SVG_TRANSFORM_TRANSLATE);
	const translateX = firstXForm.matrix.e;
	const translateY = firstXForm.matrix.f;

	g.transform.baseVal.getItem(0).setTranslate(translateX+dx, translateY+dy);
}


function moveElement(evt) {

	if (g == 0)
		return;

	if (currentX==0 && currentY==0)
	{
		currentX = evt.clientX;
		currentY = evt.clientY;
	}

	const dx = evt.clientX - currentX;
	const dy = evt.clientY - currentY;

	console.log(`moveElement() dx=${dx} dy=${dy}`);

	translate_draggable(g, dx, dy);

	currentX = evt.clientX;
	currentY = evt.clientY;
}

function width(rectangle)
{
	return rectangle.right - rectangle.left;
}

function height(rectangle)
{
	return rectangle.bottom - rectangle.top;
}

function expand_by(rect, margin)
{
	return {
		left: rect.left - margin,
		right: rect.right + margin,
		top: rect.top - margin,
		bottom: rect.bottom + margin
	};
}

function compute_frame(rects)
{
	const frame = {
		left: Math.min(...rects.map(r => r.left)),
		right: Math.max(...rects.map(r => r.right)),
		top: Math.min(...rects.map(r => r.top)),
		bottom: Math.max(...rects.map(r => r.bottom))
	};
	return expand_by(frame, RECT_BORDER + FRAME_MARGIN/2);
}

async function enforce_bounding_rectangle(selectedContextIndex)
{
	const ret = await db.query(`
 		WITH cte AS (
 			SELECT t.x AS left, r.width + t.x AS right, t.y AS top, r.height + t.y AS bottom
			FROM rectangle r
  			JOIN translation t ON t.idrectangle = r.idrectangle
    			WHERE t.context = ${selectedContextIndex}
       		), cte2 AS (
	 		SELECT ${RECT_BORDER} + ${FRAME_MARGIN}/2 AS margin
		), cte3 AS (
  			SELECT MIN("left" - margin) AS left, MAX("right" + margin) AS right,
     				MIN("top" - margin) AS top, MAX("bottom" + margin) AS bottom
	 		FROM cte
    			CROSS JOIN cte2
		)
  		SELECT "left" AS x, "right" - "left" AS width, top AS y, bottom - top AS height
     		FROM cte3
  	`);

	const {x, y, width, height} = ret.rows[0];

	console.log(`updating viewBox to ${x} ${y} ${width} ${height}`);

	let svgElement = document.querySelector(`svg[id="${selectedContextIndex}"]`);

	svgElement.setAttribute("width", `${width}`);
	svgElement.setAttribute("height", `${height}`);
	svgElement.setAttribute("viewBox",`${x} ${y} ${width} ${height}`);
}


async function compute_links(selectedContextIndex)
{
	const ret1 = await db.query(`
 		SELECT json_agg(jsonb_build_object('left', t.x, 'right', t.x+r.width, 'top', t.y, 'bottom', t.y+r.height) ORDER BY r.idbox)
   		FROM translation t
     		JOIN rectangle r ON t.idrectangle=r.idrectangle
       		WHERE t.context=${selectedContextIndex}
 	`);

	const rectangles = ret1.rows[0].json_agg;

	const frame = compute_frame(rectangles);
	
// goal is to avoid negative number.
	const XY_TR = 1000;

	const rectdim = rectangles.map(r => [r.right-r.left, r.bottom-r.top])
				.flat()
				.map(i => hex(i,3))
				.join('');

	const translations = rectangles.map(r => [r.left, r.top])
					.flat()
					.map(i => i + XY_TR)	//protection against negative numbers
					.map(i => hex(i,3))
					.join('');

	const sframe = [frame.left, frame.right, frame.top, frame.bottom]
				.map(i => i + XY_TR)		//protection against negative numbers
				.map(i => hex(i,4))
				.join('');

	const ret3 = await db.query(`
 		WITH cte AS (
   			SELECT r.idbox
      			FROM translation t
	 		JOIN rectangle r ON t.idrectangle=r.idrectangle
    			WHERE t.context=${selectedContextIndex}
		)
 		SELECT coalesce(
   			json_agg(json_build_object('from', l.idbox_from, 'to', l.idbox_to) ORDER BY l.idlink),
      			'[]'::json
	 	)
   		FROM link l
     		JOIN cte cte_from ON cte_from.idbox = l.idbox_from
       		JOIN cte cte_to ON cte_to.idbox = l.idbox_to
       		WHERE l.idbox_from != l.idbox_to
       			AND NOT EXISTS (
	  			SELECT * 
      				FROM graph g
	  			JOIN tag t ON g.from_key = t.idtag
	  			WHERE g.to_table='link' AND g.to_key=l.idlink AND g.from_table='tag' 
      					AND t.type_code='RELATION_CATEGORY' AND t.code='TR2'
      			)
 	`);

	const links = ret3.rows[0].coalesce;

	const ret4 = await db.query(`
    		SELECT json_agg(r.idbox ORDER BY r.idbox)
      		FROM translation t
	 	JOIN rectangle r ON t.idrectangle=r.idrectangle
    		WHERE t.context=${selectedContextIndex}
 	`);

	const ids = ret4.rows[0].json_agg;

	const slinks = links
			.map(lk => [lk.from, lk.to])
			.flat()
			.map(i => ids.indexOf(i))
			.map(i => hex(i,2))
			.join('');

	console.log({rectangles, frame, links});

	const bombix = bombixModule.cwrap("bombix","string",["string","string","string","string"]);
	try{
		const jsonResponse = await bombix(rectdim, translations, sframe, slinks);
		const links_ = JSON.parse(jsonResponse)
				.map(({polyline, from, to}) => ({
					polyline: polyline.map(({x,y}) => ({x:x-XY_TR, y:y-XY_TR})), 
					from:ids[from], 
					to:ids[to]
					}));
		return links_;
	}
	catch(e){
		return [];
	}
}


async function handleDeselectSizer()
{
	const idbox = parseInt(sizer.id.substring('sizer_'.length));
	const g = sizer.parentElement;
	const svg = g.parentElement;
	const selectedContextIndex = parseInt(svg.id);

	const fO = document.querySelector(`foreignObject[id=box${idbox}]`);

	const width_ = parseInt(fO.getAttribute("width"));
	const height_ = parseInt(fO.getAttribute("height"));

	const ret = await db.query(`SELECT * FROM rectangle WHERE idbox=${idbox}`);
	const r = ret.rows[0];

	if (r.width == width_ && r.height == height_)
		return;

	const dx = width_ - r.width;
	const dy = height_ - r.height;

	await db.exec(`
 		UPDATE rectangle
   		SET width = width + ${dx}, height = height + ${dy}
     		WHERE idbox=${idbox}
 	`);

	const links = await compute_links(selectedContextIndex);
//	mycontexts.contexts[selectedContextIndex].links = await links;
	document.getElementById(`links_${selectedContextIndex}`).innerHTML = drawLinks(links);
}


async function handleDeselectElement()
{
	console.assert(g.parentNode.tagName=='svg');
	const idbox = parseInt(g.id.substring('g_'.length));
	const selectedContextIndex = parseInt(g.parentElement.id);

	const xForms = g.transform.baseVal;// an SVGTransformList
	const firstXForm = xForms.getItem(0); //an SVGTransform
	console.assert (firstXForm.type == SVGTransform.SVG_TRANSFORM_TRANSLATE);
	const translateX = firstXForm.matrix.e;
	const translateY = firstXForm.matrix.f;

	await db.exec(`
 		UPDATE translation t
   		SET x=${translateX}, y=${translateY}
     		FROM rectangle r
	 	WHERE t.idrectangle=r.idrectangle
   			AND r.idbox=${idbox}
 	`);

	enforce_bounding_rectangle(selectedContextIndex);

	const links = await compute_links(selectedContextIndex);
//	mycontexts.contexts[selectedContextIndex].links = await links;
	document.getElementById(`links_${selectedContextIndex}`).innerHTML = drawLinks(links);
}


function zeroPad(num, places)
{
	const zero = places - num.toString().length + 1;
	return Array(+(zero > 0 && zero)).join("0") + num;
}


const ZERO_PADDING_SIZE = 4;
const RECT_STROKE_WIDTH = 6;


function drawLinks(links)
{
	let innerHTML = "";

	for (const {from, to, polyline} of links)
	{
		const points = polyline.map((point, index) => `${index==0 ? "M":"L"}${point.x},${point.y}`);

		innerHTML += `<path id="${zeroPad(from,ZERO_PADDING_SIZE)}${zeroPad(to,ZERO_PADDING_SIZE)}" d="${points.join(" ")}" fill="none" stroke="black" stroke-width="100"  marker-end="url(#markerArrow)" />`;

		if (polyline.length >= 2)
		{
			const p1 = polyline[0];
			const p2 = polyline[1];
			const p3 = polyline[polyline.length - 2];
			const p4 = polyline[polyline.length - 1];

			if (p1.y==p2.y && p1.x > p2.x)	// left
				innerHTML += `<text x="${p1.x-5}" y="${p1.y-5}"></text>`;
			else if (p1.y==p2.y && p1.x < p2.x) // right
				innerHTML += `<text x="${p1.x+5}" y="${p1.y-5}"></text>`;
			else if (p1.x==p2.x && p1.y > p2.y) // up
				innerHTML += `<text x="${p1.x}" y="${p1.y-5}"></text>`;
			else if (p1.x==p2.x && p1.y < p2.y) // down
				innerHTML += `<text x="${p1.x}" y="${p1.y+10+5}"></text>`;

			if (p4.y==p3.y && p4.x > p3.x)	// right
				innerHTML += `<text x="${p4.x-5}" y="${p4.y+10+5}"></text>`;
			else if (p4.y==p3.y && p4.x < p3.x) // left
				innerHTML += `<text x="${p4.x+5}" y="${p4.y+10+5}"></text>`;
			else if (p4.x==p3.x && p4.y > p3.y) // down
				innerHTML += `<text x="${p4.x+5}" y="${p4.y-5}"></text>`;
			else if (p4.x==p3.x && p4.y < p3.y) // up
				innerHTML += `<text x="${p4.x+5}" y="${p4.y+10+5}"></text>`;
		}
	}

	return innerHTML;
}

async function drawDiagramStyle() {
	const ret = await db.query(`
 		WITH cte AS (
			SELECT FORMAT('#b%sf%s {background-color: %s;}', f.idbox, f.idfield, t.code) AS css
  			FROM graph g
    			JOIN tag t ON g.from_table='tag' AND g.from_key=t.idtag
      			JOIN field f ON g.to_table='field' AND g.to_key=f.idfield
      			WHERE t.type_code IN ('LINK_COLOR', 'COLOR')
	 	)
   		SELECT STRING_AGG(css, '\n')
     		FROM cte
	`);

 	const css = ret.rows[0].string_agg;
	return css;
}

async function drawDiagram() {

	let innerHTML = "";

	const ret = await db.query(`SELECT DISTINCT context FROM translation ORDER BY context`);

	const contexts = ret.rows;

	for (const {context:selectedContextIndex} of contexts)
	{
		const rectangles = await compute_rectangles(selectedContextIndex);
		const frame = compute_frame(rectangles);
		const links = await compute_links(selectedContextIndex);
		
		innerHTML += `<svg id="${selectedContextIndex}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width(frame)}" height="${height(frame)}" viewBox="${frame.left} ${frame.top} ${width(frame)} ${height(frame)}" title="" >
      <defs>
		<marker id="markerArrow"
	viewBox="0 0 10 10" refX="${9+RECT_STROKE_WIDTH/2}" refY="3"
          markerUnits="strokeWidth"
          markerWidth="10" markerHeight="10"
          orient="auto">
          <path d="M 0 0 L 0 6 L 9 3 z" />
        </marker>
      </defs>`;

/*
Elements in an SVG document fragment have an implicit drawing order, with the first elements in the SVG document fragment getting "painted" first.
Subsequent elements are painted on top of previously painted elements.
Links are drawn first, because of RECT_STOKE_WIDTH. Rectangle stroke is painted over a small part of the link (after the marker actually).
*/
		innerHTML += `<g id="links_${selectedContextIndex}">`;
		innerHTML += drawLinks(links);
		innerHTML += `</g>`;

		const ret = await db.query(`
  		WITH cte AS (
  			SELECT t.context, b.idbox, 1 AS position, FORMAT('
     				<g id="g_%1$s" transform="translate(%4$s,%5$s)">
				<rect id="rect_%1$s" width="%2$s" height="%3$s" />
				<foreignObject id="box%1$s" width="%2$s" height="%3$s">
     				<table id="box%1$s">
	  			<thead><tr><th id="b%1$s">%6$s</th></tr></thead>
       				<tbody>',
    				r.idbox, --%1
				r.width, --%2
    				r.height, --%3
				t.x, --%4
    				t.y, --%5
	 			b.title) --%6 
     					AS html
     			FROM translation t
			JOIN rectangle r ON t.idrectangle=r.idrectangle
    			JOIN box b ON r.idbox=b.idbox
       				UNION ALL
     			SELECT t.context, f.idbox, 2 AS position, STRING_AGG(FORMAT('<tr id="b%1$sf%2$s"><td id="b%1$sf%2$s">%3$s</td></tr>',
	  			f.idbox, --%1
     				f.idfield, --%2
	  			f.name),  --%3
      				'\n' ORDER BY sub.color, f.name) AS html
			FROM field f
  			JOIN rectangle r ON r.idbox=f.idbox
    			JOIN translation t ON t.idrectangle=r.idrectangle      
       			LEFT JOIN LATERAL (SELECT tag.code AS color
	  			FROM graph g 
      				JOIN tag ON tag.type_code='LINK_COLOR' AND tag.idtag=g.from_key
	  			WHERE g.from_table='tag'
	  				AND g.to_table='field'
       					AND g.to_key=f.idfield ORDER BY g.idgraph LIMIT 1) sub ON true 
       			GROUP BY t.context, f.idbox
  				UNION ALL
   			SELECT t.context, r.idbox, 3 AS position, FORMAT('
      				</tbody>
	  			</table>
      				</foreignObject>
	  			<rect id="sizer_%1$s" x="%2$s" y="%3$s" width="4" height="4" />
      				</g>',
     				r.idbox, --%1
	  			r.width - 4, --%2
       				r.height - 4) --%3 
					AS html
     			FROM translation t
	 		JOIN rectangle r ON t.idrectangle=r.idrectangle
        	)
		SELECT STRING_AGG(html, '\n' ORDER BY idbox, position)
		FROM cte
  		WHERE context=${selectedContextIndex}
   	`	);
		
		innerHTML += ret.rows[0].string_agg;
		innerHTML += '</svg>'
	}
	return innerHTML;
}


async function drawDiag()
{
	await updateColorLinks();
	const css = await drawDiagramStyle();
	console.log(css);
	document.getElementById("repartition").innerHTML = await drawRepartition();
	document.getElementById("diagram").innerHTML = await drawDiagram();
	addEventListeners();
	var sheet = document.getElementById("dynamic-sheet");
	sheet.innerHTML = css;

//making sure svg viewBox is computed in a unified way

	const ret = await db.query(`SELECT DISTINCT context FROM translation ORDER BY context`);
	const contexts = ret.rows;
	
	for (const {context:selectedContextIndex} of contexts)
	{
		enforce_bounding_rectangle(selectedContextIndex);		
	}
}


async function ApplyRepartition()
{
	const repartitionTable = document.getElementById("repartition");

	const repartiton = JSON.stringigy(repartitionTable.rows.map(row => ({
		idbox : parseInt(row.cells[0].innerText),
		context : parseInt(row.cells[2].innerText)		
	})));

	await db.exec(`
 		UPDATE translation t
   		SET t.context = repartition.context, t.x=FRAME_MARGIN*1.5, t.y=FRAME_MARGIN*1.5
		FROM rectangle r
  		JOIN json_to_recordset('${repartition}') AS repartition("idbox" int, "context" int) ON repartition.idbox=r.idbox
    		WHERE t.context != repartition.context
      			AND r.idrectangle=t.idrectangle
		)
 	`);

	updatePolylines();
}

async function updateContextPolylines(selectedContextIndex)
{
	enforce_bounding_rectangle(selectedContextIndex);
	const links = await compute_links(selectedContextIndex);
	const slinks = JSON.stringify(links);
	await db.exec(`
  		DELETE FROM polyline;

		INSERT INTO polyline(idlink, points, idtranslation_from, idtranslation_to)
		SELECT l.idlink, polyline_.points, t_from.idtranslation, t_to.idtranslation
  		FROM json_to_recordset('${slinks}) AS polyline_("from" int, "to" int, points json)
     		JOIN link l ON l.idbox_from=polyline_.from AND l.idbox_to=polyline_.to
		JOIN rectangle r_from ON r_from.idbox=l.idbox_from
   		JOIN translation t_from ON t_from.idrectangle=r_from.idrectangle
      		JOIN rectangle r_to ON r_to.idbox=l.idbox_to
   		JOIN translation t_to ON t_to.idrectangle=r_to.idrectangle
  	`);
}

async function updatePolylines()
{
	const ret = await db.query(`SELECT DISTINCT context FROM translation ORDER BY context`);

	const contexts = ret.rows;

	for (const selectedContextIndex of contexts)
	{
		updateContextPolylines(selectedContextIndex);
	}
}


async function drawRepartition()
{
	const ret = await db.query(`
 		SELECT STRING_AGG('<tr><td>' || b.idbox || '</td><td>' || b.title || '</td><td contenteditable="true">' || t.context || '</td></tr>', '' ORDER BY b.title)
   		FROM box b
     		JOIN rectangle r ON r.idbox=b.idbox
       		JOIN translation t ON t.idrectangle=r.idrectangle
 	`);

	const innerHTML = ret.rows[0].string_agg;
	return innerHTML;
}

function addEventListeners()
{
	document.querySelectorAll("svg > g[id^=g_]")
		.forEach(g => g.addEventListener("mousedown", event => selectElement(g)));
		
	document.querySelectorAll("svg")
		.forEach(svg => {
			svg.addEventListener("mousemove", event => {moveElement(event); moveSizer(event);});
			svg.addEventListener("mouseup", event => {deselectElement(g); deselectSizer(sizer);});
		});

	document.querySelectorAll("g > rect[id^=sizer_]")
		.forEach(sizer => sizer.addEventListener("mousedown", event => selectSizer(sizer)));
}


async function compute_rectangles(selectedContextIndex)
{
	const ret = await db.query(`
 		SELECT json_agg(json_build_object('left',t.x,'right',t.x+r.width,'top',t.y,'bottom',t.y+r.height) ORDER BY r.idbox)
   		FROM rectangle r
		JOIN translation t ON t.idrectangle=r.idrectangle
		WHERE t.context=${selectedContextIndex}
	`);
	return ret.rows[0].json_agg;
}

window.main = async function main()
{
	bombixModule = await createBombixModule();
	latuileModule = await createLatuileModule();
	await db.exec(schema);
	await db.exec(sample_diagdata);
	await db.exec(sample_contexts);
	await compute_tr2_link_tags();
	var sheet = document.createElement('style');
	sheet.id="dynamic-sheet";
	document.body.appendChild(sheet);
	await drawDiag();
	await init();
}

async function updateColorLinks(){

	const ret = await db.query('SELECT version();');
	const pg_version = ret.rows[0].version;

	const ret1 = await db.query(`
 		SELECT COUNT(*) FROM graph;
 	`);
	console.log(ret1);

	const ret2 = await db.query(`
		DELETE FROM graph
		WHERE from_table='tag' AND to_table='field' 
   		AND from_key IN (
   			SELECT idtag
       			FROM tag
	   		WHERE type_code='LINK_COLOR'
		);
  	`);

   	console.log(ret2);

    	const ret3 = await db.query(`
		WITH cte_link AS (
 			SELECT *, DENSE_RANK() OVER (ORDER BY idbox_to, idfield_to) rk
   			FROM link
   			WHERE idfield_from IS NOT NULL AND idfield_to IS NOT NULL
    		), link_color AS (
  			SELECT idtag, code AS color, ROW_NUMBER() OVER (ORDER BY idtag) AS rn 
     			FROM tag
			WHERE type_code='LINK_COLOR'
		), colored_link AS (
  			SELECT * 
    			FROM cte_link l
      			JOIN link_color c ON c.rn = l.rk
	 	), cte(from_key, to_key) AS (
     			SELECT idtag, idfield_from
      			FROM colored_link
   				UNION ALL
       			SELECT idtag, idfield_to
      			FROM colored_link
		), cte2 AS (
  			SELECT DISTINCT from_key, to_key
     			FROM cte
		)
  		INSERT INTO graph(from_table, from_key, to_table, to_key)
    		SELECT 'tag', from_key, 'field', to_key
      		FROM cte2
/*
	available in PostgreSQL 17

		MERGE INTO graph g
		USING cte2
		ON g.from_table=cte2.from_table AND g.from_key=cte2.from_key AND g.to_table=cte2.to_table AND g.to_key=cte2.to_key
		WHEN NOT MATCHED BY TARGET THEN
  			INSERT(from_table, from_key, to_table, to_key) VALUES(cte2.from_table, cte2.from_key, cte2.to_table, cte2.to_key)
		WHEN NOT MATCHED BY SOURCE THEN
  			DELETE;
*/
 	`);

	console.log(ret3);
}
