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
var addPicToBox2Button ;
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
	updateFieldButton = document.getElementById("update field");;
	addPicToBox2Button = document.getElementById("add pic to box 2");;
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

	const innerHTML = ["","0","1","n","0,1","0,n","1,n"].map(c => '<option>' + c + '</option>')
							.join('');
	fromCardinalityCombo.innerHTML = innerHTML;
	toCardinalityCombo.innerHTML = innerHTML;

	document.querySelectorAll("button.collapsible")
			.forEach(button => {
				button.addEventListener("click", (event) => switchCollapsible(button));
			});

	editTitle.addEventListener("change", () => updateTitle());
	newDiagramButton.addEventListener("click", () => {newDiagram(); displayCurrent(); drawDiag();});
	boxCombo.addEventListener("change", () => {currentBoxIndex = -1; displayCurrent();});
	addBoxButton.addEventListener("click", () => addNewBox());
	dropBoxButton.addEventListener("click", () => dropBox());
	updateBoxButton.addEventListener("click", () => updateBox());
	updateBoxCommentButton.addEventListener("click", () => updateBoxComment()) ;
	dropBoxCommentButton.addEventListener("click", () => dropBoxComment()) ;
	fieldCombo.addEventListener("change", () => {currentFieldIndex = -1; displayCurrent();});
	addFieldButton.addEventListener("click", () => addNewFieldToBox()) ;
	dropFieldButton.addEventListener("click", () => dropFieldFromBox()) ;
	updateFieldButton.addEventListener("click", () => updateField()) ;
	updateFieldCommentButton.addEventListener("click", () => updateFieldComment());
	dropFieldCommentButton.addEventListener("click", () => dropFieldComment());
	valueCombo.addEventListener("change", () => updateValueAttributes());
	editValueButton.addEventListener("click", () => editValueFromField());
	addValueButton.addEventListener("click", () => addNewValueToField());
	dropValueButton.addEventListener("click", () => dropValueFromField());
	updateValueButton.addEventListener("click", () => updateValue());
	linkCombo.addEventListener("click", () => linkComboOnClick());
	dropLinkButton.addEventListener("click", () => {linkComboOnClick(); dropLink();});
	fromBoxCombo.addEventListener("change", () => {currentFromBoxIndex = -1; displayCurrent();});
	fromFieldCombo.addEventListener("change", () => {currentFromFieldIndex = -1; displayCurrent();});
	toBoxCombo.addEventListener("change", () => {currentToBoxIndex = -1; displayCurrent();});
	toFieldCombo.addEventListener("change", () => {currentToFieldIndex = -1; displayCurrent();});
	addLinkButton.addEventListener("click", () => addNewLink()) ;
	colorsCombo.addEventListener("click", () => colorsComboOnClick());
	dropColorButton.addEventListener("click", () => dropColor());
	colorBoxCombo.addEventListener("change", () => {currentColorBoxIndex = -1; displayCurrent();});
	colorFieldCombo.addEventListener("change", () => {currentColorFieldIndex = -1; displayCurrent();});
	addColorButton.addEventListener("click", () => addNewColor());
	updateColorButton.addEventListener("click", () => updateColor());
	applyRepartitionButton.addEventListener("click", async () => {await ApplyRepartition(); drawDiag();});
	newFieldEditField.addEventListener("keypress", () => {onNewFieldUpdate();});
	newFieldEditField.addEventListener("paste", () => {onNewFieldUpdate();});

//avoid duplicate entries
	newBoxEditField.addEventListener("change", () => {
		const ret = await db.query(`SELECT idbox FROM box WHERE title='${newBoxEditField.value}'`);
		addBoxButton.disabled = (newBoxEditField.value == '' || ret.rows.length>0) ? true : false;
	});
	newFieldEditField.addEventListener("change", () => {
		const ret = await db.query(`SELECT idbox FROM box WHERE title='${boxCombo.value}'`);
		currentBoxIndex = ret.rows[0];
		if (currentBoxIndex == -1)
			addFieldButton.disabled = true;
		else
		{
			const ret = await db.query(`SELECT idfield FROM field  WHERE name=${newFieldEditField.value} AND idbox=${currentBoxIndex}`);
			addFieldButton.disabled = (newFieldEditField.value == '' || ret.rows.length==1) ? true : false;
		}
	});

	const ret = await db.query(`SELECT STRING_AGG('<option>' || code || '</option>','' order by code) FROM tag WHERE type_code='COLOR'`);
	colorCombo.innerHTML = ret.rows[0];

	displayCurrent();
}

async function displayCurrent()
{
	if (editTitle.value != mydata.documentTitle)
		editTitle.value = mydata.documentTitle;

	let contexts = [
		{boxCombo_:boxCombo, fieldCombo_:fieldCombo, currentBoxIndex_:currentBoxIndex, currentFieldIndex_:currentFieldIndex},
		{boxCombo_:fromBoxCombo, fieldCombo_:fromFieldCombo, currentBoxIndex_:currentFromBoxIndex, currentFieldIndex_:currentFromFieldIndex},
		{boxCombo_:toBoxCombo, fieldCombo_:toFieldCombo, currentBoxIndex_:currentToBoxIndex, currentFieldIndex_:currentToFieldIndex},
		{boxCombo_:colorBoxCombo, fieldCombo_:colorFieldCombo, currentBoxIndex_:currentColorBoxIndex, currentFieldIndex_:currentColorFieldIndex},		
	];

	let index = 0;
	for (let {boxCombo_, fieldCombo_, currentBoxIndex_, currentFieldIndex_} of contexts)
	{
		if (currentBoxIndex_ == -1 && boxCombo_.value != "")
		{
			const ret = await db.query(`SELECT idbox FROM box WHERE title='${boxCombo_.value}'`);
			currentBoxIndex_ = ret.rows[0];
		}
		const ret1 = await db.query(`SELECT STRING_AGG('<option>' || title || '</option>', '' ORDER BY title) FROM box`);
		const boxComboInnerHTML = ret1.rows[0];

		if (boxCombo_.innerHTML != boxComboInnerHTML)
		{
			boxCombo_.innerHTML = boxComboInnerHTML;
			if (currentBoxIndex_ == -1)
			{
				const ret = await db.query(`SELECT * FROM box`);
				currentBoxIndex_ = ret.rows.length > 0 ? 0 : -1;
			}
		}

		const ret2 = await db.query(`SELECT title FROM box WHERE idbox=${currentBoxIndex_}`);
		boxCombo_.value = ret2.rows[0];

		const ret3 = await db.query(`SELECT STRING_AGG('<option>' || name || '</option>', '' ORDER BY name) FROM field WHERE idbox = ${currentBoxIndex_}`);
		const fieldComboInnerHTML = ret3.rows[0];

		if (fieldCombo_.innerHTML != fieldComboInnerHTML)
		{
			fieldCombo_.innerHTML = fieldComboInnerHTML;
			if (currentFieldIndex_ == -1)
			{
				const ret = await db.query(`SELECT COUNT(*) FROM fields WHERE idbox=${currentBoxIndex_}`);
				currentFieldIndex_ = ret.rows.length > 0 ? 0 : -1;
			}
		}

		const ret4 = await db.query(`SELECT idfield FROM field WHERE idbox=${currentBoxIndex_} AND name='${fieldCombo_.value}'`);
		currentFieldIndex_ = ret4.rows[0]; // -1;

		contexts[index] = {boxCombo_, fieldCombo_, currentBoxIndex_, currentFieldIndex_};
		index++;
	}

	currentBoxIndex = contexts[0].currentBoxIndex_;
	currentFieldIndex = contexts[0].currentFieldIndex_;
	currentFromBoxIndex = contexts[1].currentBoxIndex_;
	currentFromFieldIndex = contexts[1].currentFieldIndex_;
	currentToBoxIndex = contexts[2].currentBoxIndex_;
	currentToFieldIndex = contexts[2].currentFieldIndex_;
	currentColorBoxIndex = contexts[3].currentBoxIndex_;
	currentColorFieldIndex = contexts[3].currentFieldIndex_;

	const ret1 = await db.query(`SELECT title FROM box WHERE idbox=${currentBoxIndex}`);
	const boxTitle = ret1.rows[0];
	const ret2 = await db.query(`SELECT name FROM field WHERE idfield=${currentFieldIndex}`)
	const fieldName = ret.rows[0];

	const ret3 = await db.query(`
 		SELECT STRING_AGG('<option>' || v.data || '</option>', '' ORDER BY idvalue)
   		FROM value v
     		JOIN field f ON v.idfield=f.idfield
       		JOIN box b ON b.idbox=f.idbox
	 	WHERE b.title='${boxTitle}' AND f.name='${fieldName}'
   	`);
	const valueComboInnerHTML = ret3.rows[0];

	if (valueCombo.innerHTML != valueComboInnerHTML)
		valueCombo.innerHTML = valueComboInnerHTML;

	const ret4 = await db.query(`
 		SELECT mt.idmessage
   		FROM box b
     		JOIN graph g ON g.from_table='box' AND b.idbox=g.from_key AND g.to_table='message_tag'
       		JOIN message_tag mt ON g.to_key=mt.idmessage
     		WHERE b.title='${boxCombo.value}'
  	`);
	const currentBoxCommentIndex = ret4.rows[0];

	const ret5 = await db.query(`SELECT message FROM message_tag WHERE idmessage=${currentBoxCommentIndex}`);
	const boxComment = ret5.rows[0];
	const reversedBoxComment = reverseJsonSafe(boxComment);
	if (reversedBoxComment != boxCommentTextArea.value)
	{
		boxCommentTextArea.value = reversedBoxComment ;
	}

	const ret6 = await db.query(`
 		SELECT mt.idmessage
   		FROM box b
     		JOIN field f ON f.idbox=b.idbox
     		JOIN graph g ON g.from_table='field' AND f.idfield=g.from_key AND g.to_table='message_tag'
       		JOIN message_tag mt ON g.to_key=mt.idmessage
     		WHERE b.title='${boxCombo.value}' AND f.name='${fieldCombo.value}'
 	`)
	const currentFieldCommentIndex = ret6.rows[0];

	const ret7 = await db.query(`SELECT message FROM message_tag WHERE idmessage=${currentFieldCommentIndex}`);
	const fieldComment = ret7.rows[0];
	const reversedFieldComment = reverseJsonSafe(fieldComment);

	if (reversedFieldComment != fieldCommentTextArea.value)
	{
		fieldCommentTextArea.value = reversedFieldComment ;
	}
}


function updateTitle()
{
	mydata.documentTitle=editTitle.value;
}


async function addNewBox()
{
	await db.exec(`INSERT INTO box(title) VALUES('${newBoxEditField.value}')`);
	const ret1 = await db.query(`SELECT idbox FROM box WHERE title='${newBoxEditField.value}'`);
	currentBoxIndex = ret1.rows[0];
	currentFieldIndex = -1;

	newBoxEditField.value = "";

	displayCurrent();

	await db.exec(`
 		INSERT INTO rectangle(width, height, idbox) 
   		SELECT 2*4 + LENGTH(title) * ${MONOSPACE_FONT_PIXEL_WIDTH}, 8 + ${CHAR_RECT_HEIGHT}, idbox 
     		FROM box FROM idbox=${currentBoxIndex};

 		INSERT INTO translation(context, idrectangle, x, y)
   		SELECT 1 AS context, r.idrectangle, 0 AS x, 0 AS y
     		FROM rectangle r
       		WHERE r.idbox=${currentBoxIndex};
   	`);

	drawDiag();
}


async function dropBox()
{
	console.log('dropBox');
	await db.exec(`DELETE FROM box WHERE title='${boxCombo.value}'`);

	currentBoxIndex = -1;

	displayCurrent();
	drawDiag();
}


async function updateBox()
{
	await db.exec(`UPDATE box SET title='${newBoxEditField.value} WHERE title='${boxCombo.value}'`);
	
	displayCurrent();

    	//const rec = compute_box_rectangle(mydata.boxes[currentBoxIndex]);
    	//mycontexts.rectangles[currentBoxIndex] = rec;

	drawDiag();
}


function updateFieldAttributes()
{

}


function onNewFieldUpdate()
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
	currentBoxIndex = ret1.rows[0];
	const ret2 = await db.query(`SELECT idfield FROM field WHERE idbox=${currentBoxIndex} AND name=${newFieldEditField.value}`)
	currentFieldIndex = ret2.rows[0];

	console.log(mydata.boxes[currentBoxIndex].fields);

	newFieldEditField.value = "";

	displayCurrent();
	drawDiag();
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
	
	displayCurrent();
	drawDiag();
}


async function dropFieldFromBox()
{
	await db.exec(`
 		DELETE FROM field f
   		USING box b
		WHERE f.idbox=b.idbox AND b.title='${boxCombo.value}' AND f.name='${fieldCombo.value}';
 	`);

	currentFieldIndex = -1;

	displayCurrent();
	drawDiag();
}

function editValueFromField()
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

	displayCurrent();
}

async function updateValue()
{
	await db.exec(`
 		UPDATE v
   		SET v.data='${newValueEditField.value}'
     		FROM value v
       		JOIN field f ON v.idfield=f.idfield
	 	JOIN box b ON f.idbox=b.idbox
   		WHERE b.title='${boxCombo.value}' AND f.name='${fieldCombo.value}'
 	`);

	displayCurrent();
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

	displayCurrent();
}

function selectLink()
{

}

function produce_options(links)
{
	const options = links.map((lk, position) => {
			const {from, fromField, to, toField} = lk;
			const fromBox = mydata.boxes[from] ;
			const fromFieldName = fromField != -1 ? fromBox.fields[fromField].name : "";
			const toBox = mydata.boxes[to] ;
			const toFieldName = toField != -1 ? toBox.fields[toField].name : "";
			return {option:`${fromBox.title}.${fromFieldName} ${toBox.title}.${toFieldName}`, position};
		})
		.sort((a, b) => a.option<b.option ? -1 : a.option > b.option ? 1 : 0);

	return options;
}

function linkComboOnClick()
{
	const options = produce_options(mydata.links)
	
	const innerHTML = options
				.map(({option, position}) => option) 
				.map(option => `<option>${option}</option>`)
				.join('');

	if (linkCombo.innerHTML != innerHTML)
		linkCombo.innerHTML = innerHTML;
}


async function addNewLink()
{
	currentFromBoxIndex = mydata.boxes.findIndex(box => box.title == fromBoxCombo.value);
	currentFromFieldIndex = mydata.boxes[currentFromBoxIndex].fields.findIndex(field => field.name == fromFieldCombo.value);
	currentToBoxIndex = mydata.boxes.findIndex(box => box.title == toBoxCombo.value);
	currentToFieldIndex = mydata.boxes[currentToBoxIndex].fields.findIndex(field => field.name == toFieldCombo.value);

	const lk = {
		from: currentFromBoxIndex,
		fromField: currentFromFieldIndex,
		fromCardinality: fromCardinalityCombo.value,
		to: currentToBoxIndex,
		toField: currentToFieldIndex,
		toCardinality: toCardinalityCombo.value,
		category:categoryCombo.value
	};

	mydata.links.push(lk);

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

	drawDiag();
}

async function dropLink()
{
	const {option, position} = produce_options(mydata.links)[linkCombo.selectedIndex];
	
	const lk = mydata.links[ position ];
	console.log({lk});
	mydata.links = mydata.links.filter((_, index) => index != position);
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

	drawDiag();
}



function dropBoxComment()
{
	const currentCommentIndex = mydata.boxComments.findIndex(({box, comment}) => box == boxCombo.value);
	mydata.boxComments = mydata.boxComments.filter((_, index) => index != currentCommentIndex );
	displayCurrent();
	drawDiag();
}

function updateBoxComment()
{
	const currentBoxCommentIndex = mydata.boxComments.findIndex(({box, comment}) => box == boxCombo.value);
	const boxComment = {box: boxCombo.value, comment: jsonSafe(boxCommentTextArea.value)} ;

	if (currentBoxCommentIndex != -1)
		mydata.boxComments[ currentBoxCommentIndex ] = boxComment;
	else
		mydata.boxComments.push(boxComment);

	displayCurrent();
	drawDiag();
}

function dropFieldComment()
{
	const currentFieldCommentIndex = mydata.fieldComments.findIndex(({box, field, comment}) => box == boxCombo.value && field == fieldCombo.value);
	mydata.fieldComments = mydata.fieldComments.filter((_, index) => index != currentFieldCommentIndex );
	displayCurrent();
	drawDiag();
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

function updateFieldComment()
{
	const currentFieldCommentIndex = mydata.fieldComments.findIndex(({box, field, comment}) => box == boxCombo.value && field == fieldCombo.value);
	const fieldComment = {box: boxCombo.value, field: fieldCombo.value, comment: jsonSafe(fieldCommentTextArea.value)};

	if (currentFieldCommentIndex != -1)
		mydata.fieldComments[ currentBoxCommentIndex ] = fieldComment;
	else
		mydata.fieldComments.push(fieldComment);

	displayCurrent();
	drawDiag();
}

function colorsComboOnClick()
{
	console.log("colorsComboOnClick");
	const innerHTML = mydata.fieldColors
				.map(({index, box, field, color}) => `<option>${box}.${field}.${color}</option>`)
				.join('');
	console.log(innerHTML);

	if (colorsCombo.innerHTML != innerHTML)
		colorsCombo.innerHTML = innerHTML;
}


function addNewColor()
{
	currentColorBoxIndex = mydata.boxes.findIndex(box => box.title == colorBoxCombo.value);
	const box = mydata.boxes[currentColorBoxIndex];

	currentColorFieldIndex = box.fields.findIndex(field => field.name == colorFieldCombo.value);
	const field = box.fields[currentColorFieldIndex];

	mydata.fieldColors.push({
		index: currentColorBoxIndex,
		box: box.title,
		field: field.name,
		color: colorCombo.value
	})

	console.log(mydata.fieldColors);
	colorsComboOnClick();

	drawDiag();
}

function updateColor()
{
	const fieldColorIndex = mydata.fieldColors.findIndex(({box, field, color}) => box == boxCombo.value && field == fieldCombo.value);
	const fc = mydata.fieldColors[fieldColorIndex];
	mydata.fieldColors[ fieldColorIndex ] = {
		index: fc.index,
		box: boxCombo.value,
		field: fieldCombo.value,
		color: colorCombo.value
	};
	console.log(mydata.fieldColors);
	colorsComboOnClick();
	drawDiag();
}

function dropColor()
{
	console.log(mydata.fieldColors);
	mydata.fieldColors = mydata.fieldColors.filter((_, index) => index != colorsCombo.selectedIndex );
	console.log(mydata.fieldColors);
	colorsComboOnClick();
	drawDiag();
}
