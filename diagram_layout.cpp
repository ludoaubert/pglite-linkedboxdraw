/* diagram_layout.cpp
*
* Copyright (c) 2005-2025 Ludovic Aubert. ALL RIGHTS RESERVED.
* ludo.aubert@gmail.com
* This file should not be transmitted nor published.
*
*/
#include <vector>
#include <algorithm>
#include <ranges>
#include <string>
#include <numeric>
#include "MPD_Arc.h"
#include "permutation.h"
using namespace std;
using namespace std::ranges;


//interface for emscripten wasm
extern "C" {
const char* diagram_layout(int n, //nb boxes
                      int edge_count,
                      const char* sedges)
{
	vector<int> nodes(n);
	ranges::copy(views::iota(0,n), nodes.begin());
	
        vector<MPD_Arc> edges;
        int pos = 0;
	int nn=0;
	MPD_Arc edge;
	while (edges.size() < edge_count &&
	    sscanf(sedges + pos, "%3x%3x%n", &edge._i, &edge._j, &nn) == 2)
	{
                assert(edge._i < n);
                assert(edge._j < n);
		edges.push_back(edge);
		pos += nn;
	}

	printf("edges.size()=%zu\n", edges.size());
	printf("edge_count=%d\n", edge_count);


	string jsonPermutation1 = JSON_stringify(permutation1);
	printf("permutation1=%s\n", jsonPermutation1.c_str());


	int printpos=0;
	static char buffer[100000];

	printpos += sprintf(buffer + printpos, "[\n");

	for (int contextIndex=0; contextIndex < contexts.size(); contextIndex++)
	{
		const Context& ctx = contexts[contextIndex];
		for (const int& i : ctx.nodes)
		{
			printpos += sprintf(buffer + printpos, "{\"id\":%d, \"context\":%d}%c\n", i, contextIndex,
                              &i == &ctx.nodes.back() ? ' ' : ',');
		}
	}
	printpos += sprintf(buffer + printpos, "]\n");
	
	return buffer;
}
}//extern "C"

int main(int argc, char* argv[])
{
	const int n = 68;  //nb boxes
	const int max_nb_boxes_per_diagram = 20;
	const int edge_count = 60;
	const char* sedges = "00200700302300301b00400500502300600200803c00801500901b00a01b00b01300c02300d01b00e00f00f01301001101101b01302301402301501801902301901b01a01b01b03701b02c01c01b01e01b02001b02101102202602201102402302502802602302702302802402902302a02302b02302f02303001a03102803200503303203302803403503403003601b03703803803703903703902303b03703d00803e03c03f01b040013041043041008043023";
	const char* jsonLayout = diagram_layout(n, max_nb_boxes_per_diagram, edge_count, sedges);
	printf("%s", jsonAllocation);
}

/*
Linux command to install eigen3 directory:
 sudo apt-get install libeigen3-dev
Linux command to lookup eigen3 directory:
 sudo find / -type d -name "eigen3"


To generate diagram_layout.wasm and diagram_layout.js:
emcc diagram_layout.cpp permutation.cpp KMeansRexCore.cpp MPD_Arc.cpp -o diagram_layout.js -Wno-c++11-narrowing -s EXPORTED_FUNCTIONS='["_diagram_layout"]' -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap"]' -s ALLOW_MEMORY_GROWTH=1  -s EXPORT_ES6=1 -s MODULARIZE=1 -s EXPORT_NAME="createLayoutModule"  -s TOTAL_STACK=32MB  -std=c++20

*/
