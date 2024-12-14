/* minimum_cut.cpp
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
#include "MPD_Arc.h"
#include "permutation.h"
#include "KMeansRexCore.h"
#include "index_from.h"
#include <Eigen/Core>
#include <Eigen/Eigenvalues>
using namespace std ;
using namespace std::ranges;
using namespace Eigen ;

vector<vector<MPD_Arc> > compute_adjacency_list_(const Matrix<int8_t,-1,-1>& OW)
{
	assert(OW.rows() == OW.cols()) ;

	int n = OW.rows() ;

	vector<vector<MPD_Arc> > adjacency_list(n) ;

	for (int i=0; i < n; i++)
	{
		for (int j=0; j < n; j++)
		{
                        if (OW(i,j) == 0)
				continue ;
			adjacency_list[i].push_back(MPD_Arc{i,j}) ;
		}
	}

	return adjacency_list ;
}


vector<vector<MPD_Arc> > compute_adjacency_list(const MatrixXd& OW)
{
	assert(OW.rows() == OW.cols()) ;

	int n = OW.rows() ;

	vector<vector<MPD_Arc> > adjacency_list(n) ;

	for (int i=0; i < n; i++)
	{
		for (int j=0; j < n; j++)
		{
			double val = OW(i,j) ;
			if (OW(i,j) == 0.0f)
				continue ;
			MPD_Arc a ;
			a._i = i ;
			a._j = j ;
			adjacency_list[a._i].push_back(a) ;
		}
	}

	return adjacency_list ;
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

string JSON_stringify(const vector<int>& v)
{
	char buffer[1000];
	int pos=0;
	pos += sprintf(buffer+pos, "[]");
	pos--;
	for (const int& i : v)
		pos += sprintf(buffer+pos, "%d%c", i, &i==&v.back() ? ']' : ','); 
	return buffer;
}

string JSON_stringify(const vector<double>& v)
{
	char buffer[1000];
	int pos=0;
	pos += sprintf(buffer+pos, "[]");
	pos--;
	for (const double& i : v)
		pos += sprintf(buffer+pos, "%f%c", i, &i==&v.back() ? ']' : ','); 
	return buffer;
}

string serialise(const MatrixXd& W)
{
	ostringstream buffer ;
	buffer << W ;
	return buffer.str();
}

//input: (P1 * W * P1.transpose()).block(0, 0, np, np)
//output: P2, component_distribution
bool minimum_cut(const MatrixXd& W, 
		PermutationMatrix<Dynamic>& perm2, 
		vector<int> &component_distribution)
{
	string sW = serialise(W);
	printf("Line %d. W=%s\n", __LINE__, sW.c_str());

	int n = W.rows() ;

	MatrixXd D = W.rowwise().sum().asDiagonal() ;

	string sD = serialise(D);
	printf("Line %d. sD=%s\n", __LINE__, sD.c_str());

// Ulrike von Luxburg : we thus advocate for using Lrw (Laplacien randow walk).
	MatrixXd Lrw = D.inverse() * (D - W) ;

	string sLrw = serialise(Lrw);
	printf("Line %d. sLrw=%s\n", __LINE__, sLrw.c_str());
	fflush(stdout);	

	EigenSolver<MatrixXd> es(Lrw) ;
	VectorXd ev = es.eigenvalues().real() ;
	MatrixXd V = es.eigenvectors().real() ;

	struct EigenStruct
	{
		double eigenValue;
		VectorXd eigenVector;
	};

	vector<EigenStruct> esv(n);
	for (int i=0; i<n; i++)
		esv[i] = EigenStruct{*(ev.data()+i), V.col(i)};

	ranges::sort(esv, {}, &EigenStruct::eigenValue);
/*
non null eigenvalues => each corresponds to a cut.
*/
	const static double epsilon = pow(10,-6) ;
	vector<int> cut_indexes = index_if(esv, [=](const EigenStruct &e){return e.eigenValue > epsilon;});
	cut_indexes.push_back(0) ;

	string jsonCutIndexes = JSON_stringify(cut_indexes);
	printf("Line %d. cut_indexes=%s\n", __LINE__, jsonCutIndexes.c_str());

	double min_Ncut = INT_MAX ;
	int n1, n2 ;
	
	for (int pos : cut_indexes)
	{
		const {eigenValue, fiedler_vector} = esv[pos] ;
		printf("Line %d. looping on pos in cut_indexes. pos=%d eigenValue=%f\n", __LINE__, pos, eigenValue);

		vector<double> fv(fiedler_vector.data(), fiedler_vector.data()+n) ;

		string jsonFV = JSON_stringify(fv);
		printf("Line %d. fv=%s\n", __LINE__, jsonFV.c_str());

		int DD=1, K=2, Niter = 100, seed = 14567437496 ;
		const char *initname = "random" ;//either "random" or "plusplus"
		vector<double> Mu_OUT(K), Z_OUT(n) ;
		RunKMeans(fiedler_vector.data(), n, DD, K, Niter, seed, initname, &Mu_OUT[0], &Z_OUT[0]);
		n1 = ranges::count(Z_OUT, 1.0) ;
		n2 = ranges::count(Z_OUT, 0.0) ;

		printf("Line %d. n1=%d\n", __LINE__, n1);
		printf("Line %d. n2=%d\n", __LINE__, n2);
		
		if (n1 == 0 || n2 == 0)
		{
			printf("Line %d. n1=%d, n2=%d: no cut!\n", __LINE__, n1, n2);
			return false ;
		}

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
		int nr_comp = 1 + ranges::max(cc) ;
		printf("Line %d. nr_comp=%d\n", __LINE__, nr_comp);
		vector<int> distribution(nr_comp, 0) ;
		for (int comp : cc)
			distribution[comp]++ ;
		
		vector<int> component(nr_comp) ;
		for (int comp=0; comp < nr_comp; comp++)
			component[comp] = comp ;
		ranges::sort(component, {}, [&](int comp){return distribution[comp]; }) ;
		printf("Line %d. component.size()=%zu\n", __LINE__, component.size());
		if (component.size() < 2)
		{
			printf("Line %d. component.size()=%zu: no cut!\n", __LINE__, component.size());
			return false ;
		}
		component.pop_back() ;
		component.pop_back() ;
		printf("Line %d. component.size()=%zu\n", __LINE__, component.size());
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

		printf("Line %d. n1=%d, n2=%d\n", __LINE__, n1, n2);

		adj = vector<vector<MPD_Arc> >(n) ;
		cc = vector<int>(n,0) ;
		for (const auto& [i, j] : adj_ | views::join)
		{
			if (Z_OUT[i] != Z_OUT[j])
				continue ;
			adj[i].push_back({i, j}) ;
		}
		connected_components(adj, cc) ;
		nr_comp = 1 + ranges::max(cc) ;
		printf("Line %d. nr_comp=%d\n", __LINE__, nr_comp);

//to create a permutation matrix, permute the columns of the identity matrix
		vector<int> permutation2(n) ;
		ranges::copy(views::iota(0,n), permutation2.begin()) ;
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
		printf("Line %d. Ncut=%f\n", __LINE__, Ncut);
//penalty to make a small n1 (resp. n2) be taken into account as being added to nr_comp.
//goal is to make small asymmetric cut less attractive.
		int penalty = 0 ;
		if (n1*4 <= n)
			penalty+= abs(n-2*n1) ;
		if (n2*4 <= n)
			penalty+= abs(n-2*n2) ;
		Ncut = 1.0/(1.0+n1) + 1.0/(1.0+n2) + 1.0*(nr_comp+penalty)/(1.0+n)  ;
		printf("Line %d. Ncut=%f\n", __LINE__, Ncut);
		if (Ncut < min_Ncut)
		{
			min_Ncut = Ncut ;
			printf("Line %d. Ncut=%f min_Ncut=%f\n", __LINE__, Ncut, min_Ncut);
//play again the best at loop end.
			printf("Line %d. cut_indexes.back() = %d\n", __LINE__, pos);
			cut_indexes.back() = pos ;
		}
	}

	if (n1==0 || n2==0)
	{
		printf("Line %d. n1=%d, n2=%d: no cut!\n", __LINE__, n1, n2);
		return false ;
	}

	printf("Line %d. n1=%d, n2=%d\n", __LINE__, n1, n2);

	vector<int> cc1(n1), cc2(n2) ;
	connected_components(compute_adjacency_list( (perm2 * W * perm2.transpose()).block(0, 0, n1, n1) ),
						  cc1) ;
	connected_components(compute_adjacency_list( (perm2 * W * perm2.transpose()).block(n1, n1, n2, n2) ),
						  cc2) ;
	for (int &comp : cc2)
		comp += 1 + ranges::max(cc1) ;
	vector<int> connected_component ;
	ranges::copy(cc1, back_inserter(connected_component)) ;
	ranges::copy(cc2, back_inserter(connected_component)) ;
	int nr_comp = 1 + ranges::max(connected_component) ;
	printf("Line %d. nr_comp=%d\n", __LINE__, nr_comp);
	component_distribution = vector<int>(nr_comp, 0) ;
	for (int comp : connected_component)
		component_distribution[comp]++;

	vector<int> permutation(n) ;
	ranges::copy(views::iota(0,n), permutation.begin()) ;
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

	printf("Line %d. return true;\n", __LINE__);
	return true ;
}
