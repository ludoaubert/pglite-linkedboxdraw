/* diagram_layout.cpp
*
* Copyright (c) 2005-2025 Ludovic Aubert. ALL RIGHTS RESERVED.
* ludo.aubert@gmail.com
* This file should not be transmitted nor published.
*
*/
#include "MyRect.h"
#include "MPD_Arc.h"
#include "compact_rectangles.h"
#include "compact_frame.h"
#include "binpack.h"
#include "optimize_rectangle_positions.h"
#include "index_from.h"
#include "minimum_cut.h"
#include <vector>
#include <stack>
#include <algorithm>
#include <ranges>
#include <assert.h>
using namespace std ;
using namespace std::ranges;


bool stair_steps(vector<MyRect> &rectangles, MyRect& rr, const vector<vector<MPD_Arc> > &adjacency_list)
{
	int n = rectangles.size() ;

	vector<vector<MyRect*> > unordered_adjacency_list(n) ;
	for (const auto& [i, j] : adjacency_list | views::join)
	{
		if (i == j)
			continue ;
		unordered_adjacency_list[i].push_back(&rectangles[j]) ;
		unordered_adjacency_list[j].push_back(&rectangles[i]) ;
	}
//ORDER each adjacency list BY rectangle width DESC. This is to make sure that lower steps of the stairway are larger.
	for (vector<MyRect*>& adj : unordered_adjacency_list)
		ranges::sort(adj, ranges::greater(), [&](MyRect* r){return width(*r);}) ;

	for (MyRect& r : rectangles)
		r.selected = false ;
	rr.selected = true ;

	stack<MyRect*> pending_stack ;
	pending_stack.push(&rr) ;


	struct NormalDirection {Direction direction;	Sens sens;	} ;
	const NormalDirection normal4[4] = {
		{EAST_WEST, INCREASE},
		{NORTH_SOUTH, DECREASE},
		{EAST_WEST, DECREASE},
		{NORTH_SOUTH, INCREASE}
	} ;


	while (!pending_stack.empty())
	{
		MyRect *rr = pending_stack.top() ;
		pending_stack.pop() ;

		const NormalDirection *normal = &normal4[0] ;
		MyRect *prec = 0 ;
		for (MyRect* r : unordered_adjacency_list[rr->i])
		{
			if (r->selected)
				continue ;

			pending_stack.push(r) ;

			translate(*r, {rr->m_left - r->m_left, rr->m_top - r->m_top}) ;

			const NormalDirection * next_normal = normal+1 == normal4+4 ? normal4 : normal+1 ;

			if (prec == 0)
			{
				MyPoint translation ;
				value(translation, normal->direction) = value(*rr, normal->direction, normal->sens) -
															value(*r, normal->direction, ::reverse(normal->sens)) ;
				value(translation, transpose(normal->direction)) = value(*rr, transpose(normal->direction), normal->sens) -
															value(*r, transpose(normal->direction), normal->sens) ;
				translate(*r, translation) ;
			}
			else if (value(*rr, next_normal->direction, next_normal->sens)*next_normal->sens >
				value(*prec, next_normal->direction, next_normal->sens)*next_normal->sens)
			{
			//there is room for another step
				MyPoint translation ;
				value(translation, normal->direction) = value(*prec, normal->direction, ::reverse(normal->sens)) -
															value(*r, normal->direction, ::reverse(normal->sens)) ;
				value(translation, next_normal->direction) = value(*prec, next_normal->direction, next_normal->sens) -
															value(*r, next_normal->direction, ::reverse(next_normal->sens)) ;
				translate(*r, translation) ;
			}
			else
			{
			//no more room for another step. start using the next side
				MyPoint translation ;
			//use the yet to be replaced normal to compute the transaction coordinate in this direction
				value(translation, normal->direction) = value(*rr, normal->direction, normal->sens) -
															value(*r, normal->direction, normal->sens) ;
				normal++ ;
				if (std::distance(normal4, normal) >= 4)
					break ;

				prec = 0 ;
				value(translation, normal->direction) = value(*rr, normal->direction, normal->sens) -
															value(*r, normal->direction, ::reverse(normal->sens)) ;
				translate(*r, translation) ;
			}

			int index = index_from_if(rectangles, [&](const MyRect& rec){return rec.i!=r->i && rec.selected && intersect_strict(rec, *r) ;}) ;

			if (index == -1)
			{
				r->selected = true ;
				prec = r ;
			}

			if (index != -1 && prec==0)
			{

		//rr is not the first one. so some space has already been reserved. We try the start position for every normal.
				normal = normal4 - 1 ;
				while (normal+1 < normal4+4 &&
					index_from_if(rectangles, [&](const MyRect& rec){return rec.i!=r->i && rec.selected && intersect_strict(rec, *r) ;}) != -1)
				{
					translate(*r, {rr->m_left - r->m_left, rr->m_top - r->m_top}) ;
			// same code as 'no more room for another step. start using the next side'
					MyPoint translation ;
				//use the yet to be replaced normal to compute the translation coordinate in this direction
					const NormalDirection *normal_ = normal == normal4 - 1 ? normal + 4 : normal ;
					value(translation, normal_->direction) = value(*rr, normal_->direction, normal_->sens) -
																value(*r, normal_->direction, normal_->sens) ;
					normal++ ;
					value(translation, normal->direction) = value(*rr, normal->direction, normal->sens) -
																value(*r, normal->direction, ::reverse(normal->sens)) ;
					translate(*r, translation) ;

					int index = index_from_if(rectangles, [&](const MyRect& rec){return rec.i!=r->i && rec.selected && intersect_strict(rec, *r) ;}) ;

					if (index != -1)
					{
						MyRect *prec = &rectangles[index] ;
				//now try to use the hit rectangle as predecessor along this direction. So we reuse the code from 'case we have a pred'

						translate(*r, {rr->m_left - r->m_left, rr->m_top - r->m_top}) ;

						const NormalDirection * next_normal = normal+1 == normal4+4 ? normal4 : normal+1 ;

						if (value(*rr, next_normal->direction, next_normal->sens)*next_normal->sens >
								value(*prec, next_normal->direction, next_normal->sens)*next_normal->sens)
						{
					//there is room for another step
							MyPoint translation ;
							value(translation, normal->direction) = value(*prec, normal->direction, ::reverse(normal->sens)) -
																		value(*r, normal->direction, ::reverse(normal->sens)) ;
							value(translation, next_normal->direction) = value(*prec, next_normal->direction, next_normal->sens) -
															value(*r, next_normal->direction, ::reverse(next_normal->sens)) ;
							translate(*r, translation) ;
						}
					}
				}/*while (normal+1 < normal4+4 &&
					index_from_if(rectangles, [&](const MyRect& rec){return rec.i!=r->i && rec.selected && intersect_strict(rec, *r) ;}) != -1)*/

				if (index_from_if(rectangles, [&](const MyRect& rec){return rec.i!=r->i && rec.selected && intersect_strict(rec, *r) ;}) == -1)
				{
					r->selected = true ;
					prec = r ;
				}
				else
				{
					return false ;
				}
			}//if (index != -1 && prec==0)

		}//for (MyRect* r : unordered_adjacency_list[rr->i])

	}//while (!pending_stack.empty())

	MyRect frame = compute_frame(rectangles) ;
	for (MyRect &r : rectangles)
	{
		translate(r, {- frame.m_left,- frame.m_top}) ;
	}

	return index_from_if(rectangles, [](const MyRect& r){return r.selected == false;}) == -1 ;
}


bool stair_steps_(vector<MyRect> &rectangles, const vector<vector<MPD_Arc> > &adj_list)
{
	const int n = rectangles.size() ;

	vector<vector<MyRect> > solutions ;

	for (int i=0; i < n; i++)
	{
		printf("i=%d\n", i);
		fflush(stdout);

		vector<MyRect> rectangles_ = rectangles ;

		bool result = stair_steps(rectangles_, rectangles_[i], adj_list) ;

		if (index_from_if(rectangles_,[](const MyRect& r){return r.selected==false;}) == -1)
		{
			solutions.push_back(rectangles_) ;
		}
		else
		{
			int nr = std::count_if(rectangles_.begin(), rectangles_.end(), [](const MyRect& r){return r.selected==false;});
			printf("Line %d. %d are not selected.\n", __LINE__, nr);
		}
	}

	if (solutions.empty())
	{
		printf("Line %d. solutions.empty()\n", __LINE__);
		return false ;
	}

	rectangles = * ranges::min_element(solutions, {}, [](const vector<MyRect>& rects){
		return dim_max(compute_frame(rects));
	}) ;

	MyRect frame = compute_frame(rectangles) ;
	for (MyRect &r : rectangles)
		translate(r, {-frame.m_left, -frame.m_top}) ;
	return true ;
}



//interface for emscripten wasm
extern "C" {

const char* diagram_layout_binpack(int rect_border, const char* srects)
{
	vector<MyRect> rectangles;
	int pos, nn;

	pos = 0;
    	MyRect r{0,0,0,0};
	while (sscanf(srects + pos, "%3hx%3hx%n", &r.m_right, &r.m_bottom, &nn) == 2)
	{
	//use variable 'MyRect.no_sequence' to keep the original position of the box.
	//keep in mind that variable 'MyRect.i' is used internally by some algorithms and cannot be used for that purpose.
		r.no_sequence = r.i = rectangles.size();
		rectangles.push_back(r);
		pos += nn;
	}

	printf("rectangles.size()=%zu\n", rectangles.size());

	for (MyRect& r : rectangles)
	{
		r.m_right += 2*rect_border;
		r.m_bottom += 2*rect_border;
	}

	int w, h;
	binpack(rectangles, w, h);

	for (MyRect &r : rectangles)
	{
		expand_by(r, - rect_border) ;
	}

	MyRect frame = compute_frame(rectangles) ;
	for (MyRect &r : rectangles)
	{
		translate(r, {- frame.m_left,- frame.m_top}) ;
	}

	int printpos=0;
	static char buffer[100000];

	printpos += sprintf(buffer + printpos, "[\n");
	for (const MyRect& r : rectangles)
	{
		printpos += sprintf(buffer + printpos, "{\"id\":%d, \"x\":%d, \"y\":%d}%c\n", r.i, r.m_left, r.m_top,
                          &r == &rectangles.back() ? ' ' : ',');
	}
	printpos += sprintf(buffer + printpos, "]\n");
	
	return buffer;
}

const char* diagram_layout(int rect_border,
			const char* srects,
			const char* sedges)
{
	vector<MyRect> rectangles;
	int pos, nn;

	pos = 0;
    	MyRect r{0,0,0,0};
	while (sscanf(srects + pos, "%3hx%3hx%n", &r.m_right, &r.m_bottom, &nn) == 2)
	{
	//use variable 'MyRect.no_sequence' to keep the original position of the box.
	//keep in mind that variable 'MyRect.i' is used internally by some algorithms and cannot be used for that purpose.
		r.no_sequence = r.i = rectangles.size();
		rectangles.push_back(r);
		pos += nn;
	}

	printf("rectangles.size()=%zu\n", rectangles.size());
	
        vector<MPD_Arc> edges;
        pos = 0;
	MPD_Arc edge;
	while (sscanf(sedges + pos, "%3x%3x%n", &edge._i, &edge._j, &nn) == 2)
	{
		edges.push_back(edge);
		pos += nn;
	}

	printf("edges.size()=%zu\n", edges.size());

	int n=rectangles.size();

	vector<vector<MPD_Arc> > adjacency_list(n);
	for (MPD_Arc &edge : edges)
		adjacency_list[edge._i].push_back(edge);

	vector<vector<MPD_Arc> > unordered_adjacency_list(n);
	for (const auto& [i, j] : edges)
	{
		unordered_adjacency_list[i].push_back(MPD_Arc{i,j});
		unordered_adjacency_list[j].push_back(MPD_Arc{j,i});
	}
	vector<int> connected_component(n);
	connected_components(unordered_adjacency_list, connected_component);
	int nr_comp = 1 + ranges::max(connected_component);
	printf("Line %d. nr_comp=%d\n", __LINE__, nr_comp);

	for (MyRect& r : rectangles)
	{
		r.m_right += 2*rect_border;
		r.m_bottom += 2*rect_border;
	}

	stair_steps_(rectangles, adjacency_list);
	printf("exit stair_steps_();\n");
	fflush(stdout);
	compact_frame(rectangles, adjacency_list) ;
	printf("exit compute_frame();\n");
	fflush(stdout);
	optimize_rectangle_positions(rectangles, adjacency_list) ;
	printf("exit optimize_rectangle_positions();\n");
	fflush(stdout);
	compact_frame(rectangles, adjacency_list) ;
	printf("exit compact_frame();\n");
	fflush(stdout);

	for (MyRect &r : rectangles)
	{
		expand_by(r, - rect_border) ;
	}

	MyRect frame = compute_frame(rectangles) ;
	for (MyRect &r : rectangles)
	{
		translate(r, {- frame.m_left,- frame.m_top}) ;
	}

	int printpos=0;
	static char buffer[100000];

	printpos += sprintf(buffer + printpos, "[\n");

	for (const MyRect& r : rectangles)
	{
		printpos += sprintf(buffer + printpos, "{\"id\":%d, \"x\":%d, \"y\":%d}%c\n", r.i, r.m_left, r.m_top,
                          &r == &rectangles.back() ? ' ' : ',');
	}

	printpos += sprintf(buffer + printpos, "]\n");
	
	return buffer;
}
}//extern "C"

int main(int argc, char* argv[])
{
	const int rect_border = 20;

	const char* rectdim = "0770830770830b703d07f07105b07107109407009405407106907108507108507104003d08c0830940710b70710d30710be03d0cc03d0b6071";
	const char* links = "00000400100600200300300400400600500600700600800600900600a00600b00600c00d00d00c00e00c00e00600f00c010004011012012006";
	const char* jsonLayout = diagram_layout(rect_border, rectdim, links);
	printf("%s", jsonLayout);
/*
	const char* rectdim = "07f02b0b003d04007106a08307f03d11204e04709404e04e0cc04e07006007107106208304003d03804e09a06006203d07003d07004e03203d0b6083";
	const char* links = "00200e00200501100700600e00600500100e00300400501100800900e00700701000c00e00a01200a01000a00901300a01300701300801300b01000300b00d00900f007000";
	const char* jsonLayout = diagram_layout(rect_border, rectdim, links);
	printf("%s", jsonLayout);
*/
}

/*
Linux command to install eigen3 directory:
 sudo apt-get install libeigen3-dev
Linux command to lookup eigen3 directory:
 sudo find / -type d -name "eigen3"


To generate diagram_layout.wasm and diagram_layout.js:
emcc diagram_layout.cpp minimum_cut.cpp binpack.cpp compact_frame.cpp compact_rectangles.cpp MyRect.cpp optimize_rectangle_positions.cpp MPD_Arc.cpp latuile_test_json_output.cpp FunctionTimer.cpp -o diagram_layout.js -Wno-c++11-narrowing -s EXPORTED_FUNCTIONS='["_diagram_layout","_diagram_layout_binpack"]' -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap"]' -s ALLOW_MEMORY_GROWTH=1  -s EXPORT_ES6=1 -s MODULARIZE=1 -s EXPORT_NAME="createLayoutModule"  -s TOTAL_STACK=32MB  -std=c++20

*/
