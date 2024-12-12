#include <vector>
#include <Eigen/Core>
#include <Eigen/Eigenvalues>


std::vector<std::vector<MPD_Arc> > compute_adjacency_list_(const Eigen::Matrix<int8_t,-1,-1>& OW);

std::vector<std::vector<MPD_Arc> > compute_adjacency_list(const Eigen::MatrixXd& OW);

void connected_components(const std::vector<std::vector<MPD_Arc> >& adjacency_list,
			  std::vector<int>& connected_component);

std::string JSON_stringify(const std::vector<int>& v);

std::string JSON_stringify(const std::vector<double>& v);

std::string serialise(const Eigen::MatrixXd& W);

bool minimum_cut(const Eigen::MatrixXd& W, 
		Eigen::PermutationMatrix<Eigen::Dynamic>& perm2, 
		std::vector<int> &component_distribution);

