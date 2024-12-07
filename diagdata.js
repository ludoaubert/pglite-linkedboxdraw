export {sample_diagdata}

const sample_diagdata = `
INSERT INTO diagram(iddiagram, title) VALUES (1, 'Jacket Gafa BlemePro');

INSERT INTO box(idbox, title, iddiagram) VALUES (1, 'ChanmeBlemeproPec', 1);
INSERT INTO field(name, idbox) VALUES ('teillebouRap', 1);

INSERT INTO box(idbox, title, iddiagram) VALUES (2, 'PouilledePotecaCaillerag', 1);
INSERT INTO field(name, idbox) VALUES ('cesu', 2), ('reusta', 2);

INSERT INTO box(idbox, title, iddiagram) VALUES(3, 'Blemepro', 1);
INSERT INTO field(name, idbox) VALUES ('cesu', 3), ('Peuclo', 3), ('name', 3), ('phoneTel', 3), ('donbi', 3);

INSERT INTO box(idbox, title, iddiagram) VALUES(4, 'TassepeTcheubi', 1);
INSERT INTO field(name, idbox) VALUES ('telmor', 4), ('meuf', 4), ('guedinTeub', 4), ('teillebouRap', 4), ('guezmere', 4), ('donbi', 4);

INSERT INTO box(idbox, title, iddiagram) VALUES(5, 'GuedraTeucheTipeu', 1);
INSERT INTO field(name, idbox) VALUES ('tepo', 5), ('teillebouRap', 5);

INSERT INTO box(idbox, title, iddiagram) VALUES(6, 'TejeTiepeTigenToncarInsseGueusGuedinUc', 1);
INSERT INTO field(name, idbox) VALUES ('cesu', 6), ('yeuf', 6), ('KeneVeugra', 6);

INSERT INTO box(idbox, title, iddiagram) VALUES(7, 'Lassedege', 1);
INSERT INTO field(name, idbox) VALUES ('cesu', 7), ('al', 7), ('zessegon', 7), ('Peuclo', 7), ('yepe', 7), ('zeto', 7), ('phoneTel', 7);

INSERT INTO box(idbox, title, iddiagram) VALUES(8, 'fechnoueuf', 1);
INSERT INTO field(name, idbox) VALUES ('cesu', 8), ('gova', 8), ('vessause', 8);

INSERT INTO box(idbox, title, iddiagram) VALUES(9, 'ZetiNoichNeuthuZincMeucaYoce', 1);
INSERT INTO field(name, idbox) VALUES ('[lassedeg]', 9), ('[yecous]', 9), ('zebe', 9);

INSERT INTO box(idbox, title, iddiagram) VALUES(10, 'zomblou', 1);
INSERT INTO field(name, idbox) VALUES ('[zedouZicmus]', 10), ('[mifaOideOiteOe]', 10), ('[zessegonNeuthu]', 10), ('yeuf', 10);

INSERT INTO box(idbox, title, iddiagram) VALUES(11, 'lassedegLeurdit', 1);
INSERT INTO field(name, idbox) VALUES ('[zomblou]{2}', 11), ('zenZincs', 11), ('vessause', 11), ('yeuf', 11), ('oinje', 11);

INSERT INTO box(idbox, title, iddiagram) VALUES(12, 'youvoi', 1);
INSERT INTO field(name, idbox) VALUES ('[yeufi]{2}', 12), ('zyva', 12), ('yepe', 12), ('zetyenchesZeyo', 12), ('nemobitKps', 12), ('keuf', 12);

INSERT INTO box(idbox, title, iddiagram) VALUES(13, 'lacelles', 1);
INSERT INTO field(name, idbox) VALUES ('keblo', 13), ('euf', 13);

INSERT INTO box(idbox, title, iddiagram) VALUES(14, 'mefu', 1);
INSERT INTO field(name, idbox) VALUES ('cesu', 14), ('zeberyep', 14), ('youvoiUc', 14);

INSERT INTO box(idbox, title, iddiagram) VALUES(15, 'euf', 1);
INSERT INTO field(name, idbox) VALUES ('lassedeg', 15), ('id', 15), ('fichateraToDeuspidrepo', 15), ('yecous', 15);

INSERT INTO box(idbox, title, iddiagram) VALUES(16, 'zedouZicmus', 1);
INSERT INTO field(name, idbox) VALUES ('[updatesKecos]', 16), ('yeufiyechKeco', 16);

INSERT INTO box(idbox, title, iddiagram) VALUES(17, 'vessause', 1);
INSERT INTO field(name, idbox) VALUES ('lassedeg', 17), ('persistenceYeche', 17);

INSERT INTO box(idbox, title, iddiagram) VALUES(18, 'KeneVeugra', 1);
INSERT INTO field(name, idbox) VALUES ('name', 18), ('[symbolsIndices]', 18), ('kisdeAggregator', 18);

INSERT INTO box(idbox, title, iddiagram) VALUES(19, 'keusse', 1);
INSERT INTO field(name, idbox) VALUES ('al', 19), ('zeto', 19);

INSERT INTO box(idbox, title, iddiagram) VALUES(20, 'usage', 1);
INSERT INTO field(name, idbox) VALUES ('[zomblouLeurdits]', 20), ('{youvois}', 20), ('fechnoueuf', 20), ('lancebaVeucheYeuveZarbiZeu', 20), ('Zeyos', 20), ('euf', 20);

INSERT INTO link(idbox_from, idbox_to) VALUES
(2+1, 14+1),
(2+1, 5+1),
(17+1, 7+1),
(6+1, 14+1),
(6+1, 5+1),
(1+1, 14+1),
(3+1, 4+1),
(5+1, 17+1),
(8+1, 9+1),
(14+1, 7+1),
(7+1, 0+1),
(7+1, 16+1),
(12+1, 14+1),
(10+1, 18+1),
(10+1, 16+1),
(10+1, 9+1),
(19+1, 10+1),
(19+1, 7+1),
(19+1, 8+1),
(19+1, 11+1),
(16+1, 3+1),
(11+1, 13+1),
(9+1, 15+1);

WITH cte(box_title, field_name, color) AS (
	SELECT 'euf','lassedeg','yellow' UNION ALL
	SELECT 'mefu','zeberyep','hotpink'
)
INSERT INTO graph(from_table, from_key, to_table, to_key)
SELECT 'tag', t.idtag, 'field', f.idfield
FROM cte
JOIN tag t ON t.type_code='COLOR' AND t.code=cte.color
JOIN box b ON b.title = cte.box_title
JOIN field f ON f.idbox = f.idbox AND f.name = cte.field_name;

`
