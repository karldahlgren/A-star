# A*

[![][license img]][license]

## About
The project is a A* implementation in Javascript and [D3](http://d3js.org/). The user can manipulate the board by adding walls and paths.
The user can then trigger a search for the shortest path. The board will displayed which cells has been searched and which cells is being
considered to be searched. The shortest path will be displayed if found.

## Instructions
* Draw walls: Right click
* Remove walls: Right click + Left shift
* Set start point: Right click + Left ctrl
* Set end point: Right click + Left alt
* Start search: S
* Reset search: R
* Clear walls: C

## Cell types
* Yellow: Starting point
* Pink: End point
* Green: Cells currently present in the open list
* Red: Cells currently present in the close list
* Blue: The shortest path between start- and endpoint

## Live example:
[http://karl.dahlgren.info/projects/astar](http://karl.dahlgren.info/projects/astar)

## License

The code is **licensed** under the **[MIT License](https://github.com/karldahlgren/a-star/blob/master/LICENSE)**. The terms of the license are as follows:

    The MIT License

    Copyright (c) 2016, Karl Dahlgren

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.


[license]:LICENSE
[license img]:https://img.shields.io/badge/MIT-License%202-blue.svg
