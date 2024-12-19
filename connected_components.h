#ifndef _CONNECTED_COMPONENTS_
#define _CONNECTED_COMPONENTS_

#include <vector>

//must be computed from unoriented graph
void connected_components(const std::vector<std::vector<MPD_Arc> >& adjacency_list,
			  std::vector<int>& connected_component);
			  
void compute_cc_distribution(const std::vector<int>& connected_component,
                          std::vector<int>& distribution);

#endif
