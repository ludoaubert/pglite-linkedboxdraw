/* diagram_layout.cpp
*
* Copyright (c) 2005-2025 Ludovic Aubert. ALL RIGHTS RESERVED.
* ludo.aubert@gmail.com
* This file should not be transmitted nor published.
*
*/
#include "MyRect.h"
#include "MPD_Arc.h"
#include "WidgetContext.h"
#include "swap_rectangles.h"
#include "compact_rectangles.h"
#include "compact_frame.h"
#include "index_from.h"
#include "binpack.h"
#include "optimize_rectangle_positions.h"
#include "fit_together.h"
#include "permutation.h"
#include "KMeansRexCore.h"
#include "FunctionTimer.h"
#include <vector>
#include <stack>
#include <iterator>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
#include <ranges>
#include <numeric>
#include <random>
#include <fstream>
#include <assert.h>
#include <chrono>
#include <Eigen/Core>
#include <Eigen/Eigenvalues>
using namespace std ;
using namespace std::ranges;
using namespace std::chrono;
using namespace Eigen ;

typedef Matrix<WidgetContext,Dynamic,Dynamic> MatrixXw ;
typedef Matrix<MyRect,Dynamic,Dynamic> MatrixXr ;

typedef Matrix<int, Dynamic, Dynamic> MatrixXi;

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
	printf("W=%s\n", sW.c_str());

	int n = W.rows() ;

	MatrixXd D = W.rowwise().sum().asDiagonal() ;

	string sD = serialise(D);
	printf("sD=%s\n", sD.c_str());
	
// Ulrike von Luxburg : we thus advocate for using Lrw (Laplacien randow walk).
	MatrixXd Lrw = D.inverse() * (D - W) ;

	string sLrw = serialise(Lrw);
	printf("sLrw=%s\n", sLrw.c_str());
	fflush(stdout);	

	EigenSolver<MatrixXd> es(Lrw) ;
	VectorXd ev = es.eigenvalues().real() ;
	MatrixXd V = es.eigenvectors().real() ;

	std::vector<double*> evp(n) ;
	std::transform(ev.data(), ev.data()+n, evp.data(), [](double& val){return &val;}) ; 
	ranges::sort(evp, {}, [](double *p){return *p;}) ;
/*
non null eigenvalues => each corresponds to a cut.
*/
	const static double epsilon = pow(10,-6) ;
	vector<int> cut_indexes = index_if(evp, [=](double *p){return *p > epsilon;}) ;
	cut_indexes.push_back(0) ;

	string jsonCutIndexes = JSON_stringify(cut_indexes);
	printf("cut_indexes=%s\n", jsonCutIndexes.c_str());
	
	double min_Ncut = INT_MAX ;
	int n1, n2 ;

	for (int pos : cut_indexes)
	{
		int column = evp[pos] - &ev[0] ;
		VectorXd fiedler_vector = V.col(column) ;
		std::vector<double> fv(fiedler_vector.data(), fiedler_vector.data()+n) ;

		string jsonFV = JSON_stringify(fv);
		printf("fv=%s\n", jsonFV.c_str());

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

	return true ;
}



bool stair_steps(vector<MyRect> &rectangles, MyRect& rr, vector<vector<MPD_Arc> > &adjacency_list)
{
        FunctionTimer ft("stair_steps");
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


void composite_from_selected_rectangles(vector<WidgetContext> &rects, vector<vector<MPD_Arc> > &adjacency_list)
{
	int n = rects.size() ;
	int not_selected = ranges::count_if(rects, [](const WidgetContext& widget){return widget.r.selected==false ;}) ;
	int selected = rects.size() - not_selected ;

//1) calcule de la matrice de permutation
	vector<int> permutation(n) ;
	ranges::copy(views::iota(0, n), permutation.begin()) ;
//on met les selectionnes a droite.
	ranges::sort(permutation, {}, [&](int i){return rects[i].r.selected; }) ;
	permutation = compute_reverse_permutation(permutation) ;
	PermutationMatrix<Dynamic> perm(n) ;
	for (int i=0; i < n; i++)
		perm.indices().data()[i] = permutation[i] ;
//2) mise a jour des rectangles composites
	vector<WidgetContext> my_rectangles(n) ;
	Map<MatrixXw>(my_rectangles.data(), n, 1) = (perm * Map<MatrixXw>(rects.data(), n, 1)) ;
	vector<WidgetContext> selected_rectangles(my_rectangles.begin() + not_selected, my_rectangles.end()),
						not_selected_rectangles(my_rectangles.begin(), my_rectangles.begin() + not_selected) ;
	my_rectangles = not_selected_rectangles ;
	WidgetContext widget ;
	widget.type = WidgetType::COMPOSITE_WIDGET ;
	widget.widgets = selected_rectangles ;
	MyRect frame = compute_frame(vector<MyRect>(selected_rectangles.begin(), selected_rectangles.end())) ;
	for (WidgetContext& child_widget : widget.widgets)
		translate(child_widget.r, {-frame.m_left, -frame.m_top}) ;
	widget.r = frame ;
	translate(widget.r, {-frame.m_left, -frame.m_top}) ;
	my_rectangles.push_back(widget) ;
	rects = my_rectangles ;
//3) mise a jour de la liste d'adjacence
	MatrixXd OW = MatrixXd::Zero(n,n) ;	//Oriented Weights
	for (auto [i, j] : adjacency_list | std::views::join)
	{
		OW(i, j) = 1 ;
	}
	OW = perm * OW * perm.transpose() ;
								// (startRow, startCol, blockRows, blockCols)
	OW.col(not_selected) = OW.block(0, not_selected, n, selected).rowwise().sum() ;	//rowwise().sum() returns a vector of the sums in each row
	OW.row(not_selected) = OW.block(not_selected, 0, selected, n).colwise().sum() ;
	adjacency_list = compute_adjacency_list(OW.block(0,0,not_selected+1, not_selected+1)) ;
}


bool stair_steps_(vector<MyRect> &rectangles, vector<vector<MPD_Arc> > &adj_list)
{
        FunctionTimer ft("stair_steps_");
	int n = rectangles.size() ;

	vector<vector<MyRect> > solutions ;

	for (int i=0; i < n; i++)
	{
		vector<vector<MPD_Arc> > adjacency_list = adj_list ;

		vector<WidgetContext> rects(n) ;
		for (int ii=0; ii < n; ii++)
		{
			WidgetContext &widget = rects[ii] ;
			MyRect& r = rectangles[ii] ;
			widget.type = WidgetType::RECTANGLE ;
			widget.r = r ;
			widget.r.selected = false ;
		}

		while(int not_selected = ranges::count_if(rects, [](const WidgetContext& widget){return widget.r.selected==false ;}))
		{
			int selected = rects.size() - not_selected ;
			int n = rects.size() ;
			MatrixXd W = MatrixXd::Zero(n,n) ;
			PermutationMatrix<Dynamic> perm(n) ;
			for (const auto& [i, j] : adjacency_list | views::join)
			{
				W(i,j) = W(j,i) = 1 ;
			}
                        vector<int> v(n);
			if (selected != 0 && minimum_cut(W, perm, v)==false)
			{
				composite_from_selected_rectangles(rects, adjacency_list) ;
				if (rects.size() == n)
					break ;	// composite hat nichts gebracht
			}
			if (selected != 0 && minimum_cut(W, perm, v)==true)
			{
				break ;
			}

			n = rects.size() ;
			vector<MyRect> rectangles_(n) ;
			for (int i=0; i < n; i++)
			{
				MyRect& r = rectangles_[i] ;
				WidgetContext& widget = rects[i] ;
				r = widget.r ;
				r.i = i ;
			}

			bool result = stair_steps(rectangles_, rectangles_[i < n ? i : n-1], adjacency_list) ;

			for (int i=0; i < n; i++)
			{
				MyRect& r = rectangles_[i] ;
				WidgetContext& widget = rects[i] ;
				int ri = widget.r.i ;
				widget.r = r ;
				widget.r.i = ri ;
			}
		}

		rects = collapse_composite(rects) ;
		vector<MyRect> rects2(rects.size()) ;
		for (WidgetContext &widget : rects)
		{
			assert(widget.type == WidgetType::RECTANGLE) ;
			MyRect &r = widget.r ;
			rects2[r.i] = r ;
		}
		if (index_from_if(rects,[](const WidgetContext& widget){return widget.r.selected==false;}) == -1)
			solutions.push_back(rects2) ;
	}

	if (solutions.empty())
		return false ;

	rectangles = * ranges::min_element(solutions, {}, [](const vector<MyRect>& rects){
		return dim_max(compute_frame(rects));
	}) ;

	MyRect frame = compute_frame(rectangles) ;
	for (MyRect &r : rectangles)
		translate(r, {-frame.m_left, -frame.m_top}) ;
	return true ;
}


bool stair_steps(vector<MyRect> &rectangles, vector<vector<MPD_Arc> > adjacency_list)
{
        FunctionTimer ft("stair_steps");

	vector<vector<MyRect> > solutions ; 
	vector<MyRect> rectangles_ = rectangles ;
	bool result = stair_steps_(rectangles_, adjacency_list) ;
	if (result)
		solutions.push_back(rectangles_) ;

/*
Cas des chaines:
+---+
|   |
|   |
|   +---+---+
|   |   |   |
| A | B | C |
+---+---+---+
si un element C n'est connecte que par un lien et que celui a qui il est connecte (B) l'est par deux liens, alors on essaye de connecter A avec C, car en s'enroulant
autour de A, B et C vont bien se retrouver l'un a cote de l'autre.

Detection des chaines : # liens == # rectangles - 1 (en retirant les liens self) et max(cardinality) == 2
*/
	int n = rectangles.size() ;
	vector<vector<int> > unoriented_adjacency_list(n) ;
	for (const auto& [i, j] : adjacency_list | views::join)
	{
		if (i == j)
			continue ;
		unoriented_adjacency_list[i].push_back(j) ;
		unoriented_adjacency_list[j].push_back(i) ;
	}

	int edge_count = 0 ;
	for (vector<int>& adj : unoriented_adjacency_list)
		edge_count += adj.size() ;
	edge_count /= 2 ;
	int max_cardinality = 0 ;
	for (vector<int>& adj : unoriented_adjacency_list)
		max_cardinality = std::max<int>(max_cardinality, adj.size()) ;

	if (edge_count == n - 1 && max_cardinality == 2)
	{
	// on a une chaine.
		for (int i=0; i<n; i++)
		{
			vector<int>& adj = unoriented_adjacency_list[i] ;
			if (adj.size() == 2)
			{
				adjacency_list[ adj[0] ].push_back( MPD_Arc{adj[0], adj[1]} ) ;
			}
		}

		vector<MyRect> rectangles_ = rectangles ;
		bool result = stair_steps(rectangles_, adjacency_list) ;
		if (result)
			solutions.push_back(rectangles_) ;
	}

	if (solutions.empty())
		return false ;

	rectangles = * ranges::min_element(solutions, {}, [](const vector<MyRect>& rectangles){return dim_max(compute_frame(rectangles)) ;}) ;
	MyRect frame = compute_frame(rectangles) ;
	for (MyRect &r : rectangles)
		translate(r, {-frame.m_left, -frame.m_top}) ;
	return true ;
}

vector<WidgetContext> composite_stair_steps_layout(vector<WidgetContext>& rectangles, const vector<vector<MPD_Arc> >& adjacency_list)
{
        FunctionTimer ft("composite_stair_steps_layout");
	int n = rectangles.size() ;
	vector<MyRect> vec(n) ;
	for (int i=0; i < n ; i++)
	{
		MyRect &r = vec[i] ;
		const WidgetContext &widget = rectangles[i] ;
		r = widget.r ;
		r.i = i ;
	}

	bool result = stair_steps(vec, adjacency_list) ;
	if (result)
	{
		vector<WidgetContext> rectangles_ = rectangles ;
		for (int i=0; i < vec.size(); i++)
		{
			MyRect &r = vec[i] ;
			WidgetContext &widget = rectangles_[i] ;
			int ri = widget.r.i ;
			widget.r = r ;
			widget.r.i = ri ;
		}
		return rectangles_ ;
	}
	else
	{
		MatrixXd W = MatrixXd::Zero(n,n) ;
		PermutationMatrix<Dynamic> perm(n) ;
		for (const auto [i, j] : adjacency_list | views::join)
		{
			W(i,j) = W(j,i) = 1 ;
		}
		Matrix<int8_t,-1,-1> OW = Matrix<int8_t,-1,-1>::Zero(n, n) ;	//Oriented Weights
		for (const auto [i, j] : adjacency_list | views::join)
		{
			OW(i, j) = 1 ;
		}
		vector<int> component_distribution ;
		minimum_cut(W,
					perm,
					component_distribution) ;
		int nc = component_distribution.size() ;
		int n_acc = 0 ;

		vector<WidgetContext> composite_widgets(nc) ;

		MatrixXd P = MatrixXd::Zero(n,nc) ;

		for (int i=0; i < nc; i++)
		{
			int np = component_distribution[i] ;
	//block(Index startRow, Index startCol, Index blockRows, Index blockCols)
			P.block(n_acc, i, np, 1) = MatrixXd::Constant(np, 1, 1) ;
			vector<vector<MPD_Arc> > my_adjacency_list = compute_adjacency_list_( (perm * OW * perm.transpose()).block(n_acc, n_acc, np, np) ) ;
			vector<WidgetContext> my_rectangles(np) ;
			Map<MatrixXw>(my_rectangles.data(), np,1) = (perm * Map<MatrixXw>(rectangles.data(), n,1)).block(n_acc, 0, np, 1) ;
			WidgetContext &widget = composite_widgets[i] ;
			widget.type = WidgetType::COMPOSITE_WIDGET ;
			widget.widgets = my_rectangles ;
			widget.widgets = composite_stair_steps_layout(my_rectangles, my_adjacency_list) ;
			vector<WidgetContext> &widgets = widget.widgets ;
			widget.r = compute_frame(vector<MyRect>(widgets.begin(), widgets.end())) ;
			widget.r.i = i ;
			n_acc += np ;
		}

		composite_widgets = composite_stair_steps_layout(composite_widgets, compute_adjacency_list(P.transpose() * (perm*W*perm.transpose()) * P)) ;

		return composite_widgets ;
	}
}


void rotate_composite(vector<WidgetContext>& rectangles, int rotation_bitmap)
{
        FunctionTimer ft("rotate_composite");

	vector<WidgetContext*> composites ;
	walk_composite(rectangles, [&](WidgetContext& widget){if (widget.type==WidgetType::COMPOSITE_WIDGET && widget.widgets.size()>1)composites.push_back(&widget);}) ;
	for (int index=0; index < composites.size(); index++)
	{
		int rotations = (rotation_bitmap >> (index * 2)) & 0x03 ;
		WidgetContext &widget = * composites[index] ;
		vector<WidgetContext> &widgets = widget.widgets ;
		MyRect frame = compute_frame(vector<MyRect>(widgets.begin(), widgets.end())) ;
		for (WidgetContext &child_widget : widgets)
		{
			if (rotations & 0x01)
			{
				child_widget.r = symmetric(child_widget.r, EAST_WEST, middle(frame, NORTH_SOUTH)) ;
			}
			if (rotations & 0x02)
			{
				child_widget.r = symmetric(child_widget.r, NORTH_SOUTH, middle(frame, EAST_WEST)) ;
			}
		}
	}
}


void translate_composite(vector<WidgetContext> &rectangles, MyPoint translation = {0,0})
{
	for (WidgetContext& widget : rectangles)
	{
		switch (widget.type)
		{
		case COMPOSITE_WIDGET:
			translate_composite(widget.widgets, translation + MyPoint{widget.r.m_left, widget.r.m_top}) ;
			break ;
		case RECTANGLE:
			translate(widget.r, translation) ;
			break ;
		} 
	}
}


void fit_together_composite(vector<WidgetContext>& rectangles)
{
        FunctionTimer ft("fit_together_composite");

	translate_composite(rectangles) ;

	vector<WidgetContext*> composites ;
	walk_composite(rectangles, [&](WidgetContext& widget){if (widget.type==WidgetType::COMPOSITE_WIDGET && widget.widgets.size()>1)composites.push_back(&widget);}) ;

	while (true)
	{
		unsigned int best_m ;
		int best_diameter = INT_MAX ;
		vector<MyRect> best_B ;
		MyPoint best_translation_B ;
		Direction best_direction ;

		int n = composites.size() ;
		for (unsigned int m=0; m < pow(2, n); m++)
		{
			vector<WidgetContext*> composite_partition[2] ;
			for (int i=0; i < composites.size(); i++)
			{
				composite_partition[m & (1 << i) ? 0 : 1].push_back(composites[i]) ;
			}

			for (Direction direction : directions)
			{
				vector<MyRect> B ;
				MyPoint translation_B ;
				int diameter ;
				fit_together(composite_partition,
							direction,
							B,
							translation_B,
							diameter) ;

				if (diameter < best_diameter)
				{
					best_m = m ;
					best_diameter = diameter ;
					best_B = B ;
					best_translation_B = translation_B ;
					best_direction = direction ;
				}
			}
		}

		unordered_set<MyRect> BB(best_B.begin(), best_B.end()) ;
		walk_composite(rectangles, [&](WidgetContext& widget){if (widget.type==WidgetType::RECTANGLE && BB.count(widget.r)) translate(widget.r, best_translation_B);}) ;
		if (best_translation_B==MyPoint{0,0} || best_B.empty())
			break ;
	}
}


void stair_steps_layout(vector<MyRect> &vect, const vector<vector<MPD_Arc> > &adjacency_list, int rect_border)
{
        FunctionTimer ft("stair_steps_layout");
	int n = vect.size() ;
	vector<WidgetContext> _rectangles(n) ;
	for (int i=0; i < n; i++)
	{
		WidgetContext &widget = _rectangles[i] ;
		MyRect &r = vect[i] ;
		widget.r = r ;
		widget.type = WidgetType::RECTANGLE ;
		widget.r.m_right += 2*rect_border ;
		widget.r.m_bottom += 2*rect_border ;
	}

	_rectangles = composite_stair_steps_layout(_rectangles, adjacency_list) ;

//TODO: essayer les symmetries autour les axes EAST_WEST et NORTH_SOUTH pour trouver la meilleure disposition cad celle qui minimize
// la longueur totale des liens. Ceci sans deformer les composites puisqu'on ne fait que des symmetries.
	int count = 0 ;
	walk_composite(_rectangles, [&](WidgetContext& widget){if (widget.type==WidgetType::COMPOSITE_WIDGET && widget.widgets.size()>1)count++ ;}) ;
//cap count otherwise the possibilities might become overwhelming.
	count = std::min(count, 3) ;
	int best_rotation_bitmap = -1 ;
	int min_total_distance = INT_MAX ;
	for (int rotation_bitmap=0; rotation_bitmap < pow(2, 2*NR_DIRECTIONS*count) ; rotation_bitmap++)
	{
		vector<WidgetContext> rects = _rectangles ;
		rotate_composite(rects, rotation_bitmap) ;
		rects = collapse_composite(rects) ;
		vector<MyRect> vec(n) ;
		for (WidgetContext& widget : rects)
		{
			MyRect &r = widget.r ;
			vec[r.i] = r ;
		}
		for (MyRect &r : vec)
		{
			expand_by(r, - rect_border) ;
		}

		MyRect frame = compute_frame(vec) ;
		for (MyRect &r : vec)
		{
			translate(r, {- frame.m_left,- frame.m_top}) ;
		}

//on verifie que les rectangles n'ont pas été permutés.
		int total_distance = 0 ;
		for (const auto& [i, j] : adjacency_list | views::join)
		{
			total_distance += rectangle_distance(vec[i], vec[j]) ;
		}
		if (total_distance < min_total_distance)
		{
			min_total_distance = total_distance ;
			best_rotation_bitmap = rotation_bitmap ;
		}
	}

	rotate_composite(_rectangles, best_rotation_bitmap) ;
	fit_together_composite(_rectangles) ;
	vector<WidgetContext> rectangles_ ;
	walk_composite(_rectangles, [&](WidgetContext& widget){if (widget.type==WidgetType::RECTANGLE)rectangles_.push_back(widget.r);}) ;
	_rectangles = rectangles_ ;
//	_rectangles = collapse_composite(_rectangles) ;
	vector<MyRect> vec(n) ;
	for (WidgetContext& widget : _rectangles)
	{
		MyRect &r = widget.r ;
		vec[r.i] = r ;
	}

        auto rg = adjacency_list | views::join ;
        vector<MPD_Arc> edges(begin(rg), end(rg));

	vector<tuple<int, RectCorner, int, RectCorner> > swaps ;
	do
	{
		swaps.clear() ;
		swap_rectangles(vec, edges, swaps) ;
	}
	while (!swaps.empty()) ;

	while (compact_rectangles(vec, adjacency_list)) ;

//call again after the calls to compact_rectangles()
	do
	{
		swaps.clear() ;
		swap_rectangles(vec, edges, swaps) ;
	}
	while (!swaps.empty()) ;

	compact_frame(vec, adjacency_list) ;
	optimize_rectangle_positions(vec, adjacency_list) ;
	compact_frame(vec, adjacency_list) ;

	for (MyRect &r : vec)
	{
		expand_by(r, - rect_border) ;
	}

	MyRect frame = compute_frame(vec) ;
	for (MyRect &r : vec)
	{
		translate(r, {- frame.m_left,- frame.m_top}) ;
	}

//on verifie que les rectangles n'ont pas été permutés.
	assert(ranges::equal(vec, vect, {}, [](MyRect& r){return dimensions(r);})) ;
	vect = vec ;
}


//interface for emscripten wasm
extern "C" {
const char* diagram_layout(int rect_border,
			const char* srects,
			const char* sedges)
{
	vector<MyRect> rectangles;
	int pos, nn;

	pos = 0;
    	MyRect r{0,0,0,0};
	while (sscanf(srects + pos, "%3hx%3hx%3hx%3hx%n", &r.m_left, &r.m_right, &r.m_top, &r.m_bottom, &nn) == 2)
	{
	//use variable 'MyRect.no_sequence' to keep the original position of the box.
	//keep in mind that variable 'MyRect.i' is used internally by some algorithms and cannot be used for that purpose.
		r.no_sequence = r.i = rectangles.size();
		rectangles.push_back(r);
		pos += nn;
	}
	
        vector<MPD_Arc> edges;
        pos = 0;
	MPD_Arc edge;
	while (sscanf(sedges + pos, "%3x%3x%n", &edge._i, &edge._j, &nn) == 2)
	{
		edges.push_back(edge);
		pos += nn;
	}

	printf("edges.size()=%zu\n", edges.size());
	printf("edge_count=%d\n", edge_count);

	int n=rectangles.size();

	vector<vector<MPD_Arc> > adjacency_list(n);
	for (MPD_Arc &edge : edges)
		adjacency_list[edge._i].push_back(edge);

	stair_steps_layout(rectangles, adjacency_list, rect_border);

	int printpos=0;
	static char buffer[100000];

	printpos += sprintf(buffer + printpos, "[\n");

	for (const MyRect& r : rectangles)
	{
		printpos += sprintf(buffer + printpos, "{\"id\":%d, \"x\":%d, \"y\":%d}%c\n", i, r.m_left, r.m_top,
                          &r == &rectangles.back() ? ' ' : ',');
	}

	printpos += sprintf(buffer + printpos, "]\n");
	
	return buffer;
}
}//extern "C"

int main(int argc, char* argv[])
{
/*
	const int n = 68;  //nb boxes
	const int max_nb_boxes_per_diagram = 20;
	const int edge_count = 60;
	const char* sedges = "00200700302300301b00400500502300600200803c00801500901b00a01b00b01300c02300d01b00e00f00f01301001101101b01302301402301501801902301901b01a01b01b03701b02c01c01b01e01b02001b02101102202602201102402302502802602302702302802402902302a02302b02302f02303001a03102803200503303203302803403503403003601b03703803803703903703902303b03703d00803e03c03f01b040013041043041008043023";
	const char* jsonLayout = diagram_layout(n, max_nb_boxes_per_diagram, edge_count, sedges);
	printf("%s", jsonAllocation);
*/
}

/*
Linux command to install eigen3 directory:
 sudo apt-get install libeigen3-dev
Linux command to lookup eigen3 directory:
 sudo find / -type d -name "eigen3"


To generate diagram_layout.wasm and diagram_layout.js:
emcc diagram_layout.cpp binpack.cpp KMeansRexCore.cpp compact_frame.cpp compact_rectangles.cpp fit_together.cpp MyRect.cpp optimize_rectangle_positions.cpp permutation.cpp swap_rectangles.cpp WidgetContext.cpp FunctionTimer.cpp MPD_Arc.cpp -o diagram_layout.js -I/usr/include/eigen3 -Wno-c++11-narrowing -s EXPORTED_FUNCTIONS='["_latuile"]' -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap"]' -s ALLOW_MEMORY_GROWTH=1  -s EXPORT_ES6=1 -s MODULARIZE=1 -s EXPORT_NAME="createLayoutModule"  -s TOTAL_STACK=32MB  -std=c++20

*/
