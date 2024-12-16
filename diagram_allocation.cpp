/* diagram_allocation.cpp
*
* Copyright (c) 2005-2025 Ludovic Aubert. ALL RIGHTS RESERVED.
* ludo.aubert@gmail.com
* This file should not be transmitted nor published.
*
*/
#include <vector>
#include <algorithm>
#include <ranges>
#include <stack>
#include <string>
#include <numeric>
#include "MPD_Arc.h"
#include "minimum_cut.h"
#include "permutation.h"
#include <Eigen/Core>
#include <Eigen/Eigenvalues>
using namespace std;
using namespace Eigen ;
using namespace std::ranges;


//interface for emscripten wasm
extern "C" {
const char* diagram_allocation(int n, //nb boxes
                      int max_nb_boxes_per_diagram,
                      const char* sedges)
{
	nodes.resize(n);
	ranges::copy(views::iota(0,n), nodes.begin());

        int pos = 0;
	int nn=0;
	MPD_Arc edge;
	while (sscanf(sedges + pos, "%3x%3x%n", &edge._i, &edge._j, &nn) == 2)
	{
		edges.push_back(edge);
		pos += nn;
	}

	printf("edges.size()=%zu\n", edges.size());

	const string chemin="";
	rec_minimum_cut(chemin);
/*
	if (!single_nodes.empty())
	{
		Context ctx ;
		ctx.nodes = single_nodes ;
		ctx.adjacency_list.resize(ctx.nodes.size()) ;
		contexts.push_back(ctx) ;
	}
*/
	int printpos=0;
	static char buffer[100000];
/*
	printpos += sprintf(buffer + printpos, "[\n");

	for (int contextIndex=0; contextIndex < contexts.size(); contextIndex++)
	{
		const Context& ctx = contexts[contextIndex];
		for (const int& i : ctx.nodes)
		{
			printpos += sprintf(buffer + printpos, "\n{\"id\":%d, \"context\":%d},", i, contextIndex);
		}
	}
	printpos += sprintf(buffer + printpos -1, "]\n");
*/
	return buffer;
}
}//extern "C"

int main(int argc, char* argv[])
{
	const int n = 68;  //nb boxes
	const int max_nb_boxes_per_diagram = 20;
	const char* sedges = "00200700302300301b00400500502300600200803c00801500901b00a01b00b01300c02300d01b00e00f00f01301001101101b01302301402301501801902301901b01a01b01b03701b02c01c01b01e01b02001b02101102202602201102402302502802602302702302802402902302a02302b02302f02303001a03102803200503303203302803403503403003601b03703803803703903703902303b03703d00803e03c03f01b040013041043041008043023";
	const char* jsonAllocation = diagram_allocation(n, max_nb_boxes_per_diagram, sedges);
	printf("%s", jsonAllocation);
}

/*
Linux command to install eigen3 directory:
 sudo apt-get install libeigen3-dev
Linux command to lookup eigen3 directory:
 sudo find / -type d -name "eigen3"


To generate diagram_allocation.wasm and diagram_allocation.js:
emcc diagram_allocation.cpp minimum_cut.cpp permutation.cpp KMeansRexCore.cpp MPD_Arc.cpp -o diagram_allocation.js -I/usr/include/eigen3 -Wno-c++11-narrowing -s EXPORTED_FUNCTIONS='["_diagram_allocation"]' -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap"]' -s ALLOW_MEMORY_GROWTH=1  -s EXPORT_ES6=1 -s MODULARIZE=1 -s EXPORT_NAME="createAllocationModule"  -s TOTAL_STACK=32MB  -std=c++20

*/
