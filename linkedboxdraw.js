const fs = require('fs');
const path = require('path');
const express = require('express')
const bodyParser = require('body-parser')
const {Client} = require('pg')
const cors = require('cors')
const http = require('http');
const https = require('https');

const privateKey  = fs.readFileSync('/home/edouda/.pm2/modules/pm2-server-monit/node_modules/get-uri/test/server.key');
const certificate = fs.readFileSync('/home/edouda/.pm2/modules/pm2-server-monit/node_modules/get-uri/test/server.crt');

var credentials = {key: privateKey, cert: certificate};

const app = express()

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080, () => {
        console.log('http linkedboxdraw server listening on port 8080!')
});
httpsServer.listen(8443, () => {
        console.log('https linkedboxdraw server listening on port 8443!')
});

app.use(cors())
app.options('*', cors());

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// CORS middleware
const allowCrossDomain = (req, res, next) => {
  console.log("entering allowCrossDomain ...");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
};

app.use(allowCrossDomain);

app.post('/linkedboxdraw/post', async (req, res) => {
	const data = req.body;
	console.log(JSON.stringify(data));
	console.log(data.diagram);
	const client = new Client({
		host:'localhost',
		port:5433,
		user:'postgres',
		password:'7472',
		database:'linkedboxdraw'
	});
	await client.connect();

	const uuid_diagram = data.diagram[0].uuid_diagram;
	console.log(uuid_diagram);
	const json_diagram = JSON.stringify(data.diagram);

	const result1 = await client.query(`
		MERGE INTO diagram d
		USING json_to_recordset('${json_diagram}') AS rd("iddiagram" int, "uuid_diagram" uuid, "title" text)
		ON d.uuid_diagram=rd.uuid_diagram
		WHEN NOT MATCHED BY TARGET THEN
			INSERT (uuid_diagram, title) VALUES(rd.uuid_diagram, rd.title)
		WHEN MATCHED AND d.title != rd.title THEN
			UPDATE SET title = rd.title
	`);
	console.log("MERGE INTO diagram done...");

	const json_box = JSON.stringify(data.box);

	const result2 = await client.query(`
		MERGE INTO box b
		USING (
			SELECT rb.uuid_box, rb.title, d.iddiagram
			FROM json_to_recordset('${json_box}') AS rb("idbox" int, "uuid_box" uuid, "title" text, "iddiagram" int)
			JOIN diagram d ON d.uuid_diagram='${uuid_diagram}'
		) rb
		ON b.uuid_box=rb.uuid_box
		WHEN NOT MATCHED BY TARGET THEN
			INSERT (uuid_box, title, iddiagram) VALUES(rb.uuid_box, rb.title, rb.iddiagram)
		WHEN MATCHED AND b.title != rb.title THEN
			UPDATE SET title = rb.title
		WHEN NOT MATCHED BY SOURCE
			AND EXISTS(SELECT * FROM diagram d WHERE d.iddiagram=b.iddiagram AND d.uuid_diagram='${uuid_diagram}')
			THEN DELETE;
        `);
        console.log("MERGE INTO box done...");

	const json_field = JSON.stringify(data.field);

        const result3 = await client.query(`

		MERGE INTO field f
		USING (
			SELECT rf.uuid_field, rf.name, b.idbox
			FROM json_to_recordset('${json_field}') AS rf("idfield" int, "uuid_field" uuid, "name" text, "idbox" int)
			JOIN json_to_recordset('${json_box}') AS rb("idbox" int, "uuid_box" uuid, "title" text, "iddiagram" int) ON rf.idbox=rb.idbox
			JOIN box b ON b.uuid_box=rb.uuid_box
		) rf
		ON f.uuid_field = rf.uuid_field
		WHEN NOT MATCHED BY TARGET THEN
			INSERT (uuid_field, name, idbox) VALUES(rf.uuid_field, rf.name, rf.idbox)
		WHEN MATCHED AND f.name != rf.name THEN
			UPDATE SET name = rf.name
		WHEN NOT MATCHED BY SOURCE AND EXISTS(
                                SELECT *
                                FROM box b
                                JOIN diagram d ON b.iddiagram=d.iddiagram
                                WHERE b.idbox=f.idbox AND d.uuid_diagram='${uuid_diagram}'
                        )
			THEN DELETE;
        `);
        console.log("MERGE INTO field done...");

	const json_value = JSON.stringify(data.value);

        const result4 = await client.query(`

		MERGE INTO value v
		USING (
			SELECT rv.uuid_value, rv.data, f.idfield
			FROM json_to_recordset('${json_value}') AS rv("idvalue" int, "uuid_value" uuid, "data" text, "idfield" int)
			JOIN json_to_recordset('${json_field}') AS rf("idfield" int, "uuid_field" uuid, "name" text, "idbox" int) ON rv.idfield=rf.idfield
			JOIN field f ON f.uuid_field = rf.uuid_field
		) rv
                ON v.uuid_value = rv.uuid_value
                WHEN NOT MATCHED BY TARGET THEN
                        INSERT (uuid_value, data, idfield) VALUES(rv.uuid_value, rv.data, rv.idfield)
		WHEN MATCHED AND v.data != rv.data THEN
			UPDATE SET data = rv.data
		WHEN MATCHED AND v.idfield != rv.idfield THEN
			UPDATE SET idfield = rv.idfield
                WHEN NOT MATCHED BY SOURCE AND EXISTS(
                                SELECT *
				FROM field f
                                JOIN box b ON f.idbox = b.idbox
                                JOIN diagram d ON b.iddiagram=d.iddiagram
                                WHERE v.idfield=f.idfield AND d.uuid_diagram='${uuid_diagram}'
                        )
		THEN DELETE;
        `);
        console.log("MERGE INTO value done...");

	const json_link = JSON.stringify(data.link);

        const result5 = await client.query(`

		MERGE INTO link l
		USING (
			SELECT rl.uuid_link, b_from.idbox AS idbox_from, f_from.idfield AS idfield_from, b_to.idbox AS idbox_to, f_to.idfield AS idfield_to
			FROM json_to_recordset('${json_link}') AS rl("idlink" int, "uuid_link" uuid, "idbox_from" int, "idfield_from" int, "idbox_to" int, "idfield_to" int)
             		JOIN json_to_recordset('${json_box}') AS rb_from("idbox" int, "uuid_box" uuid, "title" text, "iddiagram" int) ON rl.idbox_from=rb_from.idbox
                        JOIN json_to_recordset('${json_box}') AS rb_to("idbox" int, "uuid_box" uuid, "title" text, "iddiagram" int) ON rl.idbox_to=rb_to.idbox
               		JOIN json_to_recordset('${json_field}') AS rf_from("idfield" int, "uuid_field" uuid, "name" text, "idbox" int) ON rl.idfield_from=rf_from.idfield
                        JOIN json_to_recordset('${json_field}') AS rf_to("idfield" int, "uuid_field" uuid, "name" text, "idbox" int) ON rl.idfield_to=rf_to.idfield
			JOIN box b_from ON b_from.uuid_box=rb_from.uuid_box
			JOIN box b_to ON b_to.uuid_box=rb_to.uuid_box
			JOIN field f_from ON f_from.uuid_field=rf_from.uuid_field
			JOIN field f_to ON f_to.uuid_field=rf_to.uuid_field
		) rl
		ON l.uuid_link = rl.uuid_link
		WHEN NOT MATCHED BY TARGET THEN
			INSERT (uuid_link, idbox_from, idfield_from, idbox_to, idfield_to)
			VALUES(rl.uuid_link, rl.idbox_from, rl.idfield_from, rl.idbox_to, rl.idfield_to)
		WHEN NOT MATCHED BY SOURCE
			AND EXISTS(SELECT * FROM box b JOIN diagram d ON d.iddiagram=b.iddiagram WHERE d.uuid_diagram='${uuid_diagram}' AND b.idbox=l.idbox_from)
			AND EXISTS(SELECT * FROM box b JOIN diagram d ON d.iddiagram=b.iddiagram WHERE d.uuid_diagram='${uuid_diagram}' AND b.idbox=l.idbox_to)
			THEN DELETE;
        `);
        console.log("MERGE INTO link done...");

	const json_tag = JSON.stringify(data.tag);

        const result6 = await client.query(`

		MERGE INTO tag t
		USING json_to_recordset('${json_tag}') AS rt("idtag" int, "uuid_tag" uuid, "type_code" text, "code" text)
		ON t.uuid_tag = rt.uuid_tag
		WHEN NOT MATCHED BY TARGET THEN
			INSERT (uuid_tag, type_code, code) VALUES(rt.uuid_tag, rt.type_code, rt.code);
        `);
        console.log("MERGE INTO tag done...");

	const json_message_tag = JSON.stringify(data.message_tag);

        const result7 = await client.query(`

		MERGE INTO message_tag m
		USING (
			SELECT rm.uuid_message, rm.message, d.iddiagram
			FROM json_to_recordset('${json_message_tag}') AS rm("idmessage" int, "uuid_message" uuid, "message" text)
			JOIN diagram d ON d.uuid_diagram = '${uuid_diagram}'
		) rm
		ON m.uuid_message = rm.uuid_message
		WHEN NOT MATCHED BY TARGET THEN
			INSERT (uuid_message, message, iddiagram) VALUES(rm.uuid_message, rm.message, rm.iddiagram)
		WHEN MATCHED AND m.message != rm.message THEN
                        UPDATE SET message = rm.message
		WHEN NOT MATCHED BY SOURCE AND EXISTS(
			SELECT *
			FROM diagram d
			WHERE d.iddiagram = m.iddiagram AND d.uuid_diagram='${uuid_diagram}'
		)
		THEN DELETE;
        `);
        console.log("MERGE INTO message_tag done...");

	const json_graph = JSON.stringify(data.graph);

        const result8 = await client.query(`
		MERGE INTO graph g
		USING (
			SELECT rg.uuid_graph, from_table,
				CASE from_table
					WHEN 'tag' THEN t.idtag
					WHEN 'message_tag' THEN m.idmessage
				END AS from_key,
				to_table,
				CASE to_table
					WHEN 'box' THEN b.idbox
					WHEN 'field' THEN f.idfield
					WHEN 'value' THEN v.idvalue
					WHEN 'link' THEN l.idlink
				END AS to_key,
				d.iddiagram
			FROM json_to_recordset('${json_graph}') AS rg("idgraph" int, "uuid_graph" uuid, "from_table" source_table, "from_key" int, "to_table" target_table, "to_key" int)
			LEFT JOIN json_to_recordset('${json_tag}') AS rt("idtag" int, "uuid_tag" uuid, "type_code" text, "code" text) ON rt.idtag=rg.from_key
			LEFT JOIN tag t ON t.uuid_tag = rt.uuid_tag
			LEFT JOIN json_to_recordset('${json_message_tag}') AS rm("idmessage" int, "uuid_message" uuid, message text) ON rm.idmessage=rg.from_key
			LEFT JOIN message_tag m ON m.uuid_message = rm.uuid_message
			LEFT JOIN json_to_recordset('${json_box}') AS rb("idbox" int, "uuid_box" uuid, "title" text, "iddiagram" int) ON rb.idbox=rg.to_key
			LEFT JOIN box b ON b.uuid_box = rb.uuid_box
                        LEFT JOIN json_to_recordset('${json_field}') AS rf("idfield" int, "uuid_field" uuid, "name" text, "idbox" int) ON rf.idfield=rg.to_key
			LEFT JOIN field f ON f.uuid_field = rf.uuid_field
 			LEFT JOIN json_to_recordset('${json_value}') AS rv("idvalue" int, "uuid_value" uuid, "data" text, "idfield" int) ON rv.idvalue=rg.to_key
			LEFT JOIN value v ON v.uuid_value = rv.uuid_value
			LEFT JOIN json_to_recordset('${json_link}') AS rl("idlink" int, "uuid_link" uuid, "idbox_from" int, "idfield_from" int, "idbox_to" int, "idfield_to" int) ON rl.idlink=rg.to_key
			LEFT JOIN link l ON rl.uuid_link=l.uuid_link
			JOIN diagram d ON d.uuid_diagram = '${uuid_diagram}'
		) rg
		ON g.uuid_graph = rg.uuid_graph
		WHEN NOT MATCHED BY TARGET THEN
			INSERT (iddiagram, uuid_graph, from_table, from_key, to_table, to_key)
			VALUES(rg.iddiagram, rg.uuid_graph, rg.from_table, rg.from_key, rg.to_table, rg.to_key)
		WHEN MATCHED AND g.from_table != rg.from_table THEN
			UPDATE SET from_table = rg.from_table
		WHEN MATCHED AND g.from_key != rg.from_key THEN
                        UPDATE SET from_key = rg.from_key
		WHEN MATCHED AND g.to_table != rg.to_table THEN
			UPDATE SET to_table = rg.to_table
		WHEN MATCHED AND g.to_key != rg.to_key THEN
                        UPDATE SET to_key = rg.to_key
		WHEN MATCHED AND g.iddiagram != rg.iddiagram THEN
			UPDATE SET iddiagram = rg.iddiagram
		WHEN NOT MATCHED BY SOURCE AND EXISTS(
			SELECT *
			FROM diagram d
			WHERE g.iddiagram=d.iddiagram AND d.uuid_diagram='${uuid_diagram}'
		)
		THEN DELETE;
        `);
        console.log("MERGE INTO graph done...");

	const json_rectangle = JSON.stringify(data.rectangle);

        const result9 = await client.query(`

		MERGE INTO rectangle r
		USING (
			SELECT rr.uuid_rectangle, rr.width, rr.height, b.idbox
			FROM json_to_recordset('${json_rectangle}') AS rr("idrectangle" int, "uuid_rectangle" uuid, "width" int, "height" int, "idbox" int)
			JOIN json_to_recordset('${json_box}') AS rb("idbox" int, "uuid_box" uuid, "title" text, "iddiagram" int) ON rr.idbox=rb.idbox
			JOIN box b ON b.uuid_box=rb.uuid_box
		) rr
		ON r.uuid_rectangle = rr.uuid_rectangle
		WHEN NOT MATCHED BY TARGET THEN
			INSERT (uuid_rectangle, width, height, idbox) VALUES(rr.uuid_rectangle, rr.width, rr.height, rr.idbox)
		WHEN MATCHED AND r.width != rr.width THEN
			UPDATE SET width = rr.width
		WHEN MATCHED AND r.height != rr.height THEN
			UPDATE SET height = rr.height
		WHEN NOT MATCHED BY SOURCE
                       AND EXISTS(
                                SELECT *
                                FROM box b
                                JOIN diagram d ON b.iddiagram=d.iddiagram
                                WHERE r.idbox=b.idbox AND d.uuid_diagram='${uuid_diagram}'
                        )
			THEN DELETE;
        `);
        console.log("MERGE INTO rectangle done...");

	const json_translation = JSON.stringify(data.translation);

        const result10 = await client.query(`

		MERGE INTO translation t
		USING (
			SELECT rt.uuid_translation, rt.context, r.idrectangle, rt.x, rt.y
			FROM json_to_recordset('${json_translation}') AS rt("idtranslation" int, "uuid_translation" uuid, "context" int, "idrectangle" int, "x" int, "y" int)
			JOIN json_to_recordset('${json_rectangle}') AS rr("idrectangle" int, "uuid_rectangle" uuid, "width" int, "height" int, "idbox" int) ON rt.idrectangle=rr.idrectangle
			JOIN rectangle r ON r.uuid_rectangle=rr.uuid_rectangle
		) rt
		ON t.uuid_translation = rt.uuid_translation
		WHEN NOT MATCHED BY TARGET THEN
			INSERT (uuid_translation, context, idrectangle, x, y) VALUES(rt.uuid_translation, rt.context, rt.idrectangle, rt.x, rt.y)
		WHEN MATCHED AND t.context != rt.context THEN
			UPDATE SET context = rt.context
		WHEN MATCHED AND t.x != rt.x THEN
			UPDATE SET x = rt.x
		WHEN MATCHED AND t.y != rt.y THEN
			UPDATE SET y = rt.y
		WHEN NOT MATCHED BY SOURCE
                       AND EXISTS(
                                SELECT *
                                FROM rectangle r
                                JOIN box b ON r.idbox=b.idbox
                                JOIN diagram d ON b.iddiagram=d.iddiagram
                                WHERE r.idrectangle=t.idrectangle AND d.uuid_diagram='${uuid_diagram}'
                        )
			THEN DELETE;
        `);
        console.log("MERGE INTO translation done...");
/*
	const json_polyline = JSON.stringify(data.polyline);

        const result11 = await client.query(`

		MERGE INTO polyline p
		USING json_to_recordset('${json_polyline}') AS rp("idpolyline" int, "uuid_polyline" uuid, "context" int, "idlink" int, "idtranslation_from" int, "idtranslation_to" int, "points" json)
		ON p.uuid_polyline = rp.uuid_polyline
		WHEN NOT MATCHED BY TARGET THEN
			INSERT (uuid_polyline, context, points) VALUES(rp.uuid_polyline, rp.context, rp.points)
		WHEN MATCHED AND p.context != rp.context THEN
			UPDATE SET context = rp.context
		WHEN MATCHED AND p.points != rp.points THEN
			UPDATE SET points = rp.points
		WHEN NOT MATCHED BY SOURCE THEN
			DELETE;
	`);
      console.log("MERGE INTO polyline done...");
*/
})