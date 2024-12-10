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


//input: (P1 * W * P1.transpose()).block(0, 0, np, np)
//output: P2, component_distribution
bool minimum_cut(const MatrixXd& W, 
				 PermutationMatrix<Dynamic>& perm2, 
				 vector<int> &component_distribution)
{
#ifdef _DEBUG
	ostringstream buffer ;
	buffer << W ;
#endif

	int n = W.rows() ;

	MatrixXd D = W.rowwise().sum().asDiagonal() ;
// Ulrike von Luxburg : we thus advocate for using Lrw (Laplacien randow walk).
	MatrixXd Lrw = D.inverse() * (D - W) ;

	EigenSolver<MatrixXd> es(Lrw) ;
	VectorXd ev = es.eigenvalues().real() ;
	MatrixXd V = es.eigenvectors().real() ;

	std::vector<double*> evp(n) ;
	transform(ev.data(), ev.data()+n, evp.data(), [](double& val){return &val;}) ; 
	ranges::sort(evp, {}, [](double *p){return *p;}) ;
/*
non null eigenvalues => each corresponds to a cut.
*/
	const static double epsilon = pow(10,-6) ;
	vector<int> cut_indexes = index_if(evp, [=](double *p){return *p > epsilon;}) ;
	cut_indexes.push_back(0) ;
	double min_Ncut = INT_MAX ;
	int n1, n2 ;

	for (int pos : cut_indexes)
	{
		int column = evp[pos] - &ev[0] ;
		VectorXd fiedler_vector = V.col(column) ;
		std::vector<double> fv(fiedler_vector.data(), fiedler_vector.data()+n) ;
		int DD=1, K=2, Niter = 100, seed = 14567437496 ;
		const char *initname = "random" ;//either "random" or "plusplus"
		vector<double> Mu_OUT(K), Z_OUT(n) ;
		RunKMeans(fiedler_vector.data(), n, DD, K, Niter, seed, initname, &Mu_OUT[0], &Z_OUT[0]);
		n1 = ranges::count(Z_OUT, 1.0) ;
		n2 = ranges::count(Z_OUT, 0.0) ;

		if (n1 == 0 || n2 == 0)
			return false ;

//if there are small connected components as side effect of the cut, move them to the other side where they
//might be connected.
		vector<int> cc(n) ;
		vector<vector<MPD_Arc> > adj(n), adj_ = compute_adjacency_list(W) ;
		for (const auto& [i, j] : adj_ | views::join)
		{
			if (Z_OUT[i] != Z_OUT[j])
				continue ;
			adj[i].push_back({i, j}) ;
		}
		connected_components(adj, cc) ;
		int nr_comp = 1 + *ranges::max_element(cc) ;
		vector<int> distribution(nr_comp, 0) ;
		for (int comp : cc)
			distribution[comp]++ ;
		vector<int> component(nr_comp) ;
		for (int comp=0; comp < nr_comp; comp++)
			component[comp] = comp ;
		ranges::sort(component, {}, [&](int comp){return distribution[comp]; }) ;
		if (component.size() < 2)
			return false ;
		component.pop_back() ;
		component.pop_back() ;
		for (int comp : component)
		{
			for (int i=0 ; i < n ; i++)
			{
				if (cc[i] != comp)
					continue ;
				Z_OUT[i] = 1 - Z_OUT[i] ;
			}
		}
		n1 = ranges::count(Z_OUT, 1.0) ;
		n2 = ranges::count(Z_OUT, 0.0) ;

		adj = vector<vector<MPD_Arc> >(n) ;
		cc = vector<int>(n,0) ;
		for (const auto& [i, j] : adj_ | views::join)
		{
			if (Z_OUT[i] != Z_OUT[j])
				continue ;
			adj[i].push_back({i, j}) ;
		}
		connected_components(adj, cc) ;
		nr_comp = 1 + *ranges::max_element(cc) ;

//to create a permutation matrix, permute the columns of the identity matrix
		vector<int> permutation2(n) ;
		ranges::copy(views::iota(0,n), begin(permutation2)) ;
		ranges::sort(permutation2, ranges::greater(), [&](int i){return Z_OUT[i];}) ;
		permutation2 = compute_reverse_permutation(permutation2) ;
		ranges::copy(permutation2, perm2.indices().data()) ;
/*
		P2 = MatrixXd::Zero(n,n) ;
		for (int i=0 ; i < n; i++)
		{
			P2(permutation2[i], i) = 1.0f ;
		}
*/
//a partir de P1, P2 et Z_OUT2 on peut retrouver les 2 ensembles dans le referentiel de depart.

		double intra2[2] ;
/*
     n1           n2
  +-----+------------------+
  |     |                   |
n1|  A  |        B          |
  +-----+------------------+    
  |     |                   |
  |     |                   |
n2|  C  |        D          |
  |     |                   |
  |     |                   |
  |     |                   |
  +-----+------------------+
*/
		intra2[0] = (perm2 * W * perm2.transpose()).block(0, 0, n1, n1).sum() ;//A
		intra2[1] = (perm2 * W * perm2.transpose()).block(n1, n1, n2, n2).sum() ;//D
		//cut = B + C
		double cut = (perm2 * W * perm2.transpose()).block(0, n1, n1, n2).sum() + (perm2 * W * perm2.transpose()).block(n1, 0, n2, n1).sum() ;

//critere de qualité pour choisir la meilleure cut - Cf Ulrike von Luxburg paragraph 5
		double Ncut = cut / intra2[0] + cut / intra2[1] ; 
//penalty to make a small n1 (resp. n2) be taken into account as being added to nr_comp.
//goal is to make small asymmetric cut less attractive.
		int penalty = 0 ;
		if (n1*4 <= n)
			penalty+= abs(n-2*n1) ;
		if (n2*4 <= n)
			penalty+= abs(n-2*n2) ;
		Ncut = 1.0/(1.0+n1) + 1.0/(1.0+n2) + 1.0*(nr_comp+penalty)/(1.0+n)  ;
		if (Ncut < min_Ncut)
		{
			min_Ncut = Ncut ;
//play again the best at loop end.
			cut_indexes.back() = pos ;
		}
	}

	if (n1==0 || n2==0)
		return false ;

	vector<int> cc1(n1), cc2(n2) ;
	connected_components(compute_adjacency_list( (perm2 * W * perm2.transpose()).block(0, 0, n1, n1) ),
						  cc1) ;
	connected_components(compute_adjacency_list( (perm2 * W * perm2.transpose()).block(n1, n1, n2, n2) ),
						  cc2) ;
	for (int &comp : cc2)
		comp += 1 + *ranges::max_element(cc1) ;
	vector<int> connected_component ;
	ranges::copy(cc1, back_inserter(connected_component)) ;
	ranges::copy(cc2, back_inserter(connected_component)) ;
	int nr_comp = 1 + *ranges::max_element(connected_component) ;
	component_distribution = vector<int>(nr_comp, 0) ;
	for (int comp : connected_component)
		component_distribution[comp]++;

	vector<int> permutation(n) ;
	ranges::copy(views::iota(0,n), begin(permutation)) ;
	ranges::sort(permutation, {}, [&](int i){return connected_component[i];}) ;
	permutation = compute_reverse_permutation(permutation) ;
	PermutationMatrix<Dynamic> perm1(n) ;
	ranges::copy(permutation, perm1.indices().data()) ;
/*
//output: P1, component_distribution
	MatrixXd P1 = MatrixXd::Zero(n,n) ;
	for (int i=0 ; i < n; i++)
	{
		P1(permutation[i], i) = 1.0f ;
	}
*/
// if we want to apply P1 on P2*W*tP1 : 
// P1*(P2* W* tP2)* tP1  or  (P1 * P2) * W * t(P1 * P2) so the new permutation is P1*P2
	perm2 = perm1 * perm2 ;

	return true ;
}

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

/*
Linux command to install eigen3 directory:
 sudo apt-get install libeigen3-dev
Linux command to lookup eigen3 directory:
 sudo find / -type d -name "eigen3"

git checkout 30b7a332da77d55576d6f15ab65b587192c6aabc

To generate latuile.wasm and latuile.js:
emcc latuile.cpp binpack.cpp compact_frame.cpp compact_rectangles.cpp fit_together.cpp KMeansRexCore.cpp MyRect.cpp optimize_rectangle_positions.cpp permutation.cpp stair_steps.cpp swap_rectangles.cpp WidgetContext.cpp FunctionTimer.cpp MPD_Arc.cpp -o latuile.js -I/usr/include/eigen3 -Wno-c++11-narrowing -s EXPORTED_FUNCTIONS='["_latuile"]' -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap"]' -s ALLOW_MEMORY_GROWTH=1  -s EXPORT_ES6=1 -s MODULARIZE=1 -s EXPORT_NAME="createLatuileModule"  -s TOTAL_STACK=32MB

using cmake seemed more complicated.
*/
