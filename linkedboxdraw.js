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

app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

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

	const uuid_diagram = data.diagram[0].uuid_diagram;
	console.log(uuid_diagram);

	const client = new Client({
        	host:'localhost',
        	port:5433,
        	user:'postgres',
        	password:'7472',
        	database:'linkedboxdraw'
	});
	await client.connect();

	const ret1 = await client.query(`
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

	const result1 = await client.query(`
		MERGE INTO diagram d
		USING json_to_recordset('${JSON.stringify(data.diagram)}') AS rd(${column_list.diagram})
		ON d.uuid_diagram=rd.uuid_diagram
		WHEN NOT MATCHED BY TARGET THEN
			INSERT (uuid_diagram, title) VALUES(rd.uuid_diagram, rd.title)
		WHEN MATCHED AND d.title != rd.title THEN
			UPDATE SET title = rd.title
		RETURNING merge_action(), d.*;
	`);
	console.log("MERGE INTO diagram done...");

	const result2 = await client.query(`
		MERGE INTO box b
		USING (
			SELECT rb.uuid_box, rb.title, d.iddiagram
			FROM json_to_recordset('${JSON.stringify(data.box)}') AS rb(${column_list.box})
			JOIN diagram d ON d.uuid_diagram='${uuid_diagram}'
		) rb
		ON b.uuid_box=rb.uuid_box
		WHEN NOT MATCHED BY TARGET THEN
			INSERT (uuid_box, title, iddiagram) VALUES(rb.uuid_box, rb.title, rb.iddiagram)
		WHEN MATCHED AND b.title != rb.title THEN
			UPDATE SET title = rb.title
		WHEN NOT MATCHED BY SOURCE
			AND EXISTS(SELECT * FROM diagram d WHERE d.iddiagram=b.iddiagram AND d.uuid_diagram='${uuid_diagram}')
			THEN DELETE
		RETURNING merge_action(), b.*;
        `);
	console.log(result2.rows);
        console.log("MERGE INTO box done...");

        const result3 = await client.query(`

		MERGE INTO field f
		USING (
			SELECT d.iddiagram, rf.uuid_field, rf.name, b.idbox
			FROM json_to_recordset('${JSON.stringify(data.field)}') AS rf(${column_list.field})
			JOIN json_to_recordset('${JSON.stringify(data.box)}') AS rb(${column_list.box}) ON rf.idbox=rb.idbox
			JOIN box b ON b.uuid_box=rb.uuid_box
			JOIN diagram d ON d.uuid_diagram='${uuid_diagram}'
		) rf
		ON f.uuid_field = rf.uuid_field
		WHEN NOT MATCHED BY TARGET THEN
			INSERT (iddiagram, uuid_field, name, idbox) VALUES(rf.iddiagram, rf.uuid_field, rf.name, rf.idbox)
		WHEN MATCHED AND f.name != rf.name THEN
			UPDATE SET name = rf.name
		WHEN NOT MATCHED BY SOURCE AND EXISTS(SELECT * FROM diagram d WHERE d.iddiagram=f.iddiagram AND d.uuid_diagram='${uuid_diagram}')
			THEN DELETE
		RETURNING merge_action(), f.*;
        `);
	console.log(result3.rows);
        console.log("MERGE INTO field done...");

        const result4 = await client.query(`

		MERGE INTO value v
		USING (
			SELECT d.iddiagram, rv.uuid_value, rv.data, f.idfield
			FROM json_to_recordset('${JSON.stringify(data.value)}') AS rv(${column_list.value})
			JOIN json_to_recordset('${JSON.stringify(data.field)}') AS rf(${column_list.field}) ON rv.idfield=rf.idfield
			JOIN field f ON f.uuid_field = rf.uuid_field
			JOIN diagram d ON d.uuid_diagram='${uuid_diagram}'
		) rv
                ON v.uuid_value = rv.uuid_value
                WHEN NOT MATCHED BY TARGET THEN
                        INSERT (iddiagram, uuid_value, data, idfield) VALUES(rv.iddiagram, rv.uuid_value, rv.data, rv.idfield)
		WHEN MATCHED AND v.data != rv.data THEN
			UPDATE SET data = rv.data
		WHEN MATCHED AND v.idfield != rv.idfield THEN
			UPDATE SET idfield = rv.idfield
                WHEN NOT MATCHED BY SOURCE AND EXISTS(SELECT * FROM diagram d WHERE d.iddiagram=v.iddiagram AND d.uuid_diagram='${uuid_diagram}')
			THEN DELETE
		RETURNING merge_action(), v.*;
        `);
	console.log(result4.rows);
        console.log("MERGE INTO value done...");

        const result5 = await client.query(`

		MERGE INTO link l
		USING (
			SELECT d.iddiagram, rl.uuid_link, b_from.idbox AS idbox_from, f_from.idfield AS idfield_from, b_to.idbox AS idbox_to, f_to.idfield AS idfield_to
			FROM json_to_recordset('${JSON.stringify(data.link)}') AS rl(${column_list.link})
             		JOIN json_to_recordset('${JSON.stringify(data.box)}') AS rb_from(${column_list.box}) ON rl.idbox_from=rb_from.idbox
                        JOIN json_to_recordset('${JSON.stringify(data.box)}') AS rb_to(${column_list.box}) ON rl.idbox_to=rb_to.idbox
               		LEFT JOIN json_to_recordset('${JSON.stringify(data.field)}') AS rf_from(${column_list.field}) ON rl.idfield_from=rf_from.idfield
                        LEFT JOIN json_to_recordset('${JSON.stringify(data.field)}') AS rf_to(${column_list.field}) ON rl.idfield_to=rf_to.idfield
			JOIN box b_from ON b_from.uuid_box=rb_from.uuid_box
			JOIN box b_to ON b_to.uuid_box=rb_to.uuid_box
			LEFT JOIN field f_from ON f_from.uuid_field=rf_from.uuid_field
			LEFT JOIN field f_to ON f_to.uuid_field=rf_to.uuid_field
			JOIN diagram d ON d.uuid_diagram = '${uuid_diagram}'
		) rl
		ON l.uuid_link = rl.uuid_link
		WHEN NOT MATCHED BY TARGET THEN
			INSERT (iddiagram, uuid_link, idbox_from, idfield_from, idbox_to, idfield_to)
			VALUES(rl.iddiagram, rl.uuid_link, rl.idbox_from, rl.idfield_from, rl.idbox_to, rl.idfield_to)
		WHEN NOT MATCHED BY SOURCE
			AND EXISTS(SELECT * FROM diagram d WHERE d.iddiagram=l.iddiagram AND d.uuid_diagram='${uuid_diagram}')
			THEN DELETE
		RETURNING merge_action(), l.*;
        `);
	console.log(result5.rows);
        console.log("MERGE INTO link done...");

        const result6 = await client.query(`

		MERGE INTO tag t
		USING (
			SELECT d.iddiagram, rt.uuid_tag, rt.type_code, rt.code
			FROM json_to_recordset('${JSON.stringify(data.tag)}') AS rt(${column_list.tag})
			JOIN diagram d ON d.uuid_diagram = '${uuid_diagram}'
		) rt
		ON t.uuid_tag = rt.uuid_tag
		WHEN NOT MATCHED BY TARGET THEN
			INSERT (iddiagram, uuid_tag, type_code, code) VALUES(rt.iddiagram, rt.uuid_tag, rt.type_code, rt.code)
		WHEN MATCHED AND t.type_code != rt.type_code THEN
                        UPDATE SET type_code = rt.type_code
                WHEN MATCHED AND t.code != rt.code THEN
                        UPDATE SET code = rt.code
                WHEN NOT MATCHED BY SOURCE
			AND EXISTS(SELECT * FROM diagram d WHERE d.iddiagram = t.iddiagram AND d.uuid_diagram='${uuid_diagram}')
			THEN DELETE
		RETURNING merge_action(), t.*;
        `);
	console.log(result6.rows);
        console.log("MERGE INTO tag done...");

        const result7 = await client.query(`

		MERGE INTO message_tag m
		USING (
			SELECT rm.uuid_message, rm.message, d.iddiagram
			FROM json_to_recordset('${JSON.stringify(data.message_tag)}') AS rm(${column_list.message_tag})
			JOIN diagram d ON d.uuid_diagram = '${uuid_diagram}'
		) rm
		ON m.uuid_message = rm.uuid_message
		WHEN NOT MATCHED BY TARGET THEN
			INSERT (uuid_message, message, iddiagram) VALUES(rm.uuid_message, rm.message, rm.iddiagram)
		WHEN MATCHED AND m.message != rm.message THEN
                        UPDATE SET message = rm.message
		WHEN NOT MATCHED BY SOURCE
			AND EXISTS(SELECT * FROM diagram d WHERE d.iddiagram = m.iddiagram AND d.uuid_diagram='${uuid_diagram}')
			THEN DELETE
		RETURNING merge_action(), m.*;
        `);
	console.log(result7.rows);
        console.log("MERGE INTO message_tag done...");

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
			FROM json_to_recordset('${JSON.stringify(data.graph)}') AS rg("idgraph" int, "uuid_graph" uuid, "from_table" source_table, "from_key" int, "to_table" target_table, "to_key" int)
			LEFT JOIN json_to_recordset('${JSON.stringify(data.tag)}') AS rt(${column_list.tag}) ON rt.idtag=rg.from_key
			LEFT JOIN tag t ON t.uuid_tag = rt.uuid_tag
			LEFT JOIN json_to_recordset('${JSON.stringify(data.message_tag)}') AS rm(${column_list.message_tag}) ON rm.idmessage=rg.from_key
			LEFT JOIN message_tag m ON m.uuid_message = rm.uuid_message
			LEFT JOIN json_to_recordset('${JSON.stringify(data.box)}') AS rb(${column_list.box}) ON rb.idbox=rg.to_key
			LEFT JOIN box b ON b.uuid_box = rb.uuid_box
                        LEFT JOIN json_to_recordset('${JSON.stringify(data.field)}') AS rf(${column_list.field}) ON rf.idfield=rg.to_key
			LEFT JOIN field f ON f.uuid_field = rf.uuid_field
 			LEFT JOIN json_to_recordset('${JSON.stringify(data.value)}') AS rv(${column_list.value}) ON rv.idvalue=rg.to_key
			LEFT JOIN value v ON v.uuid_value = rv.uuid_value
			LEFT JOIN json_to_recordset('${JSON.stringify(data.link)}') AS rl(${column_list.link}) ON rl.idlink=rg.to_key
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
			SELECT * FROM diagram d WHERE g.iddiagram=d.iddiagram AND d.uuid_diagram='${uuid_diagram}'
		)
		THEN DELETE
		RETURNING merge_action(), g.*;
        `);
	console.log(result8.rows);
        console.log("MERGE INTO graph done...");

        const result9 = await client.query(`

		MERGE INTO rectangle r
		USING (
			SELECT d.iddiagram, rr.uuid_rectangle, rr.width, rr.height, b.idbox
			FROM json_to_recordset('${JSON.stringify(data.rectangle)}') AS rr(${column_list.rectangle})
			JOIN json_to_recordset('${JSON.stringify(data.box)}') AS rb(${column_list.box}) ON rr.idbox=rb.idbox
			JOIN box b ON b.uuid_box=rb.uuid_box
			JOIN diagram d ON d.uuid_diagram='${uuid_diagram}'
		) rr
		ON r.uuid_rectangle = rr.uuid_rectangle
		WHEN NOT MATCHED BY TARGET THEN
			INSERT (iddiagram, uuid_rectangle, width, height, idbox)
			VALUES(rr.iddiagram, rr.uuid_rectangle, rr.width, rr.height, rr.idbox)
		WHEN MATCHED AND r.width != rr.width THEN
			UPDATE SET width = rr.width
		WHEN MATCHED AND r.height != rr.height THEN
			UPDATE SET height = rr.height
		WHEN NOT MATCHED BY SOURCE
                       AND EXISTS(SELECT * FROM diagram d WHERE d.iddiagram=r.iddiagram AND d.uuid_diagram='${uuid_diagram}')
			THEN DELETE
		RETURNING merge_action(), r.*;
        `);
	console.log(result9.rows);
        console.log("MERGE INTO rectangle done...");

        const result10 = await client.query(`

		MERGE INTO translation t
		USING (
			SELECT d.iddiagram, rt.uuid_translation, rt.context, r.idrectangle, rt.x, rt.y, rt.z
			FROM json_to_recordset('${JSON.stringify(data.translation)}') AS rt(${column_list.translation})
			JOIN json_to_recordset('${JSON.stringify(data.rectangle)}') AS rr(${column_list.rectangle}) ON rt.idrectangle=rr.idrectangle
			JOIN rectangle r ON r.uuid_rectangle=rr.uuid_rectangle
			JOIN diagram d ON d.uuid_diagram='${uuid_diagram}'
		) rt
		ON t.uuid_translation = rt.uuid_translation
		WHEN NOT MATCHED BY TARGET THEN
			INSERT (iddiagram, uuid_translation, context, idrectangle, x, y, z)
			VALUES(rt.iddiagram, rt.uuid_translation, rt.context, rt.idrectangle, rt.x, rt.y, rt.z)
		WHEN MATCHED AND t.context != rt.context THEN
			UPDATE SET context = rt.context
		WHEN MATCHED AND t.x != rt.x THEN
			UPDATE SET x = rt.x
		WHEN MATCHED AND t.y != rt.y THEN
			UPDATE SET y = rt.y
		WHEN MATCHED AND t.z != rt.z THEN
			UPDATE SET z = rt.z
		WHEN NOT MATCHED BY SOURCE
                       AND EXISTS(SELECT * FROM diagram d WHERE d.iddiagram=t.iddiagram AND d.uuid_diagram='${uuid_diagram}')
			THEN DELETE
		RETURNING merge_action(), t.*;
        `);
	console.log(result10.rows);
        console.log("MERGE INTO translation done...");
/*
        const result11 = await client.query(`

		MERGE INTO polyline p
		USING json_to_recordset('${JSON.stringify(data.polyline)}') AS rp(${column_list.polyline})
		ON p.uuid_polyline = rp.uuid_polyline
		WHEN NOT MATCHED BY TARGET THEN
			INSERT (uuid_polyline, context, points) VALUES(rp.uuid_polyline, rp.context, rp.points)
		WHEN MATCHED AND p.context != rp.context THEN
			UPDATE SET context = rp.context
		WHEN MATCHED AND p.points != rp.points THEN
			UPDATE SET points = rp.points
		WHEN NOT MATCHED BY SOURCE
			AND EXISTS (SELECT * FROM diagram d WHERE d.iddiagram=p.iddiagram AND d.uuid_diagram='${uuid_diagram}')
			THEN DELETE
		RETURNING merge_action(), p.*;
	`);
	console.log(result11.rows);
	console.log("MERGE INTO polyline done...");
*/
})


app.get('/linkedboxdraw/list', async (req, res) => {

      const client = new Client({
                host:'localhost',
                port:5433,
                user:'postgres',
                password:'7472',
                database:'linkedboxdraw'
        });
        await client.connect();

	const result = await client.query(`
		SELECT json_agg(json_build_object('uuid_diagram', uuid_diagram, 'title', title) ORDER BY title)
		FROM diagram
	`);

	const doc = result.rows[0].json_agg;
        const json_doc = JSON.stringify(doc);
        console.log(json_doc);
        res.json(json_doc);

});


app.get('/linkedboxdraw/get', async (req, res) => {
        console.log(req.query);
	const uuid_diagram = req.query.uuid_diagram;
	console.log(uuid_diagram);

       const client = new Client({
                host:'localhost',
                port:5433,
                user:'postgres',
                password:'7472',
                database:'linkedboxdraw'
        });
        await client.connect();

 	const result = await client.query(`
  	SELECT json_build_object(
		'diagram', (SELECT json_agg(row_to_json(d))::json FROM diagram d WHERE d.uuid_diagram='${uuid_diagram}'),
		'box', (SELECT json_agg(row_to_json(b))::json FROM box b JOIN diagram d ON d.iddiagram=b.iddiagram AND d.uuid_diagram='${uuid_diagram}'),
		'field', (SELECT coalesce(json_agg(row_to_json(f))::json, '[]'::json) FROM field f JOIN diagram d ON d.iddiagram=f.iddiagram AND d.uuid_diagram='${uuid_diagram}'),
		'value', (SELECT coalesce(json_agg(row_to_json(v))::json, '[]'::json) FROM value v JOIN diagram d ON d.iddiagram=v.iddiagram AND d.uuid_diagram='${uuid_diagram}'),
		'link', (SELECT coalesce(json_agg(row_to_json(l))::json, '[]'::json) FROM link l JOIN diagram d ON d.iddiagram=l.iddiagram AND d.uuid_diagram='${uuid_diagram}'),
		'tag', (SELECT json_agg(row_to_json(t))::json FROM tag t JOIN diagram d ON d.iddiagram=t.iddiagram AND d.uuid_diagram='${uuid_diagram}'),
		'message_tag', (SELECT coalesce(json_agg(row_to_json(m))::json, '[]'::json) FROM message_tag m JOIN diagram d ON d.iddiagram=m.iddiagram AND d.uuid_diagram='${uuid_diagram}'),
		'graph', (SELECT coalesce(json_agg(row_to_json(g))::json, '[]'::json) FROM graph g JOIN diagram d ON d.iddiagram=g.iddiagram AND d.uuid_diagram='${uuid_diagram}'),
		'rectangle', (SELECT json_agg(row_to_json(r))::json FROM rectangle r JOIN diagram d ON d.iddiagram=r.iddiagram AND d.uuid_diagram='${uuid_diagram}'),
		'translation', (SELECT json_agg(row_to_json(t))::json FROM translation t JOIN diagram d ON d.iddiagram=t.iddiagram AND d.uuid_diagram='${uuid_diagram}'),
		'polyline', (SELECT coalesce(json_agg(row_to_json(p))::json, '[]'::json) FROM polyline p JOIN diagram d ON d.iddiagram=p.iddiagram AND d.uuid_diagram='${uuid_diagram}')
	)
	`);

	const doc = result.rows[0].json_build_object;
	const json_doc = JSON.stringify(doc);
	console.log(json_doc);
	res.json(json_doc);
})

