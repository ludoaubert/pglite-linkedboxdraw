SELECT setval(pg_get_serial_sequence('box', 'idbox'), (SELECT MAX(idbox) FROM box) + 1);

