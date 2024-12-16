#include <string>
#include <vector>
#include "MPD_Arc.h"

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


std::string JSON_stringify(const std::vector<int>& v);

std::string JSON_stringify(const std::vector<double>& v);

bool rec_minimum_cut(const std::string &chemin);

