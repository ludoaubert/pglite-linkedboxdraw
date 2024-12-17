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
#include "minimum_cut.h"
#include "MPD_Arc.h"
#include "permutation.h"
#include "KMeansRexCore.h"
#include "index_from.h"
#include <Eigen/Core>
#include <Eigen/Eigenvalues>
using namespace std ;
using namespace std::ranges;
using namespace Eigen ;


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


//Input
vector<int> nodes ;
vector<MPD_Arc> edges ;
//Output
vector<NodeAllocation> allocation;
int max_nb_boxes_per_diagram;

//TODO: use C++23 ranges::to<vector>()
bool minimum_cut(const string& chemin)
{
	vector<int> dense_rank(nodes.size(), -1);

	auto rg1 = allocation
			| views::filter([&](const NodeAllocation& na){return na.chemin==chemin;})
			| views::transform(&NodeAllocation::i)
			| ranges::to<vector>() ;

	vector<int> allocated_nodes(rg1.size());
	ranges::copy(rg1, allocated_nodes)
	
	for (int j=0; j < allocated_nodes.size(); j++)
	{
		const auto [i, chemin] = allocated_nodes[j];
		dense_rank[i] = j;
	}

	auto rg2 = edges
			| views::filter([&](const MPD_Arc& e){return dense_rank[e._i]!=-1 && dense_rank[e._j]!=-1;})
			| views::transform([&](const MPD_Arc& e){return MPD_Arc{._i=dense_rank[e._i], ._j=dense_rank[e._j]};}
			| ranges::to<vector>() ;
	vector<MPD_Arc> allocated_edges(rg2.size());
	ranges::copy(rg2, allocated_edges);

	const int n = allocated_nodes.size();

	MatrixXd W = MatrixXd::Zero(n, n) ;
	for (const auto& [i, j] : allocated_edges)
	{
		W(i, j) = W(j, i) = 1.0f ;
	}
	
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
		vector<double> Z_OUT;
		int n1, n2;
		double Ncut, Ncut2;
	};

	vector<EigenStruct> esv(n);
	for (int i=0; i<n; i++)
		esv[i] = EigenStruct{
				.eigenValue = *(ev.data()+i),
				.eigenVector = V.col(i),
				.Z_OUT = vector<double>(n),
				.n1=0,
				.n2=0,
				.Ncut=0.0,
				.Ncut2=0.0
			};

	ranges::sort(esv, {}, &EigenStruct::eigenValue);
/*
non null eigenvalues => each corresponds to a cut.
*/
	const double EPSILON = pow(10,-6) ;

	auto rg = esv | views::filter([=](const EigenStruct& es){return &es==&esv[0] || es.eigenValue > EPSILON;});

	for (auto& [eigenValue, fiedler_vector, Z_OUT, n1, n2, Ncut, Ncut2] : rg)
	{
		printf("Line %d. looping on pos in esv. eigenValue=%f\n", __LINE__, eigenValue);

		vector<double> fv(fiedler_vector.data(), fiedler_vector.data()+n) ;

		string jsonFV = JSON_stringify(fv);
		printf("Line %d. fv=%s\n", __LINE__, jsonFV.c_str());

		const int DD=1, K=2, Niter = 100, seed = 14567437496 ;
		const char *initname = "random" ;//either "random" or "plusplus"
		vector<double> Mu_OUT(K);
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

//to create a permutation matrix, permute the columns of the identity matrix
		PermutationMatrix<Dynamic> perm2(n) ;
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
		Ncut = cut / intra2[0] + cut / intra2[1] ;
		printf("Line %d. Ncut=%f\n", __LINE__, Ncut);
//penalty to make a small n1 (resp. n2) be taken into account as being added to nr_comp.
//goal is to make small asymmetric cut less attractive.
		int penalty = 0 ;
		if (n1*4 <= n)
			penalty+= abs(n-2*n1) ;
		if (n2*4 <= n)
			penalty+= abs(n-2*n2) ;
		const int nr_comp=2; //to be confirmed
		Ncut2 = 1.0/(1.0+n1) + 1.0/(1.0+n2) + 1.0*(nr_comp+penalty)/(1.0+n)  ;
		printf("Line %d. Ncut2=%f\n", __LINE__, Ncut2);
	}

	const auto& [eigenValue, fiedler_vector, Z_OUT, n1, n2, Ncut, Ncut2] = ranges::min(rg, {}, &EigenStruct::Ncut2);

	printf("Line %d. min => Ncut2=%f, NCut=%f\n", __LINE__, Ncut2, Ncut);
	printf("Line %d. n1=%d, n2=%d\n", __LINE__, n1, n2);
	
	if (n1==0 || n2==0)
	{
		printf("Line %d. n1=%d, n2=%d: no cut!\n", __LINE__, n1, n2);
		return false ;
	}

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

	for (int c : views::iota(0, nr_comp))
	{
		char suffix[4] ;
		for (int i=0; i<n; i++)
		{
			int c = connected_component[i];
			sprintf(".%02d", c);
			allocation.push_back(NodeAllocation{.i=allocated_nodes[i], .chemin=chemin+suffix});
		}
//	string chemin ; //example : "01.02.01"
	}

	printf("Line %d. return true;\n", __LINE__);
	return true ;
}


void rec_min_cut(const string& chemin)
{
	const int n = nodes.size();
	vector<int> dense_rank(n, -1);
	
	const vector<int> allocated_nodes = allocation
			| views::filter(const NodeAllocation& na){return na.chemin==chemin;})
			| views::transform(&NodeAllocation::i)
			| ranges::to<vector> ;
		
	for (int j=0; j < allocated_nodes.size(); j++)
	{
		const auto [i, chemin] = allocated_nodes[j];
		dense_rank[i] = j;
	}

	const allocated_edges = edges
			| views::filter([&](const MPD_Arc& e){return dense_rank[e._i]!=-1 && dense_rank[e._j]!=-1;})
			| views::transform([&](const MPD_Arc& e){return MPD_Arc{._i=dense_rank[e._i], ._j=dense_rank[e._j]};}
			| ranges::to<vector> ;

	minimum_cut(allocated_nodes, allocated_edges, chemin);

	for (int i : views::iota(0, 10))
	{
		char suffix[4];
		sprintf(suffix, ".%02d", i);
		const string subchemin = chemin + suffix;
		const auto rg = allocation
					| views::filter(const NodeAllocation& na){return na.chemin==subchemin;}) ;
			
		if (rg.size() > max_nb_boxes_per_diagram)
			rec_minimum_cut(chemin + suffix);
	}
}
