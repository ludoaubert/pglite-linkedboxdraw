export {schema};

const schema=`

CREATE TABLE IF NOT EXISTS diagram(
  iddiagram SERIAL PRIMARY KEY,
  uuid_diagram UUID DEFAULT gen_random_uuid(),
  title VARCHAR(128),
  UNIQUE(title),
  UNIQUE(uuid_diagram)
);

CREATE TABLE IF NOT EXISTS box(
  idbox SERIAL PRIMARY KEY,
  uuid_box UUID DEFAULT gen_random_uuid(),
  title VARCHAR(128),
  iddiagram INTEGER DEFAULT 1,
  FOREIGN KEY (iddiagram) REFERENCES diagram(iddiagram),
  UNIQUE(iddiagram, title),
  UNIQUE(uuid_box)
);

CREATE TABLE IF NOT EXISTS field(
  idfield SERIAL PRIMARY KEY,
  iddiagram INTEGER DEFAULT 1,
  uuid_field UUID DEFAULT gen_random_uuid(),
  name VARCHAR(128),
  idbox INTEGER,
  FOREIGN KEY (iddiagram) REFERENCES diagram(iddiagram),
  FOREIGN KEY (idbox) REFERENCES box(idbox),
  UNIQUE(idbox, name),
  UNIQUE(idbox, idfield),
  UNIQUE(uuid_field)
);

CREATE TABLE IF NOT EXISTS value(
  idvalue SERIAL PRIMARY KEY,
  iddiagram INTEGER DEFAULT 1,
  uuid_value UUID DEFAULT gen_random_uuid(),
  data VARCHAR(128),
  idfield INTEGER,
  FOREIGN KEY (iddiagram) REFERENCES diagram(iddiagram),
  FOREIGN KEY (idfield) REFERENCES field(idfield),
  UNIQUE(idfield, data),
  UNIQUE(uuid_value)
);

CREATE TABLE IF NOT EXISTS link(
  idlink SERIAL PRIMARY KEY,
  iddiagram INTEGER DEFAULT 1,
  uuid_link UUID DEFAULT gen_random_uuid(),
  idbox_from INTEGER,
  idfield_from INTEGER,
  idbox_to INTEGER,
  idfield_to INTEGER,
  FOREIGN KEY (iddiagram) REFERENCES diagram(iddiagram),
  FOREIGN KEY (idbox_from) REFERENCES box(idbox),
  FOREIGN KEY (idbox_from, idfield_from) REFERENCES field(idbox, idfield),
  FOREIGN KEY (idbox_to) REFERENCES box(idbox),
  FOREIGN KEY (idbox_to, idfield_to) REFERENCES field(idbox, idfield),
  UNIQUE(idbox_from, idfield_from, idbox_to, idfield_to),
  UNIQUE(uuid_link)
);

CREATE TABLE IF NOT EXISTS tag(
  idtag SERIAL PRIMARY KEY,
  iddiagram INTEGER DEFAULT 1,
  uuid_tag UUID DEFAULT gen_random_uuid(),
  type_code VARCHAR(128),
  code VARCHAR(128),
  UNIQUE(iddiagram, type_code,code),
  FOREIGN KEY (iddiagram) REFERENCES diagram(iddiagram),
  UNIQUE(uuid_tag)
);

CREATE TABLE IF NOT EXISTS message_tag(
  idmessage SERIAL PRIMARY KEY,
  iddiagram INTEGER DEFAULT 1,
  uuid_message UUID DEFAULT gen_random_uuid(),
  message TEXT,
  FOREIGN KEY (iddiagram) REFERENCES diagram(iddiagram),
  UNIQUE(uuid_message)
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
  iddiagram INTEGER DEFAULT 1,
  uuid_graph UUID DEFAULT gen_random_uuid(),
  from_table source_table,
  from_key INTEGER,
  to_table target_table,
  to_key INTEGER,
  FOREIGN KEY (iddiagram) REFERENCES diagram(iddiagram),
  UNIQUE(from_table, from_key, to_table, to_key),
  UNIQUE(uuid_graph)
/*
  CHECK(is_table_primary_key(from_table::text, from_key)),
  CHECK(is_table_primary_key(to_table::text, to_key))
*/
);

-- INSERT INTO graph(from_table, from_key, to_table, to_key) VALUES('message_tag',1,'box',1);
-- INSERT INTO graph(from_table, from_key, to_table, to_key) VALUES('tag',1,'field',1);

CREATE TABLE IF NOT EXISTS rectangle(
  idrectangle SERIAL PRIMARY KEY,
  iddiagram INTEGER DEFAULT 1,
  uuid_rectangle UUID DEFAULT gen_random_uuid(),
  width INTEGER,
  height INTEGER,
  idbox INTEGER,
  UNIQUE(idbox),
  UNIQUE(uuid_rectangle),
  FOREIGN KEY (iddiagram) REFERENCES diagram(iddiagram),
  FOREIGN KEY (idbox) REFERENCES box(idbox)
);

CREATE TABLE IF NOT EXISTS translation(
  idtranslation SERIAL PRIMARY KEY,
  iddiagram INTEGER DEFAULT 1,
  uuid_translation UUID DEFAULT gen_random_uuid(),
  context INTEGER DEFAULT 1,
  idrectangle INTEGER,
  UNIQUE(idrectangle),
  UNIQUE(idtranslation, context),
  UNIQUE(uuid_translation),
  x INTEGER,
  y INTEGER,
  FOREIGN KEY (iddiagram) REFERENCES diagram(iddiagram),
  FOREIGN KEY (idrectangle) REFERENCES rectangle(idrectangle)
);

CREATE TABLE IF NOT EXISTS polyline(
  idpolyline SERIAL PRIMARY KEY,
  iddiagram INTEGER DEFAULT 1,
  uuid_polyline UUID DEFAULT gen_random_uuid(),
  context INTEGER DEFAULT 1,
  idlink INTEGER,
  idtranslation_from INTEGER,
  idtranslation_to INTEGER,
  points JSON,
  FOREIGN KEY (idlink) REFERENCES link(idlink),
  UNIQUE(idlink),
  UNIQUE(uuid_polyline);
  FOREIGN KEY (iddiagram) REFERENCES diagram(iddiagram),
  FOREIGN KEY (idtranslation_from, context) REFERENCES translation(idtranslation, context),
  FOREIGN KEY (idtranslation_to, context) REFERENCES translation(idtranslation, context),
  UNIQUE(idtranslation_from, idtranslation_to)
);
`
