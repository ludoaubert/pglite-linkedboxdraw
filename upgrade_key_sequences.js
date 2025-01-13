SELECT setval(pg_get_serial_sequence('box', 'idbox'), (SELECT MAX(idbox) FROM box) + 1);
SELECT setval(pg_get_serial_sequence('field', 'idfield'), (SELECT MAX(idfield) FROM field) + 1);
SELECT setval(pg_get_serial_sequence('value', 'idvalue'), (SELECT MAX(idvalue) FROM value) + 1);
SELECT setval(pg_get_serial_sequence('rectangle', 'idrectangle'), (SELECT MAX(idrectangle) FROM rectangle) + 1);
SELECT setval(pg_get_serial_sequence('translation', 'idtranslation'), (SELECT MAX(idtranslation) FROM translation) + 1);
SELECT setval(pg_get_serial_sequence('link', 'idlink'), (SELECT MAX(idlink) FROM link) + 1);
SELECT setval(pg_get_serial_sequence('graph', 'idgraph'), (SELECT MAX(idgraph) FROM graph) + 1);
