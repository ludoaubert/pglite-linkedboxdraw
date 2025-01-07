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
  FOREIGN KEY (iddiagram) REFERENCES diagram(iddiagram) ON DELETE CASCADE,
  UNIQUE(iddiagram, title),
  UNIQUE(uuid_box)
);

CREATE INDEX box_iddiagram ON box(iddiagram) INCLUDE(idbox, uuid_box, title);

CREATE TABLE IF NOT EXISTS field(
  idfield SERIAL PRIMARY KEY,
  iddiagram INTEGER DEFAULT 1,
  uuid_field UUID DEFAULT gen_random_uuid(),
  name VARCHAR(128),
  idbox INTEGER,
  FOREIGN KEY (iddiagram) REFERENCES diagram(iddiagram) ON DELETE CASCADE,
  FOREIGN KEY (idbox) REFERENCES box(idbox) ON DELETE CASCADE,
  UNIQUE(idbox, name),
  UNIQUE(idbox, idfield),
  UNIQUE(uuid_field)
);

CREATE INDEX field_iddiagram ON field(iddiagram) INCLUDE(idfield, uuid_field, name, idbox);
CREATE INDEX field_idbox ON field(idbox);

CREATE TABLE IF NOT EXISTS value(
  idvalue SERIAL PRIMARY KEY,
  iddiagram INTEGER DEFAULT 1,
  uuid_value UUID DEFAULT gen_random_uuid(),
  data VARCHAR(128),
  idfield INTEGER,
  FOREIGN KEY (iddiagram) REFERENCES diagram(iddiagram) ON DELETE CASCADE,
  FOREIGN KEY (idfield) REFERENCES field(idfield),
  UNIQUE(idfield, data),
  UNIQUE(uuid_value)
);

CREATE INDEX value_iddiagram ON value(iddiagram) INCLUDE(idvalue, uuid_value, data, idfield);
CREATE INDEX value_idfield ON value(idfield);

CREATE TABLE IF NOT EXISTS link(
  idlink SERIAL PRIMARY KEY,
  iddiagram INTEGER DEFAULT 1,
  uuid_link UUID DEFAULT gen_random_uuid(),
  idbox_from INTEGER,
  idfield_from INTEGER,
  idbox_to INTEGER,
  idfield_to INTEGER,
  FOREIGN KEY (iddiagram) REFERENCES diagram(iddiagram) ON DELETE CASCADE,
  FOREIGN KEY (idbox_from) REFERENCES box(idbox) ON DELETE CASCADE,
  FOREIGN KEY (idbox_from, idfield_from) REFERENCES field(idbox, idfield) ON DELETE CASCADE,
  FOREIGN KEY (idbox_to) REFERENCES box(idbox) ON DELETE CASCADE,
  FOREIGN KEY (idbox_to, idfield_to) REFERENCES field(idbox, idfield) ON DELETE CASCADE,
  UNIQUE(idbox_from, idfield_from, idbox_to, idfield_to),
  UNIQUE(uuid_link)
);

CREATE INDEX link_iddiagram ON link(iddiagram) INCLUDE(idlink, uuid_link, idbox_from, idfield_from, idbox_to, idfield_to);
CREATE INDEX link_idbox_from ON link(idbox_from);
CREATE INDEX link_idfield_from ON link(idfield_from);
CREATE INDEX link_idbox_to ON link(idbox_to);
CREATE INDEX link_idfield_to ON link(idfield_to);

CREATE TABLE IF NOT EXISTS tag(
  idtag SERIAL PRIMARY KEY,
  iddiagram INTEGER DEFAULT 1,
  uuid_tag UUID DEFAULT gen_random_uuid(),
  type_code VARCHAR(128),
  code VARCHAR(128),
  UNIQUE(iddiagram, type_code,code),
  FOREIGN KEY (iddiagram) REFERENCES diagram(iddiagram) ON DELETE CASCADE,
  UNIQUE(uuid_tag)
);

CREATE INDEX tag_iddiagram ON tag(iddiagram) INCLUDE(idtag, uuid_tag, type_code, code);

CREATE TABLE IF NOT EXISTS message_tag(
  idmessage SERIAL PRIMARY KEY,
  iddiagram INTEGER DEFAULT 1,
  uuid_message UUID DEFAULT gen_random_uuid(),
  message TEXT,
  FOREIGN KEY (iddiagram) REFERENCES diagram(iddiagram) ON DELETE CASCADE,
  UNIQUE(uuid_message)
);

CREATE INDEX message_tag_iddiagram ON message_tag(iddiagram) INCLUDE(idmessage, uuid_message, message);

CREATE TYPE source_table AS ENUM ('tag', 'message_tag');
CREATE TYPE target_table AS ENUM ('box', 'field', 'value', 'link');


CREATE FUNCTION check_source_pk(table_name source_table, id INTEGER) RETURNS BOOLEAN AS
$$
BEGIN
  CASE table_name
    WHEN 'tag'
      THEN RETURN EXISTS(SELECT * FROM tag WHERE id=idtag);
    WHEN 'message_tag'
      THEN RETURN EXISTS(SELECT * FROM message_tag WHERE id=idmessage);
  END CASE;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION check_target_pk(table_name target_table, id INTEGER) RETURNS BOOLEAN AS
$$
BEGIN
  CASE table_name
    WHEN 'box'
      THEN RETURN EXISTS(SELECT * FROM box WHERE id=idbox);
    WHEN 'field'
      THEN RETURN EXISTS(SELECT * FROM field WHERE id=idfield);
    WHEN 'value'
      THEN RETURN EXISTS(SELECT * FROM value WHERE id=idvalue);
    WHEN 'link'
      THEN RETURN EXISTS(SELECT * FROM link WHERE id=idlink);
  END CASE;
END;
$$ LANGUAGE plpgsql;


CREATE TABLE IF NOT EXISTS graph(
  idgraph SERIAL PRIMARY KEY,
  iddiagram INTEGER DEFAULT 1,
  uuid_graph UUID DEFAULT gen_random_uuid(),
  from_table source_table,
  from_key INTEGER,
  to_table target_table,
  to_key INTEGER,
  CHECK(check_source_pk(from_table, from_key)),
  CHECK(check_target_pk(to_table, to_key)),
  FOREIGN KEY (iddiagram) REFERENCES diagram(iddiagram) ON DELETE CASCADE,
  UNIQUE(from_table, from_key, to_table, to_key),
  UNIQUE(uuid_graph)
);

CREATE INDEX graph_iddiagram ON graph(iddiagram) INCLUDE(idgraph, uuid_graph, from_table, from_key, to_table, to_key); 
CREATE INDEX graph_source_idx ON graph (from_table, from_key);
CREATE INDEX graph_target_idx ON graph (to_table, to_key);

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
  FOREIGN KEY (iddiagram) REFERENCES diagram(iddiagram) ON DELETE CASCADE,
  FOREIGN KEY (idbox) REFERENCES box(idbox) ON DELETE CASCADE
);

CREATE INDEX rectangle_idbox ON rectangle(idbox);
CREATE INDEX rectangle_iddiagram ON rectangle(iddiagram) INCLUDE(idrectangle, uuid_rectangle, width, height, idbox);

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
  FOREIGN KEY (iddiagram) REFERENCES diagram(iddiagram) ON DELETE CASCADE,
  FOREIGN KEY (idrectangle) REFERENCES rectangle(idrectangle) ON DELETE CASCADE
);

CREATE INDEX translation_idrectangle ON translation(idrectangle);
CREATE INDEX translation_iddiagram ON translation(iddiagram) INCLUDE(idtranslation, uuid_translation, context, idrectangle);

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
  UNIQUE(uuid_polyline),
  FOREIGN KEY (iddiagram) REFERENCES diagram(iddiagram) ON DELETE CASCADE,
  FOREIGN KEY (idtranslation_from, context) REFERENCES translation(idtranslation, context),
  FOREIGN KEY (idtranslation_to, context) REFERENCES translation(idtranslation, context),
  UNIQUE(idtranslation_from, idtranslation_to)
);

CREATE FUNCTION box_trg() RETURNS trigger AS $box_trg$
    BEGIN
        DELETE FROM graph g WHERE g.to_table='box' AND g.to_key=OLD.idbox AND g.iddiagram=OLD.iddiagram;
        RETURN OLD;
    END;
$box_trg$ LANGUAGE plpgsql;

CREATE TRIGGER box_trg AFTER DELETE ON box
    FOR EACH ROW EXECUTE FUNCTION box_trg();

CREATE FUNCTION field_trg() RETURNS trigger AS $field_trg$
    BEGIN
        DELETE FROM graph g WHERE g.to_table='field' AND g.to_key=OLD.idfield AND g.iddiagram=OLD.iddiagram;
        RETURN OLD;
    END;
$field_trg$ LANGUAGE plpgsql;

CREATE TRIGGER field_trg AFTER DELETE ON field
    FOR EACH ROW EXECUTE FUNCTION field_trg();

CREATE FUNCTION value_trg() RETURNS trigger AS $value_trg$
    BEGIN
        DELETE FROM graph g WHERE g.to_table='value' AND g.to_key=OLD.idvalue AND g.iddiagram=OLD.iddiagram;
        RETURN OLD;
    END;
$value_trg$ LANGUAGE plpgsql;

CREATE TRIGGER value_trg AFTER DELETE ON value
    FOR EACH ROW EXECUTE FUNCTION value_trg();

CREATE FUNCTION link_trg() RETURNS trigger AS $link_trg$
    BEGIN
        DELETE FROM graph g WHERE g.to_table='link' AND g.to_key=OLD.idlink AND g.iddiagram=OLD.iddiagram;
        RETURN OLD;
    END;
$link_trg$ LANGUAGE plpgsql;

CREATE TRIGGER link_trg AFTER DELETE ON link
    FOR EACH ROW EXECUTE FUNCTION link_trg();
`
