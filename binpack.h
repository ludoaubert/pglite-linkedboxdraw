/* binpack.h
*
* Copyright (c) 2005-2025 Ludovic Aubert. ALL RIGHTS RESERVED.
* ludo.aubert@gmail.com
* This file should not be transmitted nor published.
*
*/
#ifndef _BINPACK_
#define _BINPACK_


#include "MyRect.h"
#include <vector>

void test_binpack() ;
void test_split_and_fit() ;

void binpack(std::vector<MyRect>& rectangles, int& w, int& h) ;

#endif
