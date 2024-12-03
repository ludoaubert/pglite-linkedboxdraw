export {delete_from_tables};

const delete_from_tables=`
DELETE FROM polyline;
DELETE FROM translation;
DELETE FROM rectangle;
DELETE FROM graph;
DELETE FROM message_tag;
DELETE FROM tag;
DELETE FROM link;
DELETE FROM value;
DELETE FROM field;
DELETE FROM box;
DELETE FROM diagram;
`
