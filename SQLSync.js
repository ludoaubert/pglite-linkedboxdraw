WITH cte AS (
	SELECT
	    tc.table_schema, 
	    tc.constraint_name, 
	    tc.table_name, 
	    kcu.column_name, 
	    ccu.table_schema AS foreign_table_schema,
	    ccu.table_name AS foreign_table_name,
	    ccu.column_name AS foreign_column_name 
	FROM information_schema.table_constraints AS tc 
	JOIN information_schema.key_column_usage AS kcu
	    ON tc.constraint_name = kcu.constraint_name
	    AND tc.table_schema = kcu.table_schema
	JOIN information_schema.constraint_column_usage AS ccu
	    ON ccu.constraint_name = tc.constraint_name
	WHERE tc.constraint_type = 'FOREIGN KEY'
	    AND tc.table_schema='myschema'
), cte2 AS (
	SELECT a.table_name, a.table_name AS chemin, 1 as niveau
	FROM cte a
	LEFT JOIN cte b ON b.foreign_table_name=a.table_name
	WHERE b.foreign_table_name IS NULL
	
	UNION ALL
	
	SELECT b.foreign_table_name AS table_name, 
		b.foreign_table_name || '.' || cte2.chemin AS chemin,
		cte2.niveau + 1 AS niveau
	FROM cte2 a
	JOIN cte b ON b.foreign_table_name=a.table_name
), cte3 AS (
	SELECT table_name, MIN(niveau) AS niveau
	FROM cte2
	GROUP BY table_name
)
SELECT table_name, ROW_NUMBER() OVER()
FROM cte3
ORDER BY niveau;


WITH cte(table_name, json_table) AS (
	SELECT 'diagram', json_agg(row_to_json(diagram))::json FROM diagram
	UNION ALL
	SELECT 'box', json_agg(row_to_json(box))::json FROM box
	UNION ALL
	SELECT 'field', json_agg(row_to_json(field))::json FROM field
	UNION ALL
	SELECT 'value', json_agg(row_to_json(value))::json FROM value
	UNION ALL
	SELECT 'link', json_agg(row_to_json(link))::json FROM link
	UNION ALL
	SELECT 'tag', json_agg(row_to_json(tag))::json FROM tag
  	UNION ALL
	SELECT 'message_tag', json_agg(row_to_json(message_tag))::json FROM message_tag
	UNION ALL
	SELECT 'graph', json_agg(row_to_json(graph))::json FROM graph
	UNION ALL
	SELECT 'rectangle', json_agg(row_to_json(rectangle))::json FROM rectangle
	UNION ALL
	SELECT 'translation', json_agg(row_to_json(translation))::json FROM translation
	UNION ALL
	SELECT 'polyline', json_agg(row_to_json(polyline))::json FROM polyline
)
SELECT json_agg(json_build_object('table_name',table_name,'json_table',COALESCE(json_table,'[]'::json))::text)
FROM cte;

