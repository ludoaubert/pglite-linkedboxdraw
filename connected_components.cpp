#include <vector>
#include <string>
#include "MPD_Arc.h"
#include "connected_components.h"
using namespace std;

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


void compute_cc_distribution(const std::vector<int>& connected_component,
                          std::vector<int>& distribution)
{
  for (int c : connected_component)
    distribution[c]++;
}

