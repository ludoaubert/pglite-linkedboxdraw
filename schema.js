export {schema};

const schema=`

CREATE TABLE IF NOT EXISTS diagram(
  iddiagram SERIAL PRIMARY KEY,
  title VARCHAR(128),
  UNIQUE(title)
);

CREATE TABLE IF NOT EXISTS box(
  idbox SERIAL PRIMARY KEY,
  title VARCHAR(128),
  iddiagram INTEGER,
  FOREIGN KEY (iddiagram) REFERENCES diagram(iddiagram),
  UNIQUE(iddiagram, title)
);

CREATE TABLE IF NOT EXISTS field(
  idfield SERIAL PRIMARY KEY,
  name VARCHAR(128),
  idbox INTEGER,
  FOREIGN KEY (idbox) REFERENCES box(idbox),
  UNIQUE(idbox, name),
  UNIQUE(idbox, idfield)
);

CREATE TABLE IF NOT EXISTS value(
  idvalue SERIAL PRIMARY KEY,
  data VARCHAR(128),
  idfield INTEGER,
  FOREIGN KEY (idfield) REFERENCES field(idfield),
  UNIQUE(idfield, data)
);

CREATE TABLE IF NOT EXISTS link(
  idlink SERIAL PRIMARY KEY,
  idbox_from INTEGER,
  idfield_from INTEGER,
  idbox_to INTEGER,
  idfield_to INTEGER,
  FOREIGN KEY (idbox_from) REFERENCES box(idbox),
  FOREIGN KEY (idbox_from, idfield_from) REFERENCES field(idbox, idfield),
  FOREIGN KEY (idbox_to) REFERENCES box(idbox),
  FOREIGN KEY (idbox_to, idfield_to) REFERENCES field(idbox, idfield),
  UNIQUE(idbox_from, idfield_from, idbox_to, idfield_to)
);

CREATE TABLE IF NOT EXISTS tag(
  idtag SERIAL PRIMARY KEY,
  type_code VARCHAR(128),
  code VARCHAR(128),
  UNIQUE(type_code,code)
);

INSERT INTO tag(type_code, code) VALUES
('KEY','PRIMARY_KEY'),('KEY','FOREIGN_KEY'),
('CONSTRAINT','UNIQUE'),
('COLOR','yellow'),('COLOR','pink'),('COLOR','hotpink'),('COLOR','palegreen'),('COLOR','red'),('COLOR','orange'),('COLOR','skyblue'),('COLOR','olive'),('COLOR','grey'),('COLOR','darkviolet'),
('LINK_COLOR','lime'),('LINK_COLOR','fuchsia'),('LINK_COLOR','teal'),('LINK_COLOR','aqua'),('LINK_COLOR','aquamarine'),('LINK_COLOR','coral'),('LINK_COLOR','cornflowerblue'),('LINK_COLOR','darkgray'),('LINK_COLOR','darkkhaki'),
('LINK_COLOR','indianred'),('LINK_COLOR','indigo'),('LINK_COLOR','ivory'),('LINK_COLOR','khaki'),('LINK_COLOR','lavender'),('LINK_COLOR','lavenderblush'),('LINK_COLOR','lawngreen'),('LINK_COLOR','lemonchiffon'),
('LINK_COLOR','lightblue'),('LINK_COLOR','lightcoral'),('LINK_COLOR','lightcyan'),('LINK_COLOR','lightgoldenrodyellow'),('LINK_COLOR','lightgray'),('LINK_COLOR','lightgreen'),('LINK_COLOR','lightgrey'),('LINK_COLOR','lightpink'),('LINK_COLOR','lightsalmon'),('LINK_COLOR','lightseagreen'),('LINK_COLOR','lightskyblue'),('LINK_COLOR','lightslategray'),
('RELATION_CATEGORY','TR2'),
('RELATION_CARDINALITY', '1,1'),('RELATION_CARDINALITY', '1,n'),('RELATION_CARDINALITY', 'n,n');

CREATE TABLE IF NOT EXISTS message_tag(
  idmessage SERIAL PRIMARY KEY,
  message TEXT
);

/*
CREATE FUNCTION is_table_primary_key(_table_name TEXT, _id INTEGER) RETURNS BOOLEAN AS
BEGIN
  RETURN
    EXISTS(SELECT * FROM tag WHERE _table_name='tag' AND _id=idtag) OR
    EXISTS(SELECT * FROM message_tag WHERE _table_name='message_tag' AND _id=idmessage) OR
    EXISTS(SELECT * FROM box WHERE _table_name='box' AND _id=idbox) OR
    EXISTS(SELECT * FROM field WHERE _table_name='field' AND _id=idfield) OR
    EXISTS(SELECT * FROM value WHERE _table_name='value' AND _id=idvalue) OR
    EXISTS(SELECT * FROM link WHERE _table_name='link' AND _id=idlink);
END
*/

CREATE TYPE source_table AS ENUM ('tag', 'message_tag');
CREATE TYPE target_table AS ENUM ('box', 'field', 'value', 'link');
  
CREATE TABLE IF NOT EXISTS graph(
  idgraph SERIAL PRIMARY KEY,
  from_table source_table,
  from_key INTEGER,
  to_table target_table,
  to_key INTEGER,
  UNIQUE(from_table, from_key, to_table, to_key)--,
/*
  CHECK(is_table_primary_key(from_table::text, from_key)),
  CHECK(is_table_primary_key(to_table::text, to_key))
*/
);

-- INSERT INTO graph(from_table, from_key, to_table, to_key) VALUES('message_tag',1,'box',1);
-- INSERT INTO graph(from_table, from_key, to_table, to_key) VALUES('tag',1,'field',1);

CREATE TABLE IF NOT EXISTS rectangle(
  idrectangle SERIAL PRIMARY KEY,
  width INTEGER,
  height INTEGER,
  idbox INTEGER,
  UNIQUE(idbox),
  FOREIGN KEY (idbox) REFERENCES box(idbox)
);

CREATE TABLE IF NOT EXISTS translation(
  idtranslation SERIAL PRIMARY KEY,
  context INTEGER DEFAULT 1,
  idrectangle INTEGER,
  UNIQUE(idrectangle),
  UNIQUE(idtranslation, context),
  x INTEGER,
  y INTEGER,
  FOREIGN KEY (idrectangle) REFERENCES rectangle(idrectangle)
);

CREATE TABLE IF NOT EXISTS polyline(
  idpolyline SERIAL PRIMARY KEY,
  context INTEGER DEFAULT 1,
  idlink INTEGER,
  idtranslation_from INTEGER,
  idtranslation_to INTEGER,
  points JSON,
  FOREIGN KEY (idlink) REFERENCES link(idlink),
  UNIQUE(idlink),
  FOREIGN KEY (idtranslation_from, context) REFERENCES translation(idtranslation, context),
  FOREIGN KEY (idtranslation_to, context) REFERENCES translation(idtranslation, context),
  UNIQUE(idtranslation_from, idtranslation_to)
);
`
