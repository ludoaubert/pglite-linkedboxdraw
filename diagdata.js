export {sample_diagdata}

const sample_diagdata = `
INSERT INTO diagram(iddiagram, title) VALUES (1, 'Jacket Gafa BlemePro');

INSERT INTO tag(type_code, code) VALUES
('KEY','PRIMARY_KEY'),('KEY','FOREIGN_KEY'),
('CONSTRAINT','UNIQUE'),
('COLOR','yellow'),('COLOR','pink'),('COLOR','hotpink'),('COLOR','palegreen'),('COLOR','red'),('COLOR','orange'),('COLOR','skyblue'),('COLOR','olive'),('COLOR','grey'),('COLOR','darkviolet'),
('LINK_COLOR','lime'),('LINK_COLOR','fuchsia'),('LINK_COLOR','teal'),('LINK_COLOR','aqua'),('LINK_COLOR','aquamarine'),('LINK_COLOR','coral'),('LINK_COLOR','cornflowerblue'),('LINK_COLOR','darkgray'),('LINK_COLOR','darkkhaki'),
('LINK_COLOR','indianred'),('LINK_COLOR','indigo'),('LINK_COLOR','ivory'),('LINK_COLOR','khaki'),('LINK_COLOR','mediumorchid'),('LINK_COLOR','mediumpurple'),('LINK_COLOR','lawngreen'),('LINK_COLOR','lemonchiffon'),
('LINK_COLOR','lightblue'),('LINK_COLOR','lightcoral'),('LINK_COLOR','greenyellow'),('LINK_COLOR','lightgoldenrodyellow'),('LINK_COLOR','lightgray'),('LINK_COLOR','lightgreen'),('LINK_COLOR','lightgrey'),('LINK_COLOR','lightpink'),('LINK_COLOR','lightsalmon'),('LINK_COLOR','lightseagreen'),('LINK_COLOR','lightskyblue'),('LINK_COLOR','lightslategray'),
('RELATION_CATEGORY','TR2'),
('RELATION_CARDINALITY', '1,1'),('RELATION_CARDINALITY', '1,n'),('RELATION_CARDINALITY', 'n,n');

WITH cte(box_title) AS (
	SELECT 'ChanmeBlemeproPec' UNION ALL
  	SELECT 'PouilledePotecaCaillerag' UNION ALL
    	SELECT 'Blemepro' UNION ALL
      	SELECT 'TassepeTcheubi' UNION ALL
	SELECT 'GuedraTeucheTipeu' UNION ALL
  	SELECT 'TejeTiepeTigenToncarInsseGueusGuedinUc' UNION ALL
    	SELECT 'Lassedege' UNION ALL
      	SELECT 'fechnoueuf' UNION ALL
	SELECT 'ZetiNoichNeuthuZincMeucaYoce' UNION ALL
  	SELECT 'zomblou' UNION ALL
    	SELECT 'lassedegLeurdit' UNION ALL
      	SELECT 'youvoi' UNION ALL
	SELECT 'lacelles' UNION ALL
  	SELECT 'mefu' UNION ALL
    	SELECT 'euf' UNION ALL
      	SELECT 'zedouZicmus' UNION ALL
	SELECT 'vessause' UNION ALL
  	SELECT 'KeneVeugra' UNION ALL
    	SELECT 'keusse' UNION ALL
      	SELECT 'usage'
)
INSERT INTO box(title)
SELECT box_title
FROM cte;

WITH cte(box_title, field_name) AS (
	SELECT 'ChanmeBlemeproPec', 'idcbp' UNION ALL
	SELECT 'ChanmeBlemeproPec', 'teillebouRap' UNION ALL
 	SELECT 'PouilledePotecaCaillerag', 'idppc' UNION ALL
  	SELECT 'PouilledePotecaCaillerag', 'ide' UNION ALL
	SELECT 'PouilledePotecaCaillerag', 'cesu' UNION ALL
 	SELECT 'PouilledePotecaCaillerag', 'reusta' UNION ALL
  	SELECT 'Blemepro', 'idb' UNION ALL
   	SELECT 'Blemepro', 'ide' UNION ALL
    	SELECT 'Blemepro', 'idttttiggu' UNION ALL
	SELECT 'Blemepro', 'cesu' UNION ALL
 	SELECT 'Blemepro', 'Peuclo' UNION ALL
  	SELECT 'Blemepro', 'name' UNION ALL
   	SELECT 'Blemepro', 'phoneTel' UNION ALL
    	SELECT 'Blemepro', 'donbi' UNION ALL
     	SELECT 'TassepeTcheubi', 'idtt' UNION ALL
      	SELECT 'TassepeTcheubi', 'idgtt' UNION ALL
	SELECT 'TassepeTcheubi', 'telmor' UNION ALL
 	SELECT 'TassepeTcheubi', 'meuf' UNION ALL
  	SELECT 'TassepeTcheubi', 'guedinTeub' UNION ALL
   	SELECT 'TassepeTcheubi', 'teillebouRap' UNION ALL
    	SELECT 'TassepeTcheubi', 'guezmere' UNION ALL
     	SELECT 'TassepeTcheubi', 'donbi' UNION ALL
      	SELECT 'GuedraTeucheTipeu', 'idgtt' UNION ALL
	SELECT 'GuedraTeucheTipeu', 'tepo' UNION ALL
 	SELECT 'GuedraTeucheTipeu', 'teillebouRap' UNION ALL
  	SELECT 'TejeTiepeTigenToncarInsseGueusGuedinUc', 'idttttiggu' UNION ALL
   	SELECT 'TejeTiepeTigenToncarInsseGueusGuedinUc', 'idkv' UNION ALL
	SELECT 'TejeTiepeTigenToncarInsseGueusGuedinUc', 'cesu' UNION ALL
 	SELECT 'TejeTiepeTigenToncarInsseGueusGuedinUc', 'yeuf' UNION ALL
  	SELECT 'TejeTiepeTigenToncarInsseGueusGuedinUc', 'KeneVeugra' UNION ALL
   	SELECT 'Lassedege', 'idl' UNION ALL
    	SELECT 'Lassedege', 'ide' UNION ALL
     	SELECT 'Lassedege', 'idttttiggu' UNION ALL
	SELECT 'Lassedege', 'cesu' UNION ALL
 	SELECT 'Lassedege', 'al' UNION ALL
  	SELECT 'Lassedege', 'zessegon' UNION ALL
   	SELECT 'Lassedege', 'Peuclo' UNION ALL
    	SELECT 'Lassedege', 'yepe' UNION ALL
     	SELECT 'Lassedege', 'zeto' UNION ALL
      	SELECT 'Lassedege', 'phoneTel' UNION ALL
       	SELECT 'fechnoueuf', 'idf' UNION ALL
	SELECT 'fechnoueuf', 'idv' UNION ALL
 	SELECT 'fechnoueuf', 'idcbp' UNION ALL
	SELECT 'fechnoueuf', 'cesu' UNION ALL
 	SELECT 'fechnoueuf', 'gova' UNION ALL
  	SELECT 'fechnoueuf', 'vessause' UNION ALL
   	SELECT 'ZetiNoichNeuthuZincMeucaYoce', 'idznnzmy' UNION ALL
    	SELECT 'ZetiNoichNeuthuZincMeucaYoce', 'idz' UNION ALL
	SELECT 'ZetiNoichNeuthuZincMeucaYoce', '[lassedeg]' UNION ALL
 	SELECT 'ZetiNoichNeuthuZincMeucaYoce', '[yecous]' UNION ALL
  	SELECT 'ZetiNoichNeuthuZincMeucaYoce', 'zebe' UNION ALL
   	SELECT 'zomblou', 'idz' UNION ALL
    	SELECT 'zomblou', 'idzz' UNION ALL
	SELECT 'zomblou', '[zedouZicmus]' UNION ALL
 	SELECT 'zomblou', '[mifaOideOiteOe]' UNION ALL
  	SELECT 'zomblou', '[zessegonNeuthu]' UNION ALL
   	SELECT 'zomblou', 'yeuf' UNION ALL
    	SELECT 'lassedegLeurdit', 'idll' UNION ALL
     	SELECT 'lassedegLeurdit', 'idk' UNION ALL
      	SELECT 'lassedegLeurdit', 'idv' UNION ALL
       	SELECT 'lassedegLeurdit', 'idz' UNION ALL
	SELECT 'lassedegLeurdit', '[zomblou]{2}' UNION ALL
 	SELECT 'lassedegLeurdit', 'zenZincs' UNION ALL
  	SELECT 'lassedegLeurdit', 'vessause' UNION ALL
   	SELECT 'lassedegLeurdit', 'yeuf' UNION ALL
    	SELECT 'lassedegLeurdit', 'oinje' UNION ALL
     	SELECT 'youvoi', 'idy' UNION ALL
      	SELECT 'youvoi', 'idm' UNION ALL
	SELECT 'youvoi', '[yeufi]{2}' UNION ALL
 	SELECT 'youvoi', 'zyva' UNION ALL
  	SELECT 'youvoi', 'yepe' UNION ALL
   	SELECT 'youvoi', 'zetyenchesZeyo' UNION ALL
    	SELECT 'youvoi', 'nemobitKps' UNION ALL
     	SELECT 'youvoi', 'keuf' UNION ALL
      	SELECT 'lacelles', 'idls' UNION ALL
       	SELECT 'lacelles', 'ide' UNION ALL
	SELECT 'lacelles', 'keblo' UNION ALL
 	SELECT 'lacelles', 'euf' UNION ALL
  	SELECT 'mefu', 'idm' UNION ALL
	SELECT 'mefu', 'cesu' UNION ALL
 	SELECT 'mefu', 'zeberyep' UNION ALL
  	SELECT 'mefu', 'youvoiUc' UNION ALL
   	SELECT 'euf', 'ide' UNION ALL
    	SELECT 'euf', 'idf' UNION ALL
	SELECT 'euf', 'lassedeg' UNION ALL
 	SELECT 'euf', 'id' UNION ALL
  	SELECT 'euf', 'fichateraToDeuspidrepo' UNION ALL
   	SELECT 'euf', 'yecous' UNION ALL
    	SELECT 'zedouZicmus', 'idzz' UNION ALL
	SELECT 'zedouZicmus', '[updatesKecos]' UNION ALL
 	SELECT 'zedouZicmus', 'yeufiyechKeco' UNION ALL
  	SELECT 'vessause', 'idv' UNION ALL
   	SELECT 'vessause', 'idtt' UNION ALL
	SELECT 'vessause', 'lassedeg' UNION ALL
 	SELECT 'vessause', 'persistenceYeche' UNION ALL
  	SELECT 'KeneVeugra', 'idkv' UNION ALL
   	SELECT 'KeneVeugra', 'idf' UNION ALL
	SELECT 'KeneVeugra', 'name' UNION ALL
 	SELECT 'KeneVeugra', '[symbolsIndices]' UNION ALL
  	SELECT 'KeneVeugra', 'kisdeAggregator' UNION ALL
   	SELECT 'keusse', 'idk' UNION ALL
	SELECT 'keusse', 'al' UNION ALL
 	SELECT 'keusse', 'zeto' UNION ALL
  	SELECT 'usage', 'idu' UNION ALL
   	SELECT 'usage', 'idll' UNION ALL
    	SELECT 'usage', 'idf' UNION ALL
     	SELECT 'usage', 'idznnzmy' UNION ALL
      	SELECT 'usage', 'idy' UNION ALL
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


WITH cte(fromBoxTitle, fromFieldName, toBoxTitle, toFieldName) AS ( 
 	SELECT 'Blemepro', 'ide', 'euf', 'ide' UNION ALL
  	SELECT 'Blemepro', 'idttttiggu', 'TejeTiepeTigenToncarInsseGueusGuedinUc', 'idttttiggu' UNION ALL
	SELECT 'KeneVeugra', 'idf', 'fechnoueuf', 'idf' UNION ALL
 	SELECT 'Lassedege', 'ide', 'euf', 'ide' UNION ALL
  	SELECT 'Lassedege', 'idttttiggu', 'TejeTiepeTigenToncarInsseGueusGuedinUc', 'idttttiggu' UNION ALL
   	SELECT 'PouilledePotecaCaillerag', 'ide', 'euf', 'ide' UNION ALL
      	SELECT 'TassepeTcheubi', 'idgtt', 'GuedraTeucheTipeu', 'idgtt' UNION ALL
       	SELECT 'TejeTiepeTigenToncarInsseGueusGuedinUc', 'idkv', 'KeneVeugra', 'idkv' UNION ALL
	SELECT 'ZetiNoichNeuthuZincMeucaYoce', 'idz', 'zomblou', 'idz' UNION ALL
 	SELECT 'euf', 'idf', 'fechnoueuf', 'idf' UNION ALL
	SELECT 'fechnoueuf', 'idcbp', 'ChanmeBlemeproPec', 'idcbp' UNION ALL
	SELECT 'fechnoueuf', 'idv', 'vessause', 'idv' UNION ALL
	SELECT 'lacelles', 'ide', 'euf', 'ide' UNION ALL
	SELECT 'lassedegLeurdit', 'idk', 'keusse', 'idk' UNION ALL
	SELECT 'lassedegLeurdit', 'idv', 'vessause', 'idv' UNION ALL
	SELECT 'lassedegLeurdit', 'idz', 'zomblou', 'idz' UNION ALL
	SELECT 'usage', 'idll', 'lassedegLeurdit', 'idll' UNION ALL
	SELECT 'usage', 'idf', 'fechnoueuf', 'idf' UNION ALL
	SELECT 'usage', 'idznnzmy', 'ZetiNoichNeuthuZincMeucaYoce', 'idznnzmy' UNION ALL
	SELECT 'usage', 'idy', 'youvoi', 'idy' UNION ALL
	SELECT 'vessause', 'idtt', 'TassepeTcheubi', 'idtt' UNION ALL
	SELECT 'youvoi', 'idm', 'mefu', 'idm' UNION ALL
	SELECT 'zomblou', 'idzz', 'zedouZicmus', 'idzz'
)
INSERT INTO link(idbox_from, idfield_from, idbox_to, idfield_to)
SELECT from_box.idbox, from_field.idfield, to_box.idbox, to_field.idfield
FROM cte
JOIN box from_box ON from_box.title = fromBoxTitle
JOIN field from_field ON from_field.idbox = from_box.idbox AND from_field.name=fromFieldName
JOIN box to_box ON to_box.title = toBoxTitle
JOIN field to_field ON to_field.idbox = to_box.idbox AND to_field.name=toFieldName;

`
