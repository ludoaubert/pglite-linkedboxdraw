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
	vector<int> nodes(n);
	ranges::copy(views::iota(0,n), nodes.begin());
	
        vector<MPD_Arc> edges;
        int pos = 0;
	int nn=0;
	MPD_Arc edge;
	while (sscanf(sedges + pos, "%3x%3x%n", &edge._i, &edge._j, &nn) == 2)
	{
		edges.push_back(edge);
		pos += nn;
	}

	printf("edges.size()=%zu\n", edges.size());

	MatrixXd W = MatrixXd::Zero(n, n) ;
	for (const auto& [i, j] : edges)
	{
		W(i, j) = W(j, i) = 1.0f ;
	}

//must be computed from unoriented graph
	vector<int> connected_component(n, -1) ;
	connected_components(compute_adjacency_list(W), connected_component) ;

	int nr_comp = 1 + ranges::max(connected_component) ;
	printf("nr_comp=%d\n", nr_comp);
	vector<int> component_distribution(nr_comp, 0) ;
	for (int comp : connected_component)
		component_distribution[comp]++;

/*
Matrix P1 * OW * P1.transpose() or P1 * W * P1.transpose()
    n1      n2       n3
  +-----+------------------+
  |     |                   |
n1| cc1 |                   |
  +-----+-------+----------+    
  |     |       |           |
n2|     |  cc2  |           |
  |     +-------+----------+
  |     |       |           |
n3|     |       |  cc3      |
  |     |       |           |
  +-----+-------+----------+
*/
//to create a permutation matrix, permute the columns of the identity matrix.
	vector<int> permutation1(n) ;
	ranges::copy(views::iota(0,n), permutation1.begin()) ;
	ranges::sort(permutation1, {}, [&](int i){return connected_component[i];}) ;
	permutation1 = compute_reverse_permutation(permutation1) ;

	string jsonPermutation1 = JSON_stringify(permutation1);
	printf("permutation1=%s\n", jsonPermutation1.c_str());
	
	PermutationMatrix<Dynamic> perm1(n) ;
	ranges::copy(permutation1, perm1.indices().data()) ;

	Matrix<int8_t,-1,-1> OW = Matrix<int8_t,-1,-1>::Zero(n, n) ;	//Oriented Weights

	for (const auto& [i, j] : edges)
	{
		OW(i, j) = 1 ;
	}

	vector<int> fan_in(n, 0) ;
	for (const auto& [i, j] : edges)
	{
		fan_in[j] ++ ;
	}
	MatrixXd WW = MatrixXd::Zero(n, n) ;
	for (const auto& [i, j] : edges)
	{
		double value = 1.0f / fan_in[j] ;
		WW(i, j) = WW(j, i) = value ;
	}

	struct Context
	{
		vector<int> nodes;
		vector<vector<MPD_Arc> > adjacency_list;
	};

	vector<Context> contexts;
	
	int n_acc = 0 ;
	int* pnp;
	
	while ((pnp = &*ranges::max_element(component_distribution)) && *pnp > max_nb_boxes_per_diagram)
	{
		int np = *pnp;
		int i=std::distance(&component_distribution[0], pnp);
		auto rg = component_distribution | views::take(i) ;
		int n_acc = std::accumulate(rg.begin(), rg.end(), 0);
		printf("n_acc=%d\n", n_acc);
		string jsonComponentDistrib = JSON_stringify(component_distribution);
		printf("component_distribution=%s\n", jsonComponentDistrib.c_str());
		printf("np=%d\n", np);
		printf("i=%d\n", i);

//keep on cutting
		PermutationMatrix<Dynamic> perm2(n), perm3(np) ;
		perm2.setIdentity() ;
		vector<int> sub_component_distribution ;

		bool b = minimum_cut(
				(perm1 * WW * perm1.transpose()).block(n_acc, n_acc, np, np),
				perm3,
				sub_component_distribution
			) ;

		string jsonSubComponentDistrib = JSON_stringify(sub_component_distribution);
		printf("sub_component_distribution=%s\n", jsonSubComponentDistrib.c_str());

		if (b)
		{
			std::transform(
				perm3.indices().data(),
				perm3.indices().data()+np,
				perm2.indices().data()+n_acc,
				[&](int pi){return pi+n_acc;}
			) ;
	//		perm2.block(n_acc, n_acc, np, np) = perm3 ;
	// if we want to apply P2 on P1*W*tP1 : 
	// P2*(P1* W* tP1)* tP2  or  (P2 * P1) * W * t(P2 * P1) so the new permutation is P2*P1
			perm1 = perm2 * perm1 ;
			component_distribution.erase(component_distribution.begin()+i) ;
			component_distribution.insert(component_distribution.begin()+i, 
								sub_component_distribution.begin(), 
								sub_component_distribution.end()) ;

			string jsonComponentDistrib = JSON_stringify(component_distribution);
			printf("component_distribution=%s\n", jsonComponentDistrib.c_str());
		}
	}

	vector<int> single_nodes ;

	n_acc=0 ;
	for (int np : component_distribution)
	{
		vector<vector<MPD_Arc> > my_adjacency_list = compute_adjacency_list_( (perm1 * OW * perm1.transpose()).block(n_acc, n_acc, np, np)) ;
		vector<int> my_nodes(np) ;
/*
A * perm : permute columns
perm * A : permute rows
*/
		Map<MatrixXi>(my_nodes.data(), np,1) = (perm1 * Map<MatrixXi>(nodes.data(), n,1)).block(n_acc, 0, np, 1) ;

		if (np != 1)
		{
			Context ctx ;
			ctx.nodes = my_nodes ;
			ctx.adjacency_list = my_adjacency_list ;
			contexts.push_back(ctx) ;
		}
		else
		{
			single_nodes.push_back(my_nodes[0] ) ;
		}

		n_acc += np ;
	}

	if (!single_nodes.empty())
	{
		Context ctx ;
		ctx.nodes = single_nodes ;
		ctx.adjacency_list.resize(ctx.nodes.size()) ;
		contexts.push_back(ctx) ;
	}

	int printpos=0;
	static char buffer[100000];

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
