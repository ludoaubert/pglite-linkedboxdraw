CREATE TABLE IF NOT EXISTS utilisateur(
  iduser SERIAL PRIMARY KEY,
  login VARCHAR(128),
  password VARCHAR(128),
  UNIQUE(login)
);

CREATE TABLE IF NOT EXISTS diagram(
  iduser INTEGER,
  iddiagram INTEGER,
  PRIMARY KEY (iduser, iddiagram),
  title VARCHAR(128),
  UNIQUE(iduser, title)
);

CREATE TABLE IF NOT EXISTS box(
  iduser INTEGER,
  idbox INTEGER,
  PRIMARY KEY (iduser, idbox),
  title VARCHAR(128),
  iddiagram INTEGER,
  FOREIGN KEY (iduser, iddiagram) REFERENCES diagram(iduser, iddiagram),
  UNIQUE(iduser, iddiagram, title)
);

CREATE TABLE IF NOT EXISTS field(
  iduser INTEGER,
  idfield INTEGER,
  PRIMARY KEY (iduser, idfield),
  name VARCHAR(128),
  idbox INTEGER,
  FOREIGN KEY (iduser, idbox) REFERENCES box(iduser, idbox),
  UNIQUE(iduser, idbox, name),
  UNIQUE(iduser, idbox, idfield)
);

CREATE TABLE IF NOT EXISTS value(
  iduser INTEGER,
  idvalue INTEGER,
  PRIMARY KEY (iduser, idvalue),
  data VARCHAR(128),
  idfield INTEGER,
  FOREIGN KEY (iduser, idfield) REFERENCES field(iduser, idfield),
  UNIQUE(iduser, idfield, data)
);

CREATE TABLE IF NOT EXISTS link(
  iduser INTEGER,
  idlink INTEGER,
  PRIMARY KEY (iduser, idlink),
  idbox_from INTEGER,
  idfield_from INTEGER,
  idbox_to INTEGER,
  idfield_to INTEGER,
  FOREIGN KEY (iduser, idbox_from) REFERENCES box(iduser, idbox),
  FOREIGN KEY (iduser, idbox_from, idfield_from) REFERENCES field(iduser, idbox, idfield),
  FOREIGN KEY (iduser, idbox_to) REFERENCES box(iduser, idbox),
  FOREIGN KEY (iduser, idbox_to, idfield_to) REFERENCES field(iduser, idbox, idfield),
  UNIQUE(iduser, idbox_from, idfield_from, idbox_to, idfield_to)
);

CREATE TABLE IF NOT EXISTS tag(
  iduser INTEGER,
  idtag INTEGER,
  PRIMARY KEY (iduser, idtag),
  type_code VARCHAR(128),
  code VARCHAR(128),
  UNIQUE(iduser, type_code, code)
);

CREATE TABLE IF NOT EXISTS message_tag(
  iduser INTEGER,
  idmessage INTEGER,
  PRIMARY KEY (iduser, idmessage),
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
  iduser INTEGER,
  idgraph INTEGER,
  PRIMARY KEY (iduser, idgraph),
  from_table source_table,
  from_key INTEGER,
  to_table target_table,
  to_key INTEGER,
  UNIQUE(iduser, from_table, from_key, to_table, to_key)--,
/*
  CHECK(is_table_primary_key(from_table::text, from_key)),
  CHECK(is_table_primary_key(to_table::text, to_key))
*/
);

-- INSERT INTO graph(from_table, from_key, to_table, to_key) VALUES('message_tag',1,'box',1);
-- INSERT INTO graph(from_table, from_key, to_table, to_key) VALUES('tag',1,'field',1);

CREATE TABLE IF NOT EXISTS rectangle(
  iduser INTEGER,
  idrectangle INTEGER,
  PRIMARY KEY (iduser, idrectangle),
  width INTEGER,
  height INTEGER,
  idbox INTEGER,
  UNIQUE(iduser, idbox),
  FOREIGN KEY (iduser, idbox) REFERENCES box(iduser, idbox)
);

CREATE TABLE IF NOT EXISTS translation(
  iduser INTEGER,
  idtranslation INTEGER,
  PRIMARY KEY (iduser, idtranslation),
  context INTEGER DEFAULT 1,
  idrectangle INTEGER,
  UNIQUE(iduser, idrectangle),
  UNIQUE(iduser, idtranslation, context),
  x INTEGER,
  y INTEGER,
  FOREIGN KEY (iduser, idrectangle) REFERENCES rectangle(iduser, idrectangle)
);

CREATE TABLE IF NOT EXISTS polyline(
  iduser INTEGER,
  idpolyline INTEGER,
  PRIMARY KEY (iduser, idpolyline),
  context INTEGER DEFAULT 1,
  idlink INTEGER,
  idtranslation_from INTEGER,
  idtranslation_to INTEGER,
  points JSON,
  FOREIGN KEY (iduser, idlink) REFERENCES link(iduser, idlink),
  UNIQUE(iduser, idlink),
  FOREIGN KEY (iduser, idtranslation_from, context) REFERENCES translation(iduser, idtranslation, context),
  FOREIGN KEY (iduser, idtranslation_to, context) REFERENCES translation(iduser, idtranslation, context),
  UNIQUE(iduser, idtranslation_from, idtranslation_to)
);
