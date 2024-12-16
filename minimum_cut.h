#include <string>
#include <vector>
#include "MPD_Arc"

struct NodeAllocation{
	int i;
	std::string chemin ; //example : ".01.02.01"
};

//Input
extern std::vector<int> nodes ;
extern std::vector<MPD_Arc> edges ;
//Output
extern std::vector<NodeAllocation> allocation;
extern int max_nb_boxes_per_diagram;


std::vector<std::vector<MPD_Arc> > compute_adjacency_list_(const Eigen::Matrix<int8_t,-1,-1>& OW);

std::vector<std::vector<MPD_Arc> > compute_adjacency_list(const MatrixXd& OW);

std::string JSON_stringify(const std::vector<int>& v);

std::string JSON_stringify(const std::vector<double>& v);

bool rec_minimum_cut(const std::string &chemin);

