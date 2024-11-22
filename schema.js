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
  data TEXT,
  idfield INTEGER,
  FOREIGN KEY (idfield) REFERENCES field(idfield),
  UNIQUE(idfield, value)
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
('RELATION_CATEGORY','TR2');

CREATE TABLE IF NOT EXISTS message_tag(
  idmessage SERIAL PRIMARY KEY,
  message TEXT
);

CREATE TYPE source_table AS ENUM ('tag', 'message_tag');
CREATE TYPE target_table AS ENUM ('box', 'field', 'value', 'link');
  
CREATE TABLE IF NOT EXISTS graph(
  from_table source_table,
  from_key INTEGER,
  to_table target_table,
  to_key INTEGER,
  UNIQUE(from_table, from_key, to_table, to_key)
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
