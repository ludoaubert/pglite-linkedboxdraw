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
  UNIQUE(idbox, name)
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
  FOREIGN KEY (idfield_from) REFERENCES field(idfield),
  FOREIGN KEY (idbox_to) REFERENCES box(idbox),
  FOREIGN KEY (idfield_to) REFERENCES field(idfield),
  UNIQUE(idbox_from, idbox_to)
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
('CUT_LINK_COLOR','lime'),('CUT_LINK_COLOR','fuchsia'),('CUT_LINK_COLOR','teal'),('CUT_LINK_COLOR','aqua'),('CUT_LINK_COLOR','aquamarine'),('CUT_LINK_COLOR','coral'),('CUT_LINK_COLOR','cornflowerblue'),('CUT_LINK_COLOR','darkgray'),('CUT_LINK_COLOR','darkkhaki'),
('RELATION_CATEGORY','TR2'),
('RELATION_CARDINALITY', '1,1'),('RELATION_CARDINALITY', '1,n'),('RELATION_CARDINALITY', 'n,n');

CREATE TABLE IF NOT EXISTS message_tag(
  idmessage SERIAL PRIMARY KEY,
  message TEXT
);

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

CREATE TYPE source_table AS ENUM ('tag', 'message_tag');
CREATE TYPE target_table AS ENUM ('box', 'field', 'value', 'link');
  
CREATE TABLE IF NOT EXISTS graph(
  idgraph SERIAL PRIMARY KEY,
  from_table source_table,
  from_key INTEGER,
  to_table target_table,
  to_key INTEGER,
  UNIQUE(from_table, from_key, to_table, to_key),
  CHECK(is_table_primary_key(from_table::text, from_key)),
  CHECK(is_table_primary_key(to_table::text, to_key))
);

-- INSERT INTO graph(from_table, from_key, to_table, to_key) VALUES('message_tag',1,'box',1);
-- INSERT INTO graph(from_table, from_key, to_table, to_key) VALUES('tag',1,'field',1);

CREATE TABLE IF NOT EXISTS frame(
  idframe SERIAL PRIMARY KEY,
  width INTEGER,
  height INTEGER,
  iddiagram INTEGER,
  UNIQUE(iddiagram),
  FOREIGN KEY (iddiagram) REFERENCES diagram(iddiagram) 
);

CREATE TABLE rectangle(
  idrectangle SERIAL PRIMARY KEY,
  width INTEGER,
  height INTEGER,
  idbox INTEGER,
  UNIQUE(idbox),
  FOREIGN KEY (idbox) REFERENCES box(idbox)
);

CREATE TABLE translation(
  idtranslation SERIAL PRIMARY KEY,
  context INTEGER DEFAULT 1,
  idrectangle INTEGER,
  UNIQUE(idrectangle),
  UNIQUE(idtranslation, context),
  x INTEGER,
  y INTEGER,
  FOREIGN KEY (idrectangle) REFERENCES rectangle(idrectangle)
);

CREATE TABLE polyline(
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
