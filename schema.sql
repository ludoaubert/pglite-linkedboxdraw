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
  iddiagram INTEGER,
  idfield INTEGER,
  PRIMARY KEY (iduser, iddiagram, idfield),
  name VARCHAR(128),
  idbox INTEGER,
  FOREIGN KEY (iduser, iddiagram, idbox) REFERENCES box(iduser, iddiagram, idbox),
  UNIQUE(iduser, iddiagram, idbox, name),
  UNIQUE(iduser, iddiagram, idbox, idfield)
);

CREATE TABLE IF NOT EXISTS value(
  iduser INTEGER,
  iddiagram INTEGER,
  idvalue INTEGER,
  PRIMARY KEY (iduser, iddiagram, idvalue),
  data VARCHAR(128),
  idfield INTEGER,
  FOREIGN KEY (iduser, iddiagram, idfield) REFERENCES field(iduser, iddiagram, idfield),
  UNIQUE(iduser, idfield, data)
);

CREATE TABLE IF NOT EXISTS link(
  iduser INTEGER,
  iddiagram INTEGER,
  idlink INTEGER,
  PRIMARY KEY (iduser, iddiagram, idlink),
  idbox_from INTEGER,
  idfield_from INTEGER,
  idbox_to INTEGER,
  idfield_to INTEGER,
  FOREIGN KEY (iduser, iddiagram, idbox_from) REFERENCES box(iduser, iddiagram, idbox),
  FOREIGN KEY (iduser, iddiagram, idbox_from, idfield_from) REFERENCES field(iduser, iddiagram, idbox, idfield),
  FOREIGN KEY (iduser, iddiagram, idbox_to) REFERENCES box(iduser, iddiagram, idbox),
  FOREIGN KEY (iduser, iddiagram, idbox_to, idfield_to) REFERENCES field(iduser, iddiagram, idbox, idfield),
  UNIQUE(iduser, iddiagram, idbox_from, idfield_from, idbox_to, idfield_to)
);

CREATE TABLE IF NOT EXISTS tag(
  iduser INTEGER,
  iddiagram INTEGER,
  idtag INTEGER,
  PRIMARY KEY (iduser, iddiagram, idtag),
  type_code VARCHAR(128),
  code VARCHAR(128),
  UNIQUE(iduser, iddiagram, type_code, code)
);

CREATE TABLE IF NOT EXISTS message_tag(
  iduser INTEGER,
  iddiagram INTEGER,
  idmessage INTEGER,
  PRIMARY KEY (iduser, iddiagram, idmessage),
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
  iddiagram INTEGER,
  idgraph INTEGER,
  PRIMARY KEY (iduser, iddiagram, idgraph),
  from_table source_table,
  from_key INTEGER,
  to_table target_table,
  to_key INTEGER,
  UNIQUE(iduser, iddiagram, from_table, from_key, to_table, to_key)--,
/*
  CHECK(is_table_primary_key(from_table::text, from_key)),
  CHECK(is_table_primary_key(to_table::text, to_key))
*/
);

-- INSERT INTO graph(from_table, from_key, to_table, to_key) VALUES('message_tag',1,'box',1);
-- INSERT INTO graph(from_table, from_key, to_table, to_key) VALUES('tag',1,'field',1);

CREATE TABLE IF NOT EXISTS rectangle(
  iduser INTEGER,
  iddiagram INTEGER,
  idrectangle INTEGER,
  PRIMARY KEY (iduser, iddiagram, idrectangle),
  width INTEGER,
  height INTEGER,
  idbox INTEGER,
  UNIQUE(iduser, iddiagram, idbox),
  FOREIGN KEY (iduser, iddiagram, idbox) REFERENCES box(iduser, iddiagram, idbox)
);

CREATE TABLE IF NOT EXISTS translation(
  iduser INTEGER,
  iddiagram INTEGER,
  idtranslation INTEGER,
  PRIMARY KEY (iduser, iddiagram, idtranslation),
  context INTEGER DEFAULT 1,
  idrectangle INTEGER,
  UNIQUE(iduser, iddiagram, idrectangle),
  UNIQUE(iduser, iddiagram, idtranslation, context),
  x INTEGER,
  y INTEGER,
  FOREIGN KEY (iduser, iddiagram, idrectangle) REFERENCES rectangle(iduser, iddiagram, idrectangle)
);

CREATE TABLE IF NOT EXISTS polyline(
  iduser INTEGER,
  iddiagram INTEGER,
  idpolyline INTEGER,
  PRIMARY KEY (iduser, iddiagram, idpolyline),
  context INTEGER DEFAULT 1,
  idlink INTEGER,
  idtranslation_from INTEGER,
  idtranslation_to INTEGER,
  points JSON,
  FOREIGN KEY (iduser, iddiagram, idlink) REFERENCES link(iduser, iddiagram, idlink),
  UNIQUE(iduser, iddiagram, idlink),
  FOREIGN KEY (iduser, iddiagram, idtranslation_from, context) REFERENCES translation(iduser, iddiagram, idtranslation, context),
  FOREIGN KEY (iduser, iddiagram, idtranslation_to, context) REFERENCES translation(iduser, iddiagram, idtranslation, context),
  UNIQUE(iduser, iddiagram, idtranslation_from, idtranslation_to)
);
