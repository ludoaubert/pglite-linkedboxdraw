#include <vector>
#include "MyRect.h"
#include <Eigen/Core>
#include <Eigen/Eigenvalues>


typedef Eigen::Matrix<MyRect,Eigen::Dynamic,Eigen::Dynamic> MatrixXr ;

typedef Eigen::Matrix<int, Eigen::Dynamic, Eigen::Dynamic> MatrixXi;


std::vector<std::vector<MPD_Arc> > compute_adjacency_list_(const Eigen::Matrix<int8_t,-1,-1>& OW);

std::vector<std::vector<MPD_Arc> > compute_adjacency_list(const MatrixXd& OW);

void connected_components(const std::vector<std::vector<MPD_Arc> >& adjacency_list,
			  std::vector<int>& connected_component);

std::string JSON_stringify(const std::vector<int>& v);

std::string JSON_stringify(const std::vector<double>& v);

std::string serialise(const Eigen::MatrixXd& W);

bool minimum_cut(const MatrixXd& W, 
		Eigen::PermutationMatrix<Eigen::Dynamic>& perm2, 
		std::vector<int> &component_distribution);

