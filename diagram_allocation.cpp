/* minimum.cpp
*
* Copyright (c) 2005-2025 Ludovic Aubert. ALL RIGHTS RESERVED.
* ludo.aubert@gmail.com
* This file should not be transmitted nor published.
*
*/
#include <vector>
#include "MPD_Arc.h"
#include "permutation.h"
#include <Eigen/Core>
#include <Eigen/Eigenvalues>
using namespace std;
using namespace Eigen ;

typedef Matrix<WidgetContext,Dynamic,Dynamic> MatrixXw ;
typedef Matrix<MyRect,Dynamic,Dynamic> MatrixXr ;

//must be computed from unoriented graph
void connected_components(const vector<vector<MPD_Arc> >& adjacency_list,
			  vector<int>& connected_component)
{
	int n = adjacency_list.size() ;
	vector<bool> visited(n, false) ;
	int comp=0 ;
	for (int i=0; i < adjacency_list.size(); i++)
	{
		if (visited[i])
			continue ;
		stack<int> Q ;
		Q.push(i) ;
		while (!Q.empty())
		{
			int ii = Q.top() ;
			Q.pop() ;
			if (visited[ii])
				continue ;
			connected_component[ii] = comp ;
			visited[ii] = true ;

			for (int k=0; k < adjacency_list[ii].size(); k++)
			{
				int j=adjacency_list[ii][k]._j ;
				if (!visited[j])
					Q.push(j) ;
			}
		}
		comp++ ;
	}
}


const char* diagram_allocation(int n, //nb boxes
                      int max_nb_boxes_per_diagram,
                      int edge_count,
                      const char* sedges)
{        
        vector<MPD_Arc> edges;
        pos = 0;
	MPD_Arc edge;
	while (edges.size() < edge_count &&
	    sscanf(edges + pos, "%3x%3x%n", &edge._i, &edge._j, &nn) == 2)
	{
                assert(edge._i < n);
                assert(edge._j < n);
		edges.push_back(edge);
		pos += nn;
	}

	MatrixXd W = MatrixXd::Zero(n, n) ;
	for (const auto& [i, j] : edges)
	{
		W(i, j) = W(j, i) = 1.0f ;
	}

//must be computed from unoriented graph
	vector<int> connected_component(n, -1) ;
	connected_components(compute_adjacency_list(W), connected_component) ;

	int nr_comp = 1 + *ranges::max_element(connected_component) ;
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
	ranges::copy(views::iota(0,n), begin(permutation1)) ;
	ranges::sort(permutation1, {}, [&](int i){return connected_component[i];}) ;
	permutation1 = compute_reverse_permutation(permutation1) ;
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

	int n_acc = 0 ;

	for (int i=0; i < component_distribution.size(); i++)
	{
		int np = component_distribution[i] ;

		if (np > max_nb_boxes_per_diagram)
		{
//keep on cutting
			PermutationMatrix<Dynamic> perm2(n), perm3(np) ;
			perm2.setIdentity() ;
			vector<int> sub_component_distribution ;

			bool b = minimum_cut(
					(perm1 * WW * perm1.transpose()).block(n_acc, n_acc, np, np),
					perm3,
					sub_component_distribution
				) ;

			if (b)
			{
				transform(
					perm3.indices().data(),
					perm3.indices().data()+np,
					perm2.indices().data()+n_acc,
					[&](int pi){return pi+n_acc;}
				) ;
	//			perm2.block(n_acc, n_acc, np, np) = perm3 ;
	// if we want to apply P2 on P1*W*tP1 : 
	// P2*(P1* W* tP1)* tP2  or  (P2 * P1) * W * t(P2 * P1) so the new permutation is P2*P1
				perm1 = perm2 * perm1 ;
				component_distribution.erase(component_distribution.begin()+i) ;
				component_distribution.insert(component_distribution.begin()+i, 
											sub_component_distribution.begin(), 
											sub_component_distribution.end()) ;
	//re-initialize the loop : force it to make as many cuts as necessary
				i = -1 ;
				n_acc = - np ;
			}
		}

		n_acc += np ;
	}

	vector<MyRect> single_tables ;

	n_acc=0 ;
	for (int np : component_distribution)
	{
		vector<vector<MPD_Arc> > my_adjacency_list = compute_adjacency_list_( (perm1 * OW * perm1.transpose()).block(n_acc, n_acc, np, np)) ;
		vector<MyRect> my_rectangles(np) ;
/*
A * perm : permute columns
perm * A : permute rows
*/
		Map<MatrixXr>(my_rectangles.data(), np,1) = (perm1 * Map<MatrixXr>(rectangles.data(), n,1)).block(n_acc, 0, np, 1) ;

		if (np != 1)
		{
			Context ctx ;
			ctx.rectangles = my_rectangles ;
			ctx.adjacency_list = my_adjacency_list ;
			contexts.push_back(ctx) ;
		}
		else
		{
			MyRect &rect = my_rectangles[0] ;
			single_tables.push_back(rect) ;
		}

		n_acc += np ;
	}

	if (!single_tables.empty())
	{
		Context ctx ;
		ctx.rectangles = single_tables ;
		ctx.adjacency_list.resize(ctx.rectangles.size()) ;
		contexts.push_back(ctx) ;
	}
	
	static char res[100000];
	
	return res;
}
      
