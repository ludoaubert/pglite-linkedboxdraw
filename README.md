# linkedboxdraw

# Edition of relational diagrams, web based, local first using pglite. 

Typical use case:

Just been hired on a software (or data) project. You need to quickly understand how the data is structured. With linkedboxdraw, you can quickly create your own map.
To look at an example of map : https://ludoaubert.github.io/pglite-linkedboxdraw/table_edit_ti.html

The source data for this example is located here:
https://github.com/ludoaubert/pglite-linkedboxdraw/diagdata.js
In order to create your own, you can start by duplicating this file, and replace the cte listings by your own data, and make sure the syntax is valid PostgreSQL syntax.

You can then proceed to load the diagram file by pressing the "File Choose" button in the "File Input" section of https://ludoaubert.github.io/pglite-linkedboxdraw/table_edit_ti.html

It is also possible to edit the geometric information in two ways.
1) by moving a box (click and drag), which will also trigger a recomputation of the geometric links.
2) by updating the repartition: The repartition table holds the cluster number for each box. By updating it and pressing "Apply Repartition", you can move a box from one cluster to another.

Cut links: geometric links do not cross cluster boundaries. Links are also materialized using field color matching.

Used Technology:

The project depends on Eigen https://eigen.tuxfamily.org/ for the clustering (minimum cut) algorithm.
The project uses pglite https://pglite.dev/ as local first db.
It is deployed on github.io.
The Algorithms are implemented in C++ and compiled to Web Assemblies for easy deployment on the web.
