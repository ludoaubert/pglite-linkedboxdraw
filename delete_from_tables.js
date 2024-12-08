export {delete_from_tables};

const delete_from_tables=`
DELETE FROM polyline;
DELETE FROM translation;
DELETE FROM rectangle;
DELETE FROM graph;
DELETE FROM message_tag;
--DELETE FROM tag;
DELETE FROM link;
DELETE FROM value;
DELETE FROM field;
DELETE FROM box;
DELETE FROM diagram;

ALTER SEQUENCE polyline_idpolyline_seq RESTART WITH 1;
ALTER SEQUENCE translation_idtranslation_seq RESTART WITH 1;
ALTER SEQUENCE rectangle_idrectangle_seq RESTART WITH 1;
ALTER SEQUENCE graph_idgraph_seq RESTART WITH 1;
ALTER SEQUENCE message_tag_idmessage_seq RESTART WITH 1;
--ALTER SEQUENCE tag_idtag_seq RESTART WITH 1;
ALTER SEQUENCE link_idlink_seq RESTART WITH 1;
ALTER SEQUENCE value_idvalue_seq RESTART WITH 1;
ALTER SEQUENCE field_idfield_seq RESTART WITH 1;
ALTER SEQUENCE box_idbox_seq RESTART WITH 1;
ALTER SEQUENCE diagram_iddiagram_seq RESTART WITH 1;
`
