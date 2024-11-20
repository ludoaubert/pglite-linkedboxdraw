import {mydata} from "./table_edit.js";
export {compute_box_rectangle};


const MONOSPACE_FONT_PIXEL_WIDTH=7;
const CHAR_RECT_HEIGHT=16;	// in reality 14,8 + 1 + 1 (top and bottom padding) = 16,8
const RECTANGLE_BOTTOM_CAP=200;

function compute_box_rectangle(box, db, id)
{
	const ret = await db.query(`
 		WITH cte(width) AS (
   			SELECT 2*4 + LENGTH(title) * ${MONOSPACE_FONT_PIXEL_WIDTH} FROM box WHERE idbox = ${id}
    			UNION ALL
       			SELECT LENGTH(name) * ${MONOSPACE_FONT_PIXEL_WIDTH} FROM field WHERE idbox = ${id}
		)
  		SELECT MAX(width)
    		FROM cte
 	`);
	const max_width = ret.rows[0];
/*
	const {title,id,fields} = box;

	const widths = [
		2*4 + title.length * MONOSPACE_FONT_PIXEL_WIDTH,
		fields.map(field => field.length * MONOSPACE_FONT_PIXEL_WIDTH),
	].flat();
	
	const max_width = Math.max(...widths);
*/	
	const heights = [
		8 + CHAR_RECT_HEIGHT,
		fields.filter(field => field?.type == undefined)
				.map(field => CHAR_RECT_HEIGHT),
		fields.filter(field => field?.type == "image")
				.map(field => field.name)
				.map(name => mydata.pictures.find(pic => pic.name==name))
				.map(pic => pic.height)
	].flat()

	const height = heights.reduce((a,b) => a + b, 0);

	const rec = {
		left:0,
		right:max_width,
		top:0,
		bottom:Math.min(height, RECTANGLE_BOTTOM_CAP)
	} ;

	return rec;
}

