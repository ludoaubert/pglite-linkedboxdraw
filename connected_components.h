#ifndef _CONNECTED_COMPONENTS_
#define _CONNECTED_COMPONENTS_

#include <vector>
#include <string>

std::string JSON_stringify(const std::vector<int>& v);

std::string JSON_stringify(const std::vector<double>& v);

//must be computed from unoriented graph
void connected_components(const std::vector<std::vector<MPD_Arc> >& adjacency_list,
			  std::vector<int>& connected_component);
			  
void compute_cc_distribution(const std::vector<int>& connected_component,
                          std::vector<int>& distribution);

#endif
