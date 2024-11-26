import { PGlite } from "https://cdn.jsdelivr.net/npm/@electric-sql/pglite/dist/index.js"

import {mycontexts, contexts, resetContexts, setContexts, drawDiag, compute_links, ApplyRepartition, enforce_bounding_rectangle, data2contexts} from "./diagload.js";
import {download} from "./iocomponent.js";
import {getFileData} from "./iocomponent.js";

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

var currentPictureIndex = -1;

var input ;
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
var isPrimaryKeyCheckBox ;
var isForeignKeyCheckBox ;
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
var categoryCombo ;
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
	isPrimaryKeyCheckBox = document.getElementById("PK");
	isForeignKeyCheckBox = document.getElementById("FK");
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
	categoryCombo = document.getElementById("category");
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

	editTitle.addEventListener("change", async () => {await updateTitle()});
	newDiagramButton.addEventListener("click", async () => {await newDiagram(); await displayCurrent(); await drawDiag();});
	boxCombo.addEventListener("change", async () => {currentBoxIndex = -1; await displayCurrent();});
	addBoxButton.addEventListener("click", addNewBox);
	dropBoxButton.addEventListener("click", async () => {await dropBox()});
	updateBoxButton.addEventListener("click", async () => {await updateBox()});
	updateBoxCommentButton.addEventListener("click", async () => {await updateBoxComment()}) ;
	dropBoxCommentButton.addEventListener("click", async () => {await dropBoxComment()}) ;
	fieldCombo.addEventListener("change", async () => {currentFieldIndex = -1; await displayCurrent();});
	addFieldButton.addEventListener("click", async () => {await addNewFieldToBox()}) ;
	dropFieldButton.addEventListener("click", async () => {await dropFieldFromBox()}) ;
	updateFieldButton.addEventListener("click", async () => {await updateField()}) ;
	updateFieldCommentButton.addEventListener("click", async () => {await updateFieldComment()});
	dropFieldCommentButton.addEventListener("click", async () => {await dropFieldComment()});
	valueCombo.addEventListener("change", async () => {await updateValueAttributes()});
	editValueButton.addEventListener("click", async () => {await editValueFromField()});
	addValueButton.addEventListener("click", async () => {await addNewValueToField()});
	dropValueButton.addEventListener("click", async () => {await dropValueFromField()});
	updateValueButton.addEventListener("click", async () => {await updateValue()});
	linkCombo.addEventListener("click", async () => {await linkComboOnClick()});
	dropLinkButton.addEventListener("click", async () => {await linkComboOnClick(); await dropLink();});
	fromBoxCombo.addEventListener("change", async () => {currentFromBoxIndex = -1; await displayCurrent();});
	fromFieldCombo.addEventListener("change", async () => {currentFromFieldIndex = -1; await displayCurrent();});
	toBoxCombo.addEventListener("change", async () => {currentToBoxIndex = -1; await displayCurrent();});
	toFieldCombo.addEventListener("change", async () => {currentToFieldIndex = -1; await displayCurrent();});
	addLinkButton.addEventListener("click", async () => {await addNewLink()}) ;
	colorsCombo.addEventListener("click", async () => {await colorsComboOnClick()});
	dropColorButton.addEventListener("click", async () => {await dropColor()});
	colorBoxCombo.addEventListener("change", async () => {currentColorBoxIndex = -1; await displayCurrent();});
	colorFieldCombo.addEventListener("change", async () => {currentColorFieldIndex = -1; await displayCurrent();});
	addColorButton.addEventListener("click", async () => {await addNewColor()});
	updateColorButton.addEventListener("click", async () => {await updateColor()});
	applyRepartitionButton.addEventListener("click", async () => {await ApplyRepartition(); await drawDiag();});
	newFieldEditField.addEventListener("keypress", async () => {await onNewFieldUpdate();});
	newFieldEditField.addEventListener("paste", async () => {await onNewFieldUpdate();});

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
			const ret = await db.query(`SELECT idfield FROM field  WHERE name=${newFieldEditField.value} AND idbox=${currentBoxIndex}`);
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
 		SELECT COALESCE(MAX(mt.idmessage), -1)
   		FROM box b
     		JOIN graph g ON g.to_table='box' AND b.idbox=g.to_key AND g.from_table='message_tag'
       		JOIN message_tag mt ON g.from_key=mt.idmessage
     		WHERE b.title='${boxCombo.value}'
  	`);
	const currentBoxCommentIndex = ret4.rows[0].coalesce;

	const ret5 = await db.query(`SELECT COALESCE(MAX(message), '') FROM message_tag WHERE idmessage=${currentBoxCommentIndex}`);
	const boxComment = ret5.rows[0].coalesce;
	const reversedBoxComment = reverseJsonSafe(boxComment);
	if (reversedBoxComment != boxCommentTextArea.value)
	{
		boxCommentTextArea.value = reversedBoxComment ;
	}

	const ret6 = await db.query(`
 		SELECT COALESCE(MAX(mt.idmessage), -1)
   		FROM box b
     		JOIN field f ON f.idbox=b.idbox
     		JOIN graph g ON g.to_table='field' AND f.idfield=g.to_key AND g.from_table='message_tag'
       		JOIN message_tag mt ON g.from_key=mt.idmessage
     		WHERE b.title='${boxCombo.value}' AND f.name='${fieldCombo.value}'
 	`)
	const currentFieldCommentIndex = ret6.rows[0].coalesce;

	const ret7 = await db.query(`SELECT COALESCE(MAX(message),'') FROM message_tag WHERE idmessage=${currentFieldCommentIndex}`);
	const fieldComment = ret7.rows[0].coalesce;
	const reversedFieldComment = reverseJsonSafe(fieldComment);

	if (reversedFieldComment != fieldCommentTextArea.value)
	{
		fieldCommentTextArea.value = reversedFieldComment ;
	}
}


async function updateTitle()
{
	await db.exec(`
 		UPDATE diagram SET title='${editTitle.value}'
 	`);
}


async function addNewBox()
{
	await db.exec(`
 		SELECT setval(pg_get_serial_sequence('box', 'idbox'), coalesce(max(idbox)+1, 1), false) FROM box;
 		INSERT INTO box(title, iddiagram) VALUES('${newBoxEditField.value}', 1);
   	`);
	const ret1 = await db.query(`SELECT idbox FROM box WHERE title='${newBoxEditField.value}' AND iddiagram=1`);
	currentBoxIndex = ret1.rows[0].idbox;
	currentFieldIndex = -1;

	newBoxEditField.value = "";

	await displayCurrent();

	await db.exec(`
 		INSERT INTO rectangle(width, height, idbox) 
   		SELECT 2*4 + LENGTH(title) * ${MONOSPACE_FONT_PIXEL_WIDTH}, 8 + ${CHAR_RECT_HEIGHT}, idbox 
     		FROM box FROM idbox=${currentBoxIndex};

 		INSERT INTO translation(context, idrectangle, x, y)
   		SELECT 1 AS context, r.idrectangle, 0 AS x, 0 AS y
     		FROM rectangle r
       		WHERE r.idbox=${currentBoxIndex};
   	`);

	await drawDiag();
}


async function dropBox()
{
	console.log('dropBox');
	await db.exec(`DELETE FROM box WHERE title='${boxCombo.value}'`);

	currentBoxIndex = -1;

	await displayCurrent();
	await drawDiag();
}


async function updateBox()
{
	await db.exec(`UPDATE box SET title='${newBoxEditField.value} WHERE title='${boxCombo.value}'`);
	
	await displayCurrent();

    	//const rec = compute_box_rectangle(mydata.boxes[currentBoxIndex]);
    	//mycontexts.rectangles[currentBoxIndex] = rec;

	await drawDiag();
}


async function updateFieldAttributes()
{

}


async function onNewFieldUpdate()
{
	if (newFieldEditField.value.length == 0)
	{
		isPrimaryKeyCheckBox.checked = false;
		isForeignKeyCheckBox.checked = false;
	}
}


async function addNewFieldToBox()
{
	await db.exec(`
 		INSERT INTO field(idbox, name)
   		SELECT idbox, '${newFieldEditField.value}'
     		FROM box WHERE title='${boxCombo.value}'
 	`);
	const ret1 = await db.query(`SELECT idbox FROM box WHERE title='${boxCombo.value}'`);
	currentBoxIndex = ret1.rows[0].idbox;
	const ret2 = await db.query(`SELECT idfield FROM field WHERE idbox=${currentBoxIndex} AND name=${newFieldEditField.value}`)
	currentFieldIndex = ret2.rows[0].idfield;

	newFieldEditField.value = "";

	await displayCurrent();
	await drawDiag();
}

async function updateField()
{
	await db.exec(`
 		UPDATE field
   		SET name = '${newFieldEditField.value}'
     		FROM field f
       		JOIN box b ON f.idbox=b.idbox
	 	WHERE b.title='${boxCombo.value}' AND f.name='${fieldCombo.value}'
 	`);
	
	await displayCurrent();
	await drawDiag();
}


async function dropFieldFromBox()
{
	await db.exec(`
 		DELETE f
   		FROM field f
   		JOIN box b ON f.idbox=b.idbox
		WHERE b.title='${boxCombo.value}' AND f.name='${fieldCombo.value}';
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
 		UPDATE v
   		SET v.data='${newValueEditField.value}'
     		FROM value v
       		JOIN field f ON v.idfield=f.idfield
	 	JOIN box b ON f.idbox=b.idbox
   		WHERE b.title='${boxCombo.value}' AND f.name='${fieldCombo.value}' AND v.data='${valueCombo.value}'
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

async function produce_options(links)
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
		SELECT json_agg(json_build_object('option', option, 'idlink', idlink) ORDER BY option)
  	`);

	return ret.rows[0].json_agg;
}

async function linkComboOnClick()
{
	const options = produce_options(mydata.links)
	
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

	const ret1 = await db.query(`SELECT idbox FROM box WHERE title='${fromBoxCombo.value}'`);
	currentFromBoxIndex = ret1.rows[0].idbox;
	const ret2 = await db.query(`SELECT idfield FROM field WHERE idbox=${currentFromBoxIndex} AND name='${fromFieldCombo.value}'`);
	currentFromFieldIndex = ret2.rows[0].idfield;
	const ret3 = await db.query(`SELECT idbox FROM box WHERE title='${toBoxCombo.value}'`);
	currentToBoxIndex = ret3.rows[0].idbox;
	const ret4 = await db.query(`SELECT idfield FROM field WHERE idbox=${currentToBoxIndex} AND name='${toFieldCombo.value}'`);
	currentToFieldIndex = ret4.rows[0].idfield;

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
	const {option, idlink} = produce_options(mydata.links)[linkCombo.selectedIndex];
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
 		DELETE m
   		FROM message_tag m
     		JOIN graph g ON g.from_table='message_tag' AND g.from_key=m.idmessage AND g.to_table='box'
       		JOIN box b ON b.idbox=g.to_key
	 	WHERE b.title = '${boxCombo.value}'
 	`);
	await displayCurrent();
	await drawDiag();
}

async function updateBoxComment()
{
//TODO: should be an UPDATE or INSERT
	await db.exec(`
 		UPDATE m
   		SET m.message='${jsonSafe(boxCommentTextArea.value)}'
     		FROM message_tag m
     		JOIN graph g ON g.from_table='message_tag' AND g.from_key=m.idmessage AND g.to_table='box'
       		JOIN box b ON b.idbox=g.to_key
	 	WHERE b.title = '${boxCombo.value}'
 	`);
/*
	if (currentBoxCommentIndex != -1)
		mydata.boxComments[ currentBoxCommentIndex ] = boxComment;
	else
		mydata.boxComments.push(boxComment);
*/
	await displayCurrent();
	await drawDiag();
}

async function dropFieldComment()
{
	await db.exec(`
 		DELETE m
     		FROM message_tag m
     		JOIN graph g ON g.from_table='message_tag' AND g.from_key=m.idmessage AND g.to_table='box'
       		JOIN box b ON b.idbox=g.to_key
	 	WHERE b.title = '${boxCombo.value}'
 	`);
	await displayCurrent();
	await drawDiag();
}

function jsonSafe(text)
{
	return text.replace(/\\n/g, "\\n")
			  .replace(/\\'/g, "\\'")
			  .replace(/\\"/g, '\\"')
			  .replace(/\\&/g, "\\&")
			  .replace(/\\r/g, "\\r")
			  .replace(/\\t/g, "\\t")
			  .replace(/\\b/g, "\\b")
			  .replace(/\\f/g, "\\f");
}

function reverseJsonSafe(text)
{
	return text.replaceAll('\\n', '\n')
				.replaceAll("\\'", "'")
				.replaceAll('\\"', '"')
				.replaceAll("\\&", '\&')
				.replaceAll("\\r", '\r')
				.replaceAll("\\t", '\t')
				.replaceAll("\\b", '\b')
				.replaceAll("\\f", '\f');
}

async function updateFieldComment()
{
//TODO: should be an UPDATE or INSERT
	await db.exec(`
 		UPDATE m
   		SET m.message='${jsonSafe(fieldCommentTextArea.value)}'
     		FROM message_tag m
     		JOIN graph g ON g.from_table='message_tag' AND g.from_key=m.idmessage AND g.to_table='field'
       		JOIN field f ON f.idfield=g.to_key
       		JOIN box b ON b.idbox=f.idbox
	 	WHERE b.title = '${boxCombo.value}' AND f.name='${fieldCombo.value}'
 	`);
/*
	if (currentFieldCommentIndex != -1)
		mydata.fieldComments[ currentBoxCommentIndex ] = fieldComment;
	else
		mydata.fieldComments.push(fieldComment);
*/
	await displayCurrent();
	await drawDiag();
}

async function colorsComboOnClick()
{
	console.log("colorsComboOnClick");
	const innerHTML = mydata.fieldColors
				.map(({index, box, field, color}) => `<option>${box}.${field}.${color}</option>`)
				.join('');
	console.log(innerHTML);

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
  		UPDATE g
    		SET g.from_key=new_tag.idtag
    		FROM graph g
     		JOIN field f ON f.idfield = g.to_key AND g.from_table='tag' AND g.to_table='field'
       		JOIN box b ON f.idbox=b.idbox
       		JOIN tag old_tag ON old_tag.idtag = g.from_key AND old_tag.type_code='COLOR'
	 	JOIN tag new_tag ON new_tag.type_code='COLOR' AND new_tag.code='${colorCombo.value}'
	 	WHERE b.title='${colorBoxCombo.value}' AND f.name='${colorFieldCombo.value}' 
 	`);
	await colorsComboOnClick();
	await drawDiag();
}

async function dropColor()
{
/*
TODO
	console.log(mydata.fieldColors);
	mydata.fieldColors = mydata.fieldColors.filter((_, index) => index != colorsCombo.selectedIndex );
	console.log(mydata.fieldColors);
	colorsComboOnClick();
	drawDiag();
 */
}
