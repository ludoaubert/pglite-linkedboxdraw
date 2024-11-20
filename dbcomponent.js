
function drawComponent(id, db) {

	const ret = await db.query(`
 		SELECT FORMAT('title="%s"', m.message)
   		FROM graph g
     		JOIN message_tag m ON m.idmessage=g.to_key
       		WHERE g.to_table='message_tag' AND g.from_table='box' AND g.idbox=${id}
 	`);

	const titleAttribute = ret.rows[0];
/*	
	const titleAttribute = box.title in box2comment ? `title="${box2comment[box.title]}"` : '';
*/
	let innerHTML = `<table id="box${id}" contenteditable="true" spellcheck="false" ${titleAttribute}>`;

	const ret = await db.query(`
 		SELECT FORMAT('<thead>
				<tr>
				<th id="b${id}">%1$</th>
				</tr>
		    	</thead>
			<tbody>',
			title) //%1
   		FROM box
     		WHERE idbox=${id}
 	`);
	innerHTML += ret.rows[0];
/*
	innerHTML += `<thead>
			<tr>
				<th id="b${id}">${box.title}</th>
			</tr>
		    </thead>
		<tbody>`;
*/
	const ret = await db.query(`
 		SELECT STRING_AGG(FORMAT('<tr id="b${id}f%1$"><td id="b${id}f%1$">%2$</td></tr>',
   			idfield, //%1
   			name), //%2
      			'\n' | ORDER BY name)
	 	FROM field
   		WHERE idbox=${id}
 	`);
	innerHTML += ret.rows[0];

	innerHTML += `</tbody></table>`;

	return innerHTML;
}



function expressCutLinks(mydata, mycontexts){

	const {documentTitle, boxes, values, boxComments, fieldComments, links, fieldColors} = mydata;

// listing unexpressed links - beginning

	let repartition=[];

	for (let id=0; id < mycontexts.rectangles.length; id++)
	{
		repartition[id] = -1;
	}

	for (const [i, context] of mycontexts.contexts.entries())
	{
		for (const {id,translation} of context.translatedBoxes)
		{
			repartition[id]=i;
		}
	}
	console.log(repartition);

	document.title = documentTitle;

	const cut_links = links.filter(link => link.category=="TR2" || repartition[link.from] != repartition[link.to])
				.filter(link => link.fromField!=-1 && link.toField!=-1);
	console.log(cut_links);

// listing unexpressed link targets - beginning
	const cut_link_targets = [... new Set(cut_links.map( link => `${link.to}.${link.toField}`))];
	console.log(cut_link_targets);
//https://www.w3.org/wiki/CSS/Properties/color/keywords
	const cut_link_colors = ['lime','fuchsia','teal','aqua','aquamarine','coral','cornflowerblue','darkgray','darkkhaki']

	const colormap = new Map(
		[...cut_link_targets.entries()].map(([i, to_toField]) => ([to_toField, cut_link_colors[i % cut_link_colors.length]]))
	);
	console.log(colormap);

// listing unexpressed link targets - end

	const styleMap = new Map(
		[...fieldColors.map( ({box,field,color})=>({index:boxes.findIndex(b => b.title==box), field, color}) ),
		...cut_links.map( ({from,fromField,fromCardinality,to,toField,toCardinality}) => ([
			{index:from, field:`${boxes[from].fields[fromField].name}`, color:colormap.get(`${to}.${toField}`)},
			{index:to, field:`${boxes[to].fields[toField].name}`, color:colormap.get(`${to}.${toField}`)}])
			)
		]
		.flat()
		.map(({index, field, color}) => {
			const fieldIndex = boxes[index].fields.findIndex(f => f.name == field);
			return [`b${index}f${fieldIndex}`, color];
		}));

	return styleMap;
}
