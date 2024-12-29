export {sample_diagdata}

const sample_diagdata = `
INSERT INTO diagram(iddiagram, title) VALUES (1, 'Jacket Gafa BlemePro');

INSERT INTO box(title) VALUES
		('ChanmeBlemeproPec'),
  		('PouilledePotecaCaillerag'),
    		('Blemepro'),
      		('TassepeTcheubi'),
		('GuedraTeucheTipeu'),
  		('TejeTiepeTigenToncarInsseGueusGuedinUc'),
    		('Lassedege'),
      		('fechnoueuf'),
		('ZetiNoichNeuthuZincMeucaYoce'),
  		('zomblou'),
    		('lassedegLeurdit'),
      		('youvoi'),
		('lacelles'),
  		('mefu'),
    		('euf'),
      		('zedouZicmus'),
		('vessause'),
  		('KeneVeugra'),
    		('keusse'),
      		('usage');

WITH cte(box_title, field_name) AS (
	SELECT 'ChanmeBlemeproPec', 'teillebouRap' UNION ALL
	SELECT 'PouilledePotecaCaillerag', 'cesu' UNION ALL
 	SELECT 'PouilledePotecaCaillerag', 'reusta' UNION ALL
	SELECT 'Blemepro', 'cesu' UNION ALL
 	SELECT 'Blemepro', 'Peuclo' UNION ALL
  	SELECT 'Blemepro', 'name' UNION ALL
   	SELECT 'Blemepro', 'phoneTel' UNION ALL
    	SELECT 'Blemepro', 'donbi' UNION ALL
	SELECT 'TassepeTcheubi', 'telmor' UNION ALL
 	SELECT 'TassepeTcheubi', 'meuf' UNION ALL
  	SELECT 'TassepeTcheubi', 'guedinTeub' UNION ALL
   	SELECT 'TassepeTcheubi', 'teillebouRap' UNION ALL
    	SELECT 'TassepeTcheubi', 'guezmere' UNION ALL
     	SELECT 'TassepeTcheubi', 'donbi' UNION ALL
	SELECT 'GuedraTeucheTipeu', 'tepo' UNION ALL
 	SELECT 'GuedraTeucheTipeu', 'teillebouRap' UNION ALL
	SELECT 'TejeTiepeTigenToncarInsseGueusGuedinUc', 'cesu' UNION ALL
 	SELECT 'TejeTiepeTigenToncarInsseGueusGuedinUc', 'yeuf' UNION ALL
  	SELECT 'TejeTiepeTigenToncarInsseGueusGuedinUc', 'KeneVeugra' UNION ALL
	SELECT 'Lassedege', 'cesu' UNION ALL
 	SELECT 'Lassedege', 'al' UNION ALL
  	SELECT 'Lassedege', 'zessegon' UNION ALL
   	SELECT 'Lassedege', 'Peuclo' UNION ALL
    	SELECT 'Lassedege', 'yepe' UNION ALL
     	SELECT 'Lassedege', 'zeto' UNION ALL
      	SELECT 'Lassedege', 'phoneTel' UNION ALL
	SELECT 'fechnoueuf', 'cesu' UNION ALL
 	SELECT 'fechnoueuf', 'gova' UNION ALL
  	SELECT 'fechnoueuf', 'vessause' UNION ALL
	SELECT 'ZetiNoichNeuthuZincMeucaYoce', '[lassedeg]' UNION ALL
 	SELECT 'ZetiNoichNeuthuZincMeucaYoce', '[yecous]' UNION ALL
  	SELECT 'ZetiNoichNeuthuZincMeucaYoce', 'zebe' UNION ALL
	SELECT 'zomblou', '[zedouZicmus]' UNION ALL
 	SELECT 'zomblou', '[mifaOideOiteOe]' UNION ALL
  	SELECT 'zomblou', '[zessegonNeuthu]' UNION ALL
   	SELECT 'zomblou', 'yeuf' UNION ALL
	SELECT 'lassedegLeurdit', '[zomblou]{2}' UNION ALL
 	SELECT 'lassedegLeurdit', 'zenZincs' UNION ALL
  	SELECT 'lassedegLeurdit', 'vessause' UNION ALL
   	SELECT 'lassedegLeurdit', 'yeuf' UNION ALL
    	SELECT 'lassedegLeurdit', 'oinje' UNION ALL
	SELECT 'youvoi', '[yeufi]{2}' UNION ALL
 	SELECT 'youvoi', 'zyva' UNION ALL
  	SELECT 'youvoi', 'yepe' UNION ALL
   	SELECT 'youvoi', 'zetyenchesZeyo' UNION ALL
    	SELECT 'youvoi', 'nemobitKps' UNION ALL
     	SELECT 'youvoi', 'keuf' UNION ALL
	SELECT 'lacelles', 'keblo' UNION ALL
 	SELECT 'lacelles', 'euf' UNION ALL
	SELECT 'mefu', 'cesu' UNION ALL
 	SELECT 'mefu', 'zeberyep' UNION ALL
  	SELECT 'mefu', 'youvoiUc' UNION ALL
	SELECT 'euf', 'lassedeg' UNION ALL
 	SELECT 'euf', 'id' UNION ALL
  	SELECT 'euf', 'fichateraToDeuspidrepo' UNION ALL
   	SELECT 'euf', 'yecous' UNION ALL
	SELECT 'zedouZicmus', '[updatesKecos]' UNION ALL
 	SELECT 'zedouZicmus, 'yeufiyechKeco' UNION ALL
	SELECT 'vessause', 'lassedeg' UNION ALL
 	SELECT 'vessause, 'persistenceYeche' UNION ALL
	SELECT 'KeneVeugra', 'name' UNION ALL
 	SELECT 'KeneVeugra', '[symbolsIndices]' UNION ALL
  	SELECT 'KeneVeugra', 'kisdeAggregator' UNION ALL
	SELECT 'keusse', 'al' UNION ALL
 	SELECT 'keusse, 'zeto' UNION ALL
	SELECT 'usage', '[zomblouLeurdits]' UNION ALL
 	SELECT 'usage', '{youvois}' UNION ALL
  	SELECT 'usage', 'fechnoueuf' UNION ALL
   	SELECT 'usage', 'lancebaVeucheYeuveZarbiZeu' UNION ALL
    	SELECT 'usage', 'Zeyos' UNION ALL
     	SELECT 'usage', 'euf'
)
INSERT INTO field(idbox, name)
SELECT b.idbox, cte.field_name
FROM cte
JOIN box b ON b.title=cte.box_title;


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
--(7+1, 0+1),
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

WITH cte(fromBoxTitle, fromFieldName, toBoxTitle, toFieldName) AS (
 	SELECT 'fechnoueuf','cesu','ChanmeBlemeproPec','teillebouRap'
), cte2 AS (
	SELECT DISTINCT from_box.idbox AS idbox_from, 
			from_field.idfield AS idfield_from, 
			to_box.idbox AS idbox_to,
			to_field.idfield AS idfield_to
	FROM cte
	JOIN box from_box ON from_box.title = fromBoxTitle
	JOIN field from_field ON from_field.idbox = from_box.idbox AND from_field.name=fromFieldName
	JOIN box to_box ON to_box.title = toBoxTitle
	JOIN field to_field ON to_field.idbox = to_box.idbox AND to_field.name=toFieldName
), cte3 AS (
	SELECT idbox_from, idfield_from, idbox_to, idfield_to,
		ROW_NUMBER() OVER(PARTITION BY idbox_from+idbox_to, idbox_from*idbox_to ORDER BY idbox_from,idbox_to) AS rn
	FROM cte2
)
INSERT INTO link(idbox_from, idfield_from, idbox_to, idfield_to)
SELECT idbox_from, idfield_from, idbox_to, idfield_to
FROM cte3
WHERE rn=1 AND idbox_from != idbox_to;

WITH cte(box_title, field_name, color) AS (
	SELECT 'euf','lassedeg','yellow' UNION ALL
	SELECT 'mefu','zeberyep','hotpink'
)
INSERT INTO graph(from_table, from_key, to_table, to_key)
SELECT 'tag', t.idtag, 'field', f.idfield
FROM cte
JOIN tag t ON t.type_code='COLOR' AND t.code=cte.color
JOIN box b ON b.title = cte.box_title
JOIN field f ON f.idbox = b.idbox AND f.name = cte.field_name;

`
