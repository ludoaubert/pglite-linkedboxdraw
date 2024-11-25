//import sample_contexts from "./contexts.json" with {type: "json"};
import {sample_contexts} from "./contexts.js";

import {default as createMyModule} from "./latuile-origine.js";
import {db, init, displayCurrent} from "./table_edit.js";
import {getFileData, download} from "./iocomponent.js";
import {schema} from "./schema.js"
import {sample_diagdata} from "./diagdata.js"

export {mycontexts, contexts, resetContexts, setContexts, drawDiag, compute_links, ApplyRepartition, enforce_bounding_rectangle, data2contexts};

const MONOSPACE_FONT_PIXEL_WIDTH=7;
const CHAR_RECT_HEIGHT=16;	// in reality 14,8 + 1 + 1 (top and bottom padding) = 16,8
const RECTANGLE_BOTTOM_CAP=200;

var Module;

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


async function data2contexts(mydata) {

	const ret1 = await db.query(`
 		WITH cte(idbox, width, height) AS (
   			SELECT idbox, 2*4 + LENGTH(title) * ${MONOSPACE_FONT_PIXEL_WIDTH}, 8 + ${CHAR_RECT_HEIGHT} FROM box
    			UNION ALL
       			SELECT idbox, LENGTH(name) * ${MONOSPACE_FONT_PIXEL_WIDTH}, ${CHAR_RECT_HEIGHT}  FROM field
		), cte2 AS (
  			SELECT idbox, MAX(width) AS width, LEAST(SUM(height), ${RECTANGLE_BOTTOM_CAP}) AS height
    			FROM cte
      			GROUP BY idbox
	 	)
   		SELECT json_agg(jsonb_build_object('left', 0, 'right', width, 'top', 0, 'bottom', height) ORDER BY idbox) AS rectangle
      		FROM cte2;
 	`);

	const rectangles = ret1.rows[0].json_agg;
	const rectdim = rectangles.map(r => hex(r.right-r.left,3)+hex(r.bottom-r.top,3));
	console.log(rectdim);

	const ret2 = await db.query(`
 		WITH cte_dense_idbox AS (
   			SELECT idbox, DENSE_RANK() OVER(ORDER BY idbox) AS dr
      			FROM box
		)
 		SELECT STRING_AGG(FORMAT('%1$%2$', LPAD(to_hex(d_from.idbox-1),3,'0'), LPAD(to_hex(d_to.idbox-1),3,'0')),'')
   		FROM link l
     		JOIN cte_dense_idbox d_from ON d_from.idbox = l.idbox_from
       		JOIN cte_dense_idbox d_to ON d_to.idbox = l.idbox_to
     		WHERE NOT EXISTS (
     			SELECT *
			FROM graph g 
       			JOIN tag t ON t.idtag = g.from_key AND t.type_code='RELATION_CATEGORY' AND t.code='TR2' 
	  		WHERE g.from_table='tag' AND g.to_table='link' AND g.to_key=l.idlink
     		);
 	`);

	const slinks = ret2.rows[0];
	console.log(slinks);

	const bombix = Module.cwrap("bombix","string",["string","string","string","string"]);
	const latuile = Module.cwrap("latuile","string",["string","string"]);

	const jsonResponse = latuile(rectdim.join(''), slinks);
	console.log(jsonResponse);

	mycontexts = JSON.parse(jsonResponse);
	mycontexts.rectangles = rectangles;
	
	for (const [selectedContextIndex, context] of mycontexts.contexts.entries())
		context.links = await (selectedContextIndex);
	
	return mycontexts;
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

	const i = sizer.id.substring("sizer_".length);

	let fO = document.querySelector(`foreignObject[id=box${i}]`);

	const width = parseInt(fO.getAttribute("width"));
	const height = parseInt(fO.getAttribute("height"));

	fO.setAttribute("width", `${width+dx}`);
	fO.setAttribute("height", `${height+dy}`);

	let rect = document.querySelector(`rect[id=rect_${i}]`);

	rect.setAttribute("width", `${width+dx}`);
	rect.setAttribute("height", `${height+dy}`);

	const x = parseInt(sizer.getAttribute("x"));
	const y = parseInt(sizer.getAttribute("y"));

	sizer.setAttribute("x", `${x+dx}`);
	sizer.setAttribute("y", `${y+dy}`);

	const g = sizer.parentElement;
	const svg = g.parentElement;
	const selectedContextIndex = parseInt(svg.id);	
	
	const xForms = g.transform.baseVal;// an SVGTransformList
	const firstXForm = xForms.getItem(0); //an SVGTransform
	console.assert (firstXForm.type == SVGTransform.SVG_TRANSFORM_TRANSLATE);
	const translateX = firstXForm.matrix.e;
	const translateY = firstXForm.matrix.f;
	
	const r = {
		left: translateX - MOVE_RANGE,
		right: translateX + width + dx + MOVE_RANGE,
		top: translateY - MOVE_RANGE,
		bottom: translateY + height + dy + MOVE_RANGE
	};
	
	enforce_bounding_rectangle(selectedContextIndex, r);

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

	const selectedContextIndex = parseInt(g.parentElement.id);

	const i = g.id.substring("g_".length);

	let fO = document.querySelector(`foreignObject[id=box${i}]`);

	const width = parseInt(fO.getAttribute("width"));
	const height = parseInt(fO.getAttribute("height"));

	const xForms = g.transform.baseVal;// an SVGTransformList
	const firstXForm = xForms.getItem(0); //an SVGTransform
	console.assert (firstXForm.type == SVGTransform.SVG_TRANSFORM_TRANSLATE);
	const translateX = firstXForm.matrix.e;
	const translateY = firstXForm.matrix.f;
	
	const r = {
		left: translateX - MOVE_RANGE,
		right: translateX + width + MOVE_RANGE,
		top: translateY - MOVE_RANGE,
		bottom: translateY + height + MOVE_RANGE
	};

	enforce_bounding_rectangle(selectedContextIndex, r);

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

function enforce_bounding_rectangle(selectedContextIndex, r=null)
{
	let context = mycontexts.contexts[selectedContextIndex];

	const rectangles = context.translatedBoxes
				.map(tB => {
					const rect = document.querySelector(`rect[id=rect_${tB.id}]`);

					const width = parseInt(rect.getAttribute("width"));
					const height = parseInt(rect.getAttribute("height"));
					
					const g = document.querySelector(`g[id=g_${tB.id}]`);
					
					const xForms = g.transform.baseVal;// an SVGTransformList
					const firstXForm = xForms.getItem(0); //an SVGTransform
					console.assert (firstXForm.type == SVGTransform.SVG_TRANSFORM_TRANSLATE);
					const translateX = firstXForm.matrix.e;
					const translateY = firstXForm.matrix.f;
					
					return {
						left: translateX,
						right: translateX + width,
						top: translateY,
						bottom: translateY + height
					};
				});
	
	const frame = compute_frame(rectangles);
	
	let svgElement = document.querySelector(`svg[id="${selectedContextIndex}"]`);

	const [x, y, w, h] = svgElement.getAttribute("viewBox")
								.split(' ')
								.map(num => parseInt(num));
								
	const viewBox = {left:x, right:x+w, top:y, bottom:y+h};
	
//test if frame is contained inside viewBox.

	if (!(viewBox.left <= frame.left && frame.right <= viewBox.right && viewBox.top <= frame.top && frame.bottom <= viewBox.bottom))
	{
//if it is not contained, use the envelop of frame and r if r is not null.
		const _frame = compute_frame(r == null ? rectangles : [...rectangles, r]);

		const width_ = width(_frame);
		const height_ = height(_frame);
		const x = _frame.left;
		const y = _frame.top;
		
		console.log(`updating viewBox to ${x} ${y} ${width_} ${height_}`);

		svgElement.setAttribute("width", `${width_}`);
		svgElement.setAttribute("height", `${height_}`);
		svgElement.setAttribute("viewBox",`${x} ${y} ${width_} ${height_}`);
	}
	
	if (r == null)
	{
		const width_ = width(frame);
		const height_ = height(frame);
		const x = frame.left;
		const y = frame.top;

		console.log(`updating viewBox to ${x} ${y} ${width_} ${height_}`);
		
		svgElement.setAttribute("width", `${width_}`);
		svgElement.setAttribute("height", `${height_}`);
		svgElement.setAttribute("viewBox",`${x} ${y} ${width_} ${height_}`);		
		context.frame = frame;
	}
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
 		SELECT json_agg(json_build_object('from', l.idbox_from, 'to', l.idbox_to) ORDER BY l.idlink)
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

	const links = ret3.rows[0].json_agg;

	const ret4 = await db.query(`
    		SELECT json_agg(r.idbox ORDER BY r.idbox)
      		FROM translation t
	 	JOIN rectangle r ON t.idrectangle=r.idrectangle
    		WHERE t.context=${selectedContextIndex}
 	`);

	const ids = ret4.rows[0].json_agg;
	
	const slinks = links
			.map(lk => [ids.indexOf(lk.from), ids.indexOf(lk.to)])
			.flat()
			.map(i => hex(i,2))
			.join('');

	console.log({rectangles, frame, links});

//	const bombix = Module.cwrap("bombix","string",["string","string","string","string"])
	const jsonResponse = '[]';//await bombix(rectdim, translations, sframe, slinks);
	const links_ = await JSON.parse(jsonResponse)
				.map(({polyline, from, to}) => ({
					polyline: polyline.map(({x,y}) => ({x:x-XY_TR, y:y-XY_TR})), 
					from:ids[from], 
					to:ids[to]
					}));
	return links_;
}


async function handleDeselectSizer()
{
	const i = parseInt(sizer.id.substring('sizer_'.length));
	const g = sizer.parentElement;
	const svg = g.parentElement;
	const selectedContextIndex = parseInt(svg.id);

	const fO = document.querySelector(`foreignObject[id=box${i}]`);

	const width_ = parseInt(fO.getAttribute("width"));
	const height_ = parseInt(fO.getAttribute("height"));

	const r = mycontexts.rectangles[i];

	if (width(r) == width_ && height(r) == height_)
		return;

	const dx = width_ - width(r);
	const dy = height_ - height(r);

	await db.exec(`
 		UPDATE rectangle
   		SET width=width + ${dx}, height=height+${dy}
     		WHERE idbox=${i}
 	`);

	enforce_bounding_rectangle(selectedContextIndex);

	const links = await compute_links(selectedContextIndex);
	mycontexts.contexts[selectedContextIndex].links = await links;
	document.getElementById(`links_${selectedContextIndex}`).innerHTML = await drawLinks(links);
}


async function handleDeselectElement()
{
	console.assert(g.parentNode.tagName=='svg');
	const id = parseInt(g.id.substring('g_'.length));
	const selectedContextIndex = parseInt(g.parentElement.id);

	let tB = mycontexts.contexts[selectedContextIndex].translatedBoxes.find(tB => tB.id == id);

	const xForms = g.transform.baseVal;// an SVGTransformList
	const firstXForm = xForms.getItem(0); //an SVGTransform
	console.assert (firstXForm.type == SVGTransform.SVG_TRANSFORM_TRANSLATE);
	const translateX = firstXForm.matrix.e;
	const translateY = firstXForm.matrix.f;

	if (tB.translation.x == translateX && tB.translation.y == translateY)
		return;

	tB.translation = {"x": translateX, "y": translateY};

	enforce_bounding_rectangle(selectedContextIndex);

	const links = await compute_links(selectedContextIndex);
	mycontexts.contexts[selectedContextIndex].links = await links;
	document.getElementById(`links_${selectedContextIndex}`).innerHTML = await drawLinks(links);
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
	var innerHTML = "";

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


async function drawDiagram() {

	var innerHTML = "";

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
  			SELECT t.context, b.idbox, 1 AS position, FORMAT('<g id="g_%1$" transform="translate(%4$,%5$)">
				<rect id="rect_%1$" x="%4$" y="%5$" width="%2$" height="%3$" />
				<foreignObject id="box%1$" width="%2$" height="%3$">
     				<table id="box%1$" contenteditable="true" spellcheck="false">
	  			<thead><tr><th id="b%1$">%6$</th></tr></thead>
       				<tbody>',
    				r.idbox, --%1
				r.width, --%2
    				r.height, --%3
				t.x, --%4
    				t.y) --%5
	 			b.title) /*%6*/ AS html
     			FROM translation t
			JOIN rectangle r ON t.idrectangle=r.idrectangle
    			JOIN box b ON r.idbox=b.idbox
      				UNION ALL
     			SELECT t.context, f.idbox, 2 AS position, STRING_AGG(FORMAT('<tr id="b%1$f%2$"><td id="b%1$f%2$">%3$</td></tr>',
	  			f.idbox, --%1
     				f.idfield, --%2
	  			f.name),  /*%3*/
      				'\n' ORDER BY f.name) AS html
			FROM field f
  			JOIN rectangle r ON r.idbox=f.idbox
    			JOIN translation t ON t.idrectangle=r.idrectangle
       			GROUP BY t.context, f.idbox
  				UNION ALL
   			SELECT t.context, r.idbox, 3 AS position, FORMAT('</tbody></table></foreignObject><rect id="sizer_%1$" x="%2$" y="%3$" width="4" height="4" />',
     				r.idrectangle, --%1
	  			t.x + r.width - 4, --%2
       				t.y + r.height - 4) /*%3*/ AS html
     			FROM translation t
	 		JOIN rectangle r ON t.idrectangle=r.idrectangle
    		)
      		SELECT context, html, idbox, position
		--SELECT STRING_AGG(html, '\n' ORDER BY idbox, position)
		FROM cte
  		WHERE context=${selectedContextIndex}
   	`	);
		innerHTML += ret.rows[0];
		innerHMTL += '</svg>'
	}
	return innerHTML;
}


async function drawDiag()
{
	document.getElementById("repartition").innerHTML = await drawRepartition();
	document.getElementById("diagram").innerHTML = await drawDiagram();
	addEventListeners();
	updateCutLinks();
}


async function ApplyRepartition()
{
	const repartitionTable = document.getElementById("repartition");

	const repartiton = JSON.stringigy(repartitionTable.rows.map(row => ({
		idbox : parseInt(row.cells[0].innerText),
		context : parseInt(row.cells[2].innerText)		
	})));

	await db.exec(`
 		UPDATE t
   		SET t.context = repartition.context, t.x=FRAME_MARGIN*1.5, t.y=FRAME_MARGIN*1.5
		FROM translation t
  		JOIN rectangle r ON r.idrectangle=t.idrectangle
  		JOIN json_to_recordset('${repartition}') AS repartition("idbox" int, "context" int) ON repartition.idbox=r.idbox
    		WHERE t.context != repartition.context
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
	Module = await createMyModule();
	await db.exec(schema);
	await db.exec(sample_diagdata);
	await db.exec(sample_contexts);
	await drawDiag();
	init();
	
//making sure svg viewBox is computed in a unified way

	const ret = await db.query(`SELECT DISTINCT context FROM translation ORDER BY context`);
	const contexts = ret.rows;
	
	for (const selectedContextIndex of contexts)
	{		
		const rectangles = compute_rectangles(selectedContextIndex);
		const frame = compute_frame(rectangles);

		await db.exec(`UPDATE frame SET width=${width(frame)}, height=${height(frame)}`);

		const width_ = width(frame);
		const height_ = height(frame);
		const x = frame.left;
		const y = frame.top;

		let svgElement = document.querySelector(`svg[id="${selectedContextIndex}"]`);
		svgElement.setAttribute("width", `${width_}`);
		svgElement.setAttribute("height", `${height_}`);
		svgElement.setAttribute("viewBox",`${x} ${y} ${width_} ${height_}`);		
	}
}

async function expressCutLinks(){

	await db.exec(`

		DELETE g
  		FROM graph g
    		JOIN tag t ON g.from_table='tag' AND g.from_key=t.idtag
      		WHERE t.type_code='CUT_LINK_COLOR';

 		WITH cte_cut_link AS (
 			SELECT l.*, DENSE_RANK()-1 OVER (ORDER BY idbox_to, idfield_to) rk
   			FROM link l
     			JOIN rectangle r_from ON r_from.idbox=l.idbox_from
       			JOIN rectangle t_to ON r_to.idbox=l.idbox_to
	 		JOIN translation t_from ON t_from.idrectangle=r_from.idrectangle
	 		JOIN translation t_to ON t_to.idrectangle=r_to.idrectangle
   			WHERE t_from.context != t_to.context AND l.idfield_from IS NOT NULL AND l.idfield_to IS NOT NULL
     				OR EXISTS(
	     				SELECT *
					FROM graph g 
       					JOIN tag t ON t.idtag = g.from_key AND t.type_code='RELATION_CATEGORY' AND t.code='TR2' 
	  				WHERE g.from_table='tag' AND g.to_table='link' AND g.to_key=l.idlink
				)
    		), cut_link_color AS (
  			SELECT idtag, code AS color, ROW_NUMBER()-1 OVER (ORDER BY idtag) AS rn, COUNT(*) AS nb 
     			FROM tag
			WHERE type_code='CUT_LINK_COLOR'
		), colored_cut_link AS (
  			SELECT * 
    			FROM cte_cut_link l
      			JOIN cut_link_color c ON c.rn = l.rk % c.nb
	 	), cte(from_table, from_key, to_table, to_key) AS (
   			SELECT 'tag', idtag, 'box', idbox_from
      			FROM colored_cut_link
	 			UNION ALL
     			SELECT 'tag', idtag, 'field', idfield_from
      			FROM colored_cut_link
	 			UNION ALL
     			SELECT 'tag', idtag, 'box', idbox_to
			FROM colored_cut_link
   				UNION ALL
       			SELECT 'tag', idtag, 'field', idfield_to
      			FROM colored_cut_link
		)
  		INSERT INTO graph(from_table, from_key, to_table, to_key)
    		SELECT from_table, from_key, to_table, to_key
      		FROM cte;
 	`);

	const ret = await db.query(`
		SELECT json_agg(json_build_object('id', LEFT(to_table,1) || to_key, 'color', t.code))
  		FROM graph g
    		JOIN tag t ON g.from_table='tag' AND g.from_key=t.idtag
      		WHERE t.type_code='CUT_LINK_COLOR';
	`);

 	const styleMap = ret.rows[0].json_agg;
  
	for (const [id, color] of styleMap)
	{
		document.getElementById(id).style.backgroundColor = color;
	}
}
