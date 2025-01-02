import { PGlite } from "https://cdn.jsdelivr.net/npm/@electric-sql/pglite/dist/index.js"

import {drawDiag, compute_links, ApplyRepartition, enforce_bounding_rectangle} from "./diagload.js";
import {data2contexts} from "./diagload.js";
import {MONOSPACE_FONT_PIXEL_WIDTH, CHAR_RECT_HEIGHT, RECTANGLE_BOTTOM_CAP} from "./diagload.js";

import {schema} from "./schema.js"
import {delete_from_tables} from "./delete_from_tables.js"
	
export {db, init, displayCurrent};

const db = new PGlite();

var currentBoxIndex = -1;
var currentFieldIndex = -1;

var currentFromBoxIndex = -1;
var currentFromFieldIndex = -1;

var currentToBoxIndex = -1;
var currentToFieldIndex = -1;

var currentColorBoxIndex = -1;
var currentColorFieldIndex = -1;

var input ;
var upload ;
var download ;
var downloadDiagramListButton ;
var onlineDocumentCombo ;
var editTitle ;
var newDiagramButton ;
var boxCombo ;
var addBoxButton ;
var dropBoxButton ;
var updateBoxButton ;
var fieldCombo ;
var addFieldButton ;
var dropFieldButton ;
var updateFieldButton ;
var valueCombo ;
var editValueButton;
var addValueButton;
var dropValueButton;
var updateValueButton;
var boxCommentTextArea ;
var updateBoxCommentButton ;
var dropBoxCommentButton ;
var fieldCommentTextArea ;
var updateFieldCommentButton;
var dropFieldCommentButton;
var linkCombo ;
var dropLinkButton ;
var addLinkButton ;
var updateLinkButton ;
var newBoxEditField ;
var newFieldEditField ;
var fromBoxCombo ;
var fromFieldCombo ;
var fromCardinalityCombo ;
var toBoxCombo ;
var toFieldCombo ;
var toCardinalityCombo ;
var newValueEditField ;
var colorBoxCombo ;
var colorFieldCombo ;
var colorCombo ;
var colorsCombo ;
var dropColorButton;
var addColorButton;
var updateColorButton;
var applyRepartitionButton;

function newDiagram() {

	mydata={documentTitle:"", boxes:[], values:[], boxComments:[], fieldComments:[], links:[], fieldColors:[]};
	const mycontexts_={
		contexts:[{frame:{left:0,right:1197,top:0,bottom:507}, translatedBoxes:[], links:[]}],
		rectangles:[]
	};
	
	setContexts(mycontexts_);

	currentBoxIndex = -1;
	currentFieldIndex = -1;

	currentFromBoxIndex = -1;
	currentFromFieldIndex = -1;

	currentToBoxIndex = -1;
	currentToFieldIndex = -1;

	currentColorBoxIndex = -1;
	currentColorFieldIndex = -1;
}

async function init() {

	input = document.getElementById("fi");
	upload = document.getElementById("upload_online_doc");
	download = document.getElementById("download_online_doc");
	onlineDocumentCombo = document.getElementById("online_docs");
	downloadDiagramListButton = document.getElementById("download_diagram_list"); 
	editTitle = document.getElementById("title");
	newDiagramButton = document.getElementById("new diagram");
	boxCombo = document.getElementById("boxes");
	addBoxButton = document.getElementById("add box");
	dropBoxButton = document.getElementById("drop box");
	updateBoxButton = document.getElementById("update box");
	fieldCombo = document.getElementById("fields");
	addFieldButton = document.getElementById("add field");
	dropFieldButton = document.getElementById("drop field");
	updateFieldButton = document.getElementById("update field");
	valueCombo = document.getElementById("values");
	editValueButton = document.getElementById("edit value");
	addValueButton = document.getElementById("add value");
	dropValueButton = document.getElementById("drop value");
	updateValueButton = document.getElementById("update value");
	boxCommentTextArea = document.getElementById("box comment");
	updateBoxCommentButton = document.getElementById("update box comment");
	dropBoxCommentButton = document.getElementById("drop box comment");
	fieldCommentTextArea = document.getElementById("field comment");
	updateFieldCommentButton = document.getElementById("update field comment");
	dropFieldCommentButton = document.getElementById("drop field comment");
	linkCombo = document.getElementById("links");
	dropLinkButton = document.getElementById("drop link");
	addLinkButton = document.getElementById("add link");
	newBoxEditField = document.getElementById("new box");
	newFieldEditField = document.getElementById("new field");
	fromBoxCombo = document.getElementById("from boxes");
	fromFieldCombo = document.getElementById("from fields");
	fromCardinalityCombo = document.getElementById("from cardinality");
	toBoxCombo = document.getElementById("to boxes");
	toFieldCombo = document.getElementById("to fields");
	toCardinalityCombo = document.getElementById("to cardinality");
	newValueEditField = document.getElementById("new value");
	colorBoxCombo = document.getElementById("color boxes");
	colorFieldCombo = document.getElementById("color fields");
	colorCombo = document.getElementById("color");
	colorsCombo = document.getElementById("colors");
	dropColorButton = document.getElementById("drop color");
	addColorButton = document.getElementById("add color");
	updateColorButton = document.getElementById("update color");
	applyRepartitionButton = document.getElementById("apply repartition");

	const ret1 = await db.query(`SELECT string_agg('<option>' || code || '</option>', '' ORDER BY code) FROM tag WHERE type_code='RELATION_CARDINALITY'`);
	const innerHTML = ret1.rows[0].string_agg;

	fromCardinalityCombo.innerHTML = innerHTML;
	toCardinalityCombo.innerHTML = innerHTML;

	document.querySelectorAll("button.collapsible")
			.forEach(button => {
				button.addEventListener("click", (event) => switchCollapsible(button));
			});

	input.addEventListener("change", async (evt)=>{

		const file = evt.target.files[0];
 		const diagData = await file.text(); 
		await db.exec(delete_from_tables);
		await db.exec(diagData);
		await data2contexts();
	});
	downloadDiagramListButton.addEventListener("click", async (evt)=>{
		const response = await fetch(
			//"https://www.diskloud.fr:3000/linkedboxdraw/list",
			"https://192.168.0.21:8443/linkedboxdraw/list"
		);
		const sjson = await response.json();
		console.log(sjson);
		const json = JSON.parse(sjson);
		const innerHTML = json.map(({uuid_diagram, title})=>`<option>${title}</option>`).join('');
		onlineDocumentCombo.innerHTML = innerHTML;
	});
	download.addEventListener("click", async (evt)=>{
		const response = await fetch(
			//"https://www.diskloud.fr:3000/linkedboxdraw/list",
			"https://192.168.0.21:8443/linkedboxdraw/list"
		);
		const sjson = await response.json();
		console.log(sjson);
		const json = JSON.parse(sjson);
		const {uuid_diagram, title} = json[onlineDocumentCombo.selectedIndex];

		const response2 = await fetch(
			//"https://www.diskloud.fr:3000/linkedboxdraw/get",
			`https://192.168.0.21:8443/linkedboxdraw/get?uuid_diagram=${uuid_diagram}`
		);
		const sjson2 = await response2.json();
		const json_doc = JSON.parse(sjson2);
		
		await db.exec(delete_from_tables);

		const ret1 = await db.query(`
  			WITH cte (table_name, columns) AS (
				SELECT table_name, STRING_AGG(FORMAT('%s %s', column_name, data_type),', ' ORDER BY ordinal_position)
				FROM INFORMATION_SCHEMA.COLUMNS
				WHERE table_schema='public'
				GROUP BY table_name
			)
			SELECT json_object_agg(table_name, columns)
			FROM cte
  		`);
		const column_list = ret1.rows[0].json_object_agg;
		const query = `
  			INSERT INTO diagram SELECT * FROM json_to_recordset('${JSON.stringify(json_doc.diagram)}') AS rd(${column_list.diagram});
  			INSERT INTO box SELECT * FROM json_to_recordset('${JSON.stringify(json_doc.box)}') AS rd(${column_list.box});
  			INSERT INTO field SELECT * FROM json_to_recordset('${JSON.stringify(json_doc.field)}') AS rd(${column_list.field});
  			INSERT INTO value SELECT * FROM json_to_recordset('${JSON.stringify(json_doc.value)}') AS rd(${column_list.value});
  			INSERT INTO link SELECT * FROM json_to_recordset('${JSON.stringify(json_doc.link)}') AS rd(${column_list.link});
  			INSERT INTO tag SELECT * FROM json_to_recordset('${JSON.stringify(json_doc.tag)}') AS rd(${column_list.tag});
  			INSERT INTO message_tag SELECT * FROM json_to_recordset('${JSON.stringify(json_doc.message_tag)}') AS rd(${column_list.message_tag});
  			INSERT INTO graph SELECT * FROM json_to_recordset('${JSON.stringify(json_doc.graph)}') AS rd(${column_list.graph});
  			INSERT INTO rectangle SELECT * FROM json_to_recordset('${JSON.stringify(json_doc.rectangle)}') AS rd(${column_list.rectangle});
  			INSERT INTO translation SELECT * FROM json_to_recordset('${JSON.stringify(json_doc.translation)}') AS rd(${column_list.translation});
  			INSERT INTO polyline SELECT * FROM json_to_recordset('${JSON.stringify(json_doc.polyline)}') AS rd(${column_list.polyline});
  		`;

		console.log(query);
		await db.exec(query);
		await data2contexts();
	});
	upload.addEventListener("click", async (evt)=>{
		const ret = await db.query(`
  			SELECT json_build_object(
				'diagram', (SELECT json_agg(row_to_json(diagram))::json FROM diagram),
				'box', (SELECT json_agg(row_to_json(box))::json FROM box),
				'field', (SELECT json_agg(row_to_json(field))::json FROM field),
				'value', (SELECT coalesce(json_agg(row_to_json(value))::json, '[]'::json) FROM value),
				'link', (SELECT json_agg(row_to_json(link))::json FROM link),
				'tag', (SELECT json_agg(row_to_json(tag))::json FROM tag),
				'message_tag', (SELECT coalesce(json_agg(row_to_json(message_tag))::json, '[]'::json) FROM message_tag),
				'graph', (SELECT json_agg(row_to_json(graph))::json FROM graph),
				'rectangle', (SELECT json_agg(row_to_json(rectangle))::json FROM rectangle),
				'translation', (SELECT json_agg(row_to_json(translation))::json FROM translation),
				'polyline', (SELECT coalesce(json_agg(row_to_json(polyline))::json, '[]'::json) FROM polyline)
			);
   		`);

		const doc = ret.rows[0].json_build_object;
		const json_doc = JSON.stringify(doc);
		console.log(json_doc);
		const response = await fetch(
			//"https://www.diskloud.fr:3000/linkedboxdraw/post",
			"https://192.168.0.21:8443/linkedboxdraw/post",
			{
				method: "POST",
				body: json_doc,
				headers: {"Content-Type": "application/json"}
			}
		);
		console.log(response.status);
	});
	editTitle.addEventListener("change", updateTitle);
	newDiagramButton.addEventListener("click", async () => {await newDiagram(); await displayCurrent(); await drawDiag();});
	boxCombo.addEventListener("change", async () => {currentBoxIndex = -1; await displayCurrent();});
	addBoxButton.addEventListener("click", addNewBox);
	dropBoxButton.addEventListener("click", dropBox);
	updateBoxButton.addEventListener("click", updateBox);
	updateBoxCommentButton.addEventListener("click", updateBoxComment) ;
	dropBoxCommentButton.addEventListener("click", dropBoxComment) ;
	fieldCombo.addEventListener("change", async () => {currentFieldIndex = -1; await displayCurrent();});
	addFieldButton.addEventListener("click", addNewFieldToBox) ;
	dropFieldButton.addEventListener("click", dropFieldFromBox) ;
	updateFieldButton.addEventListener("click", updateField) ;
	updateFieldCommentButton.addEventListener("click", updateFieldComment);
	dropFieldCommentButton.addEventListener("click", dropFieldComment);
	editValueButton.addEventListener("click", editValueFromField);
	addValueButton.addEventListener("click", addNewValueToField);
	dropValueButton.addEventListener("click", dropValueFromField);
	updateValueButton.addEventListener("click", updateValue);
	linkCombo.addEventListener("click", linkComboOnClick);
	dropLinkButton.addEventListener("click", async () => {await linkComboOnClick(); await dropLink();});
	fromBoxCombo.addEventListener("change", async () => {currentFromBoxIndex = -1; await displayCurrent();});
	fromFieldCombo.addEventListener("change", async () => {currentFromFieldIndex = -1; await displayCurrent();});
	toBoxCombo.addEventListener("change", async () => {currentToBoxIndex = -1; await displayCurrent();});
	toFieldCombo.addEventListener("change", async () => {currentToFieldIndex = -1; await displayCurrent();});
	addLinkButton.addEventListener("click", addNewLink) ;
	colorsCombo.addEventListener("click", colorsComboOnClick);
	dropColorButton.addEventListener("click", dropColor);
	colorBoxCombo.addEventListener("change", async () => {currentColorBoxIndex = -1; await displayCurrent();});
	colorFieldCombo.addEventListener("change", async () => {currentColorFieldIndex = -1; await displayCurrent();});
	addColorButton.addEventListener("click", addNewColor);
	updateColorButton.addEventListener("click", updateColor);
	applyRepartitionButton.addEventListener("click", async () => {await ApplyRepartition(); await drawDiag();});

//avoid duplicate entries
	newBoxEditField.addEventListener("change", async () => {
		const ret = await db.query(`SELECT idbox FROM box WHERE title='${newBoxEditField.value}'`);
		addBoxButton.disabled = (newBoxEditField.value == '' || ret.length>0) ? true : false;
	});
	newFieldEditField.addEventListener("change", async () => {
		const ret = await db.query(`SELECT COALESCE(idbox, -1) FROM box WHERE title='${boxCombo.value}'`);
		currentBoxIndex = ret.rows[0].coalesce;
		if (currentBoxIndex == -1)
			addFieldButton.disabled = true;
		else
		{
			const ret = await db.query(`SELECT idfield FROM field  WHERE name='${newFieldEditField.value}' AND idbox=${currentBoxIndex}`);
			addFieldButton.disabled = (newFieldEditField.value == '' || ret.length==1) ? true : false;
		}
	});

	const ret = await db.query(`SELECT STRING_AGG('<option>' || code || '</option>','' order by code) FROM tag WHERE type_code='COLOR'`);
	colorCombo.innerHTML = ret.rows[0].string_agg;

	await displayCurrent();
}

async function displayCurrent()
{
	const ret = await db.query(`SELECT title FROM diagram WHERE iddiagram=1`);
	const documentTitle = ret.rows[0].title ;
	if (editTitle.value != documentTitle)
		editTitle.value = documentTitle;

	let contexts = [
		{boxCombo_:boxCombo, fieldCombo_:fieldCombo, currentBoxIndex_:currentBoxIndex, currentFieldIndex_:currentFieldIndex},
		{boxCombo_:fromBoxCombo, fieldCombo_:fromFieldCombo, currentBoxIndex_:currentFromBoxIndex, currentFieldIndex_:currentFromFieldIndex},
		{boxCombo_:toBoxCombo, fieldCombo_:toFieldCombo, currentBoxIndex_:currentToBoxIndex, currentFieldIndex_:currentToFieldIndex},
		{boxCombo_:colorBoxCombo, fieldCombo_:colorFieldCombo, currentBoxIndex_:currentColorBoxIndex, currentFieldIndex_:currentColorFieldIndex},		
	];

	for (let [index, {boxCombo_, fieldCombo_, currentBoxIndex_, currentFieldIndex_}] of contexts.entries())
	{
		if (currentBoxIndex_ == -1 && boxCombo_.value != "")
		{
			const ret = await db.query(`SELECT idbox FROM box WHERE title='${boxCombo_.value}'`);
			currentBoxIndex_ = ret.rows[0].idbox;
		}
		const ret1 = await db.query(`SELECT STRING_AGG('<option>' || title || '</option>', '' ORDER BY title) FROM box`);
		const boxComboInnerHTML = ret1.rows[0].string_agg;

		if (boxCombo_.innerHTML != boxComboInnerHTML)
		{
			boxCombo_.innerHTML = boxComboInnerHTML;
			if (currentBoxIndex_ == -1)
			{
				const ret = await db.query(`SELECT idbox FROM box ORDER BY title LIMIT 1`);
				currentBoxIndex_ = ret.rows[0].idbox;
			}
		}

		const ret2 = await db.query(`SELECT COALESCE(MAX(title), '') FROM box WHERE idbox=${currentBoxIndex_}`);
		boxCombo_.value = ret2.rows[0].coalesce;

		const ret3 = await db.query(`SELECT STRING_AGG('<option>' || name || '</option>', '' ORDER BY name) FROM field WHERE idbox = ${currentBoxIndex_}`);
		const fieldComboInnerHTML = ret3.rows[0].string_agg;

		if (fieldCombo_.innerHTML != fieldComboInnerHTML)
		{
			fieldCombo_.innerHTML = fieldComboInnerHTML;
			if (currentFieldIndex_ == -1)
			{
				const ret = await db.query(`SELECT idfield FROM field WHERE idbox=${currentBoxIndex_} ORDER BY name LIMIT 1`);
				currentFieldIndex_ = ret.length > 0 ? ret.rows[0].idfeld : -1;
			}
		}

		const ret4 = await db.query(`SELECT COALESCE(MAX(idfield), -1) FROM field WHERE idbox=${currentBoxIndex_} AND name='${fieldCombo_.value}'`);
		currentFieldIndex_ = ret4.rows[0].coalesce; // -1;

		contexts[index] = {boxCombo_, fieldCombo_, currentBoxIndex_, currentFieldIndex_};
	}

	currentBoxIndex = contexts[0].currentBoxIndex_;
	currentFieldIndex = contexts[0].currentFieldIndex_;
	currentFromBoxIndex = contexts[1].currentBoxIndex_;
	currentFromFieldIndex = contexts[1].currentFieldIndex_;
	currentToBoxIndex = contexts[2].currentBoxIndex_;
	currentToFieldIndex = contexts[2].currentFieldIndex_;
	currentColorBoxIndex = contexts[3].currentBoxIndex_;
	currentColorFieldIndex = contexts[3].currentFieldIndex_;

	const ret3 = await db.query(`
 		SELECT STRING_AGG('<option>' || v.data || '</option>', '' ORDER BY v.data)
   		FROM value v
     		JOIN field f ON v.idfield=f.idfield
       		JOIN box b ON b.idbox=f.idbox
	 	WHERE b.title='${boxCombo.value}' AND f.name='${fieldCombo.value}'
   	`);
	const valueComboInnerHTML = ret3.rows[0].string_agg;

	if (valueCombo.innerHTML != valueComboInnerHTML)
		valueCombo.innerHTML = valueComboInnerHTML;

	const ret4 = await db.query(`
 		SELECT COALESCE(MAX(m.message), '') AS message
   		FROM box b
     		JOIN graph g ON g.to_table='box' AND b.idbox=g.to_key AND g.from_table='message_tag'
       		JOIN message_tag m ON g.from_key=m.idmessage
     		WHERE b.title='${boxCombo.value}'
  	`);
	({message:boxCommentTextArea.value} = ret4.rows[0]);

	const ret6 = await db.query(`
 		SELECT COALESCE(MAX(message),'') AS message
   		FROM box b
     		JOIN field f ON f.idbox=b.idbox
     		JOIN graph g ON g.to_table='field' AND f.idfield=g.to_key AND g.from_table='message_tag'
       		JOIN message_tag m ON g.from_key=m.idmessage
     		WHERE b.title='${boxCombo.value}' AND f.name='${fieldCombo.value}'
 	`);
	({message:fieldCommentTextArea.value} = ret6.rows[0]);
}


async function updateTitle()
{
	await db.exec(`
 		UPDATE diagram SET title='${editTitle.value}'
 	`);
}


async function addNewBox()
{
	const ret = await db.exec(`
  		SELECT setval(pg_get_serial_sequence('box', 'idbox'), coalesce(max(idbox)+1, 1), false) FROM box;
  		SELECT setval(pg_get_serial_sequence('rectangle', 'idrectangle'), coalesce(max(idrectangle)+1, 1), false) FROM rectangle;
 	 	SELECT setval(pg_get_serial_sequence('translation', 'idtranslation'), coalesce(max(idtranslation)+1, 1), false) FROM translation;

   		WITH cte AS (
 			INSERT INTO box(title, iddiagram) VALUES('${newBoxEditField.value}', 1)
    			RETURNING idbox, title
       		), cte2 AS (
 			INSERT INTO rectangle(width, height, idbox) 
   			SELECT 2*4 + LENGTH(title) * ${MONOSPACE_FONT_PIXEL_WIDTH}, 8 + ${CHAR_RECT_HEIGHT}, idbox 
     			FROM cte
			RETURNING idrectangle
		), cte3 AS (
   			INSERT INTO translation(context, idrectangle, x, y)
   			SELECT 1 AS context, idrectangle, 0 AS x, 0 AS y
     			FROM cte2
		)
  		SELECT idbox FROM cte
   	`);

	currentBoxIndex = ret.rows[0].idbox;
	currentFieldIndex = -1;

	newBoxEditField.value = "";

	await displayCurrent();
	await drawDiag();
}


async function dropBox()
{
	console.log('dropBox');
	await db.exec(`
 		WITH cte AS (
 			DELETE FROM box WHERE title='${boxCombo.value}'
    			RETURNING idbox
       		), cte2 AS (
	 		DELETE FROM rectangle
    			WHERE idbox IN (SELECT idbox FROM cte)
       			RETURNING idrectangle
		), cte3 AS (
  			DELETE FROM translation
     			WHERE idrectangle IN (SELECT idrectangle FROM cte2)
		), cte4 AS (
  			DELETE FROM graph
     			WHERE to_table='box' AND to_key IN (SELECT idbox FROM cte)
		)
  		DELETE FROM link
    		WHERE idbox_from IN (SELECT idbox FROM cte) OR idbox_to IN (SELECT idbox FROM cte)
   	`);

	currentBoxIndex = -1;

	await displayCurrent();
	await drawDiag();
}


async function updateBox()
{
	await db.exec(`UPDATE box SET title='${newBoxEditField.value}' WHERE title='${boxCombo.value}'`);
	await displayCurrent();
	await drawDiag();
}


async function addNewFieldToBox()
{
	const ret = await db.query(`
 		WITH cte AS (
 			INSERT INTO field(idbox, name)
   			SELECT idbox, '${newFieldEditField.value}'
     			FROM box WHERE title='${boxCombo.value}'
			RETURNING idfield, idbox, name
   		), cte2(idbox, width, height) AS (
   			SELECT idbox, 2*4 + LENGTH(title) * ${MONOSPACE_FONT_PIXEL_WIDTH}, 8 + ${CHAR_RECT_HEIGHT} FROM box
    			UNION ALL
       			SELECT idbox, LENGTH(name) * ${MONOSPACE_FONT_PIXEL_WIDTH}, ${CHAR_RECT_HEIGHT}  FROM field
	  		UNION ALL
     			SELECT idbox, LENGTH(name) * ${MONOSPACE_FONT_PIXEL_WIDTH}, ${CHAR_RECT_HEIGHT}  FROM cte
		), cte3 AS (
  			SELECT idbox, MAX(width) AS width, LEAST(SUM(height), ${RECTANGLE_BOTTOM_CAP}) AS height
    			FROM cte2
      			GROUP BY idbox
	 	), cte4 AS (
   			UPDATE rectangle r
     			SET width = cte3.width, height = cte3.height
			FROM cte3 JOIN cte ON cte3.idbox = cte.idbox
   			WHERE r.idbox=cte.idbox
  		)
     		SELECT * FROM cte
 	`);

	currentFieldIndex = ret.rows[0].idfield;

	newFieldEditField.value = "";

	await displayCurrent();
	await drawDiag();
}

async function updateField()
{
	await db.exec(`
 		UPDATE field f
   		SET name = '${newFieldEditField.value}'
       		FROM box b
	 	WHERE b.title='${boxCombo.value}' AND f.name='${fieldCombo.value}'
   			AND f.idbox=b.idbox
 	`);
	
	await displayCurrent();
	await drawDiag();
}


async function dropFieldFromBox()
{
	await db.exec(`
 		WITH cte AS (
 			DELETE FROM field f
   			USING box b 
     			WHERE f.idbox=b.idbox
				AND b.title='${boxCombo.value}' AND f.name='${fieldCombo.value}'
   			RETURNING f.idfield
      		)
		DELETE FROM graph g
  		USING cte
    		WHERE to_table='field' AND to_key IN (SELECT idfield FROM cte)
 	`);

	currentFieldIndex = -1;

	await displayCurrent();
	await drawDiag();
}

async function editValueFromField()
{

}

async function addNewValueToField()
{
	await db.exec(`
 		INSERT INTO value(data, idfield)
   		SELECT '${newValueEditField.value}', f.idfield
     		FROM field f
       		JOIN box b ON f.idbox = b.idbox
	 	WHERE b.title='${boxCombo.value}' AND f.name='${fieldCombo.value}'
 	`);

	newValueEditField.value = "";

	await displayCurrent();
}

async function updateValue()
{
	await db.exec(`
 		UPDATE value v
   		SET data='${newValueEditField.value}'
     		FROM field f
	 	JOIN box b ON f.idbox=b.idbox
   		WHERE b.title='${boxCombo.value}' AND f.name='${fieldCombo.value}' AND v.data='${valueCombo.value}'
     			AND v.idfield=f.idfield
 	`);

	await displayCurrent();
}

async function dropValueFromField()
{
	await db.exec(`
 		DELETE v
   		FROM value v
     		JOIN field f ON v.idfield=f.idfield
       		JOIN box b ON f.idbox=b.idbox
	 	WHERE b.title='${boxCombo.value}' AND f.name='${fieldCombo.value}' AND v.data='${valueCombo.value}'
 	`);

	await displayCurrent();
}

async function selectLink()
{

}

async function produce_link_options()
{
	const ret = await db.query(`
 		WITH cte AS (
 			SELECT FORMAT('%s.%s %s.%s', box_from.title, field_from.name, box_to.title, field_to.name) AS option, l.idlink
   			FROM link l
     			JOIN box box_from ON box_from.idbox=l.idbox_from
       			JOIN box box_to ON box_to.idbox=l.idbox_to
	 		LEFT JOIN field field_from ON field_from.idfield = l.idfield_from
   			LEFT JOIN field field_to ON field_to.idfield = l.idfield_to
      		)
		SELECT coalesce(
  			json_agg(json_build_object('option', option, 'idlink', idlink) ORDER BY option),
     			'[]'::json
		)
  		FROM cte
  	`);

	return ret.rows[0].coalesce;
}

async function linkComboOnClick()
{
	const options = await produce_link_options()
	
	const innerHTML = options.map(({option, idlink}) => `<option>${option}</option>`)
				.join('');

	if (linkCombo.innerHTML != innerHTML)
		linkCombo.innerHTML = innerHTML;
}


async function addNewLink()
{
	await db.exec(`
 		WITH cte(side, title, name) AS (
			SELECT 'from', '${fromBoxCombo.value}', '${fromFieldCombo.value}'
   				UNION ALL
       			SELECT 'to', '${toBoxCombo.value}', '${toFieldCombo.value}'
		)
 		WITH cte2 AS (
 			SELECT cte.side, b.idbox, b.idfield
   			FROM cte
      			JOIN box b ON b.title = cte.title
     			LEFT JOIN field f ON f.name=cte.name
		}
  		INSERT INTO link(idbox_from, idfield_from, idbox_to, idfield_to)
    		SELECT cte_from.idbox, cte_from.idfield, cte_to.idbox, cte_to.idfield
      		FROM cte2 cte_from
		JOIN cte2 cte_to
		WHERE cte_from.side='from' AND cte_to.side='to'
	`);

	for (let [selectedContextIndex, context] of mycontexts.contexts.entries())
	{
		let {translatedBoxes, links} = context ;
		const ids = translatedBoxes.map(({id,translation}) => id);
		if (ids.includes(lk.from) && ids.includes(lk.to))
		{
			links.push({polyline:[], from:lk.from, to:lk.to}); 
			context.links = await compute_links(selectedContextIndex);
		}
	}

	await drawDiag();
}

async function dropLink()
{
	const options = await produce_link_options();
	const {option, idlink} = options[linkCombo.selectedIndex];
	await db.exec(`DELETE FROM link WHERE idlink=${idlink}`);
	linkComboOnClick();

	for (let [selectedContextIndex, context] of mycontexts.contexts.entries())
	{
		let {translatedBoxes, links} = context ;
		const ids = translatedBoxes.map(({id,translation}) => id);
		if (ids.includes(lk.from) && ids.includes(lk.to))
		{
			context.links = context.links.filter(link => !(link.to==lk.to && link.from==lk.from));
			context.links = await compute_links(selectedContextIndex);
		}
	}

	await drawDiag();
}

async function dropBoxComment()
{
	await db.exec(`
 		WITH cte AS (
			SELECT m.idmessage, g.idgraph
   			FROM message_tag m
			JOIN graph g ON g.from_table='message_tag' AND g.from_key=m.idmessage AND g.to_table='box'
			JOIN box b ON b.idbox=g.to_key
			WHERE b.title = '${boxCombo.value}'   
		), cte2 AS (
 			DELETE FROM graph g
    			WHERE g.idgraph	IN (
	   			SELECT idgraph FROM cte
			)
    		)
      		DELETE FROM message_tag
	 	WHERE idmessage IN (
    			SELECT idmessage FROM cte
		)
 	`);
	await displayCurrent();
	await drawDiag();
}

async function updateBoxComment()
{
	const boxComment = boxCommentTextArea.value ;
	await dropBoxComment();
	
	await db.exec(`
 		WITH cte AS (
 			INSERT INTO message_tag(message) VALUES ('${boxComment}')
    			RETURNING idmessage
    		)
     		INSERT INTO graph(from_table, from_key, to_table, to_key)
       		SELECT 'message_tag', idmessage, 'box', b.idbox
	  	FROM cte
	  	JOIN box b ON b.title = '${boxCombo.value}'
 	`);

	await displayCurrent();
	await drawDiag();
}

async function dropFieldComment()
{
	await db.exec(`
 		WITH cte AS (
			SELECT m.idmessage, g.idgraph
   			FROM message_tag m
			JOIN graph g ON g.from_table='message_tag' AND g.from_key=m.idmessage AND g.to_table='field'
			JOIN box b ON b.idbox=g.to_key
   			JOIN field f ON f.idbox=b.idbox
			WHERE b.title = '${boxCombo.value}' AND f.name='${fieldCombo.value}'  
		), cte2 AS (
 			DELETE FROM graph g
    			WHERE g.idgraph	IN (
	   			SELECT idgraph FROM cte
			)
    		)
      		DELETE FROM message_tag
	 	WHERE idmessage IN (
    			SELECT idmessage FROM cte
		)
 	`);
	await displayCurrent();
	await drawDiag();
}


async function updateFieldComment()
{
	const fieldComment = fieldCommentTextArea.value;
	await dropFieldComment();
	
	await db.exec(`
 		WITH cte AS (
 			INSERT INTO message_tag(message) VALUES ('${fieldComment}')
    			RETURNING idmessage
    		)
     		INSERT INTO graph(from_table, from_key, to_table, to_key)
       		SELECT 'message_tag', idmessage, 'field', f.idfield
	  	FROM cte
	  	JOIN box b ON b.title = '${boxCombo.value}' 
     		JOIN field f ON f.idbox=b.idbox
	 	WHERE f.name='${fieldCombo.value}'
 	`);

	await displayCurrent();
	await drawDiag();
}

async function produce_color_options()
{
	const ret = await db.query(`
 		WITH cte AS (
 			SELECT FORMAT('%s.%s.%s', b.title, f.name, t.code) AS option, g.idgraph
   			FROM graph g
     			JOIN tag t ON g.from_table='tag' AND g.from_key=t.idtag
       			JOIN field f ON g.to_table='field' AND g.to_key=f.idfield
			JOIN box b ON b.idbox=f.idbox
	 		WHERE t.type_code='COLOR'
    		)
		SELECT coalesce(
  			json_agg(json_build_object('option', option, 'idgraph', idgraph) ORDER BY option),
     			'[]'::json
		)
  		FROM cte      
 	`);

	return ret.rows[0].coalesce;
}

async function colorsComboOnClick()
{
	const options = await produce_color_options();

	const innerHTML = options.map(({option, idgraph}) => `<option>${option}</option>`)
				.join('');

	if (colorsCombo.innerHTML != innerHTML)
		colorsCombo.innerHTML = innerHTML;
}


async function addNewColor()
{
	await db.exec(`
 		INSERT INTO graph(from_table, from_key, to_table, to_key)
   		SELECT 'tag', idtag, 'field', f.idfield
     		FROM field f
       		JOIN box b ON f.idbox=b.idbox
	 	JOIN tag t ON t.type_code='COLOR' AND code='${colorCombo.value}'
	 	WHERE b.title='${colorBoxCombo.value}' AND f.name='${colorFieldCombo.value}'
 	`);

	await colorsComboOnClick();
	await drawDiag();
}

async function updateColor()
{
	await db.exec(`
  		UPDATE graph g
    		SET from_key=new_tag.idtag
    		FROM field f
       		JOIN box b ON f.idbox=b.idbox
       		JOIN tag old_tag ON old_tag.idtag = g.from_key AND old_tag.type_code='COLOR'
	 	JOIN tag new_tag ON new_tag.type_code='COLOR' AND new_tag.code='${colorCombo.value}'
	 	WHERE b.title='${colorBoxCombo.value}' AND f.name='${colorFieldCombo.value}'
   			AND f.idfield = g.to_key AND g.from_table='tag' AND g.to_table='field'
 	`);
	await colorsComboOnClick();
	await drawDiag();
}

async function dropColor()
{
	const options = await produce_color_options();
	const {option, idgraph} = options[colorsCombo.selectedIndex];
	await db.exec(`DELETE FROM graph WHERE idgraph=${idgraph}`);
	await colorsComboOnClick();
	await drawDiag();
}
