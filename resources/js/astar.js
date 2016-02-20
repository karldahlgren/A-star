/*
 * The MIT License
 *
 * Copyright (c) 2016 Karl Dahlgren
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */


// Define global variables
var width = 960;
var height = 500;
var size = 20;
var radius = size / 2;
var rows = Math.ceil(height / size);
var cols = Math.ceil(width / size);
var openList = [];
var closeList = [];
var searchOngoing = false;

var rectx = function(dimension) { return dimension.x - radius; };
var recty = function(dimension) { return dimension.y - radius; };

var cells = d3.range(0, rows * cols).map(function (dimension) {
    var col = dimension % cols;
    var row = (dimension - col) / cols;
    return {
        row: row,
        column: col,
        x: col * size + radius,
        y: row * size + radius,
        parent: null,
        type: ((col == 0 || col == cols - 1 || row == 0 || row == rows - 1) ? "border" : "void")
    };
});

// Create SVG board
var board = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// Create cells
var cell = board.selectAll(".cell")
    .data(cells)
    .enter().append("rect")
    .attr("class", function(dimension) { return "cell " + ((dimension.column == 0 || dimension.column == cols - 1 || dimension.row == 0 || dimension.row == rows - 1) ? "border" : "void"); })
    .attr("x", rectx)
    .attr("y", recty)
    .attr("width", size)
    .attr("height", size)
    .each(function(dimension) {
        dimension.elnt = d3.select(this);
    });


// Register event listeners
board.on("contextmenu", function(data, index) {
    d3.event.preventDefault(); // Prevent the menu to be displayed upon right click
});

board.on("mouseup", handleMouseUpEvent);

board.selectAll(".void, .wall")
    .on("click", handleMouseClickEvent)
    .on("mousedown", handleMouseDownEvent)
    .on("keydown", handleKeyDownEvent);

d3.select("body").on("keydown", handleKeyDownEvent);


// Set default start and end cells
var startCell = cells[98];
var endCell = cells[1101];
changeClass(startCell, "start");
changeClass(endCell, "end");

/**
 * The function provides the functionality to change a cell class
 * @param cell The cell that will be affected by the change
 * @param clazz The new class that will be assigned to the provided cell.
 */
function changeClass(cell, clazz){
    if(clazz == "void"){
        cell.elnt.classed("void", true).classed("wall", false).classed("open", false).classed("close", false).classed("path", false).classed("start", false).classed("end", false);
    } else if(clazz == "wall"){
        cell.elnt.classed("void", false).classed("wall", true).classed("open", false).classed("close", false).classed("path", false).classed("start", false).classed("end", false);
    } else if(clazz == "open"){
        cell.elnt.classed("void", false).classed("wall", false).classed("open", true).classed("close", false).classed("path", false).classed("start", false).classed("end", false);
    } else if(clazz == "close"){
        cell.elnt.classed("void", false).classed("wall", false).classed("open", false).classed("close", true).classed("path", false).classed("start", false).classed("end", false);
    } else if(clazz == "path"){
        cell.elnt.classed("void", false).classed("wall", false).classed("open", false).classed("close", false).classed("path", true).classed("start", false).classed("end", false);
    } else if(clazz == "start"){
        cell.elnt.classed("void", false).classed("wall", false).classed("open", false).classed("close", false).classed("path", false).classed("start", true).classed("end", false);
    }  else if(clazz == "end"){
        cell.elnt.classed("void", false).classed("wall", false).classed("open", false).classed("close", false).classed("path", false).classed("start", false).classed("end", true);
    }
}


/**
 * The function is responsible for handling the mouse click event. The method
 * will determine if it is a left click or a right click.
 *
 * A wall will be drawn in the cell in case of a left click.
 * A right click will remove a wall if it is present.
 *
 * @param cell The cell that gets affected by the click event.
 */
function handleMouseClickEvent(cell){
    handleMouseEvent(cell);
}

/**
 * The function is responsible for handling the mouse move event.
 * The function will add or remove a wall to a cell.
 *
 * @param cell The cell that will be affected by the move event
 */
function handleMouseMoveEvent(cell){
    handleMouseEvent(cell);
}


/**
 * The function is responsible for handling the mouse down event.
 * The function will register a mousemove listener, which will draw
 * or remove walls in cells.
 */
function handleMouseDownEvent(){
    board.selectAll(".void, .wall, .start, .end").on("mousemove", handleMouseMoveEvent);
}


/**
 * The function is responsible for handling the mouse up event.
 * The method will cancel the ongoing drawing or removal of walls.
 * This function achieved by removing the mousemove listener.
 */
function handleMouseUpEvent(){
    board.selectAll(".void, .wall, .start, .end").on("mousemove", null);
}

/**
 * The function will handle incoming mouse events.
 * A wall will be added if shift is not pressed and a wall will be removed
 * if shift is being pressed down.
 * The starting point will be set if the user click the left button and
 * @param cell The cell that will be affected
 */
function handleMouseEvent(cell){
    // Prevents the user to change the board during an ongoing search.
    if(searchOngoing){
        return;
    }



    if (d3.event.shiftKey) {
        changeClass(cell, "void");
        cell.type = "void";
    } else if(d3.event.ctrlKey) {
        changeClass(startCell, "void");
        startCell = cell;
        changeClass(startCell, "start");
    } else if(d3.event.altKey) {
        changeClass(endCell, "void");
        endCell = cell;
        changeClass(endCell, "end");
    } else {
        changeClass(cell, "wall");
        cell.type = "wall";
    }
}

/**
 * The function is responsible to handle all keydown events. The function
 * will map the following keys:
 * <ul>
 *     <li>Number 1 (Keycode = 49): Set start point</li>
 *     <li>Number 2 (Keycode = 50): Set end point</li>
 *     <li>S (Keycode = 83): Start search</li>
 *     <li>R (Keycode = 82): Reset search</li>
 *     <li>R (Keycode = 82): Reset search</li>
 *     <li>C (Keycode = 67): Clear walls</li>
 * </ul>
 */
function handleKeyDownEvent(){
    if(d3.event.keyCode == 49){
        // Number 1: Set start point
    } else if(d3.event.keyCode == 50){
        // Number 2: Set end point
    } else if(d3.event.keyCode == 83){
        // Character S: Start search
        startSearch();
    } else if(d3.event.keyCode == 82){
        // Character R: Reset search
        resetSearch();
    } else if(d3.event.keyCode == 67){
        // Character C: Clear walls
        clearWalls();
    }
}

/**
 * The function provides the functionality to reset a done or ongoing search.
 */
function resetSearch(){
    cells.forEach(function(cell){
        if(cell != startCell && cell != endCell && cell.type == "void"){
            changeClass(cell, "void");
        }
    });
    openList = [];
    closeList = [];
    changeClass(startCell, "start");
    changeClass(endCell, "end");
    searchOngoing = false;
}

/**
 * The function provides the functionality to remove all the walls from the board.
 */
function clearWalls(){
    if(searchOngoing){
        return;
    }

    cells.forEach(function(cell){
        if(cell.type == "wall"){
            cell.type = "void";
            changeClass(cell, "void");
        }
    });
}

/**
 * Calculates the length (Manhattan way) between two different cells.
 * The function will calculate the width and height between the two cells
 * and then use pythagorean theorem to calculate the hypotenuse, which will
 * be the manhattan way.
 * @param cell1 The first cell
 * @param cell2 The second cell
 * @returns {number} Returns the length between the first and second cell.
 */
function calcuateLength(cell1, cell2){
    var width = Math.abs(cell1.row - cell2.row);
    var height = Math.abs(cell1.column - cell2.column);
    return Math.sqrt(width * width + height * height);
}

/**
 * The function provides the functionality to start the search for the
 * shortest path between two cells.
 * @see startCell
 * @see endCell
 */
function startSearch(){
    // Prevents the user to start a new search when a search is currently ongoing.
    // This will also be used to prevent the user to start a new search when a previous
    // search has been complected. The user has to reset the search before starting a
    // new one.
    if(searchOngoing){
        return;
    }

    searchOngoing = true;
    openList.push(startCell);
    d3.timer(update);
}

/**
 * The function is used to determine if two cells are connected or not.
 * The function won't check the type of the cell. It will only check if
 * two cells are connected.
 * @param cell1 The first cell
 * @param cell2 The second cell
 * @returns {boolean} Returns true if the two cells (cell1 and cell2) are connected. Returns false otherwise.
 *          False will also be returned if cell1 and cell2 is actually the same cell.
 */
function isConnected(cell1, cell2){
    if(cell1 == cell2){
        return false;
    }

    var distanceX = Math.abs(cell1.row - cell2.row);
    var distanceY = Math.abs(cell1.column - cell2.column);

    if(distanceX > 1 || distanceY > 1){
        return false;
    }

    return true;
}

/**
 * The function provides the functionality to find all connected cells that fulfils these requirements:
 * <ul>
 *     <li>The cell needs to be connected with the provided cell (currentCell).</li>
 *     <li>The connected cell cannot be a wall.</li>
 *     <li>The connected cell cannot be a boarder.</li>
 *     <li>The connected cell cannot be in the closed list</li>
 *     <li>The connected cell cannot be in the open list</li>
 * </ul>
 *
 * The function will calculate the following values for each connected cell that will be returned:
 * <ul>
 *     <li>G: Cost to move from the current node from the start node</li>
 *     <li>H: Cost to move from the current node to the goal node</li>
 *     <li>F: G + H</li>
 * </ul>
 * These values will be used to determine which of these cells are closest to the end cell.
 *
 * @param currentCell The function provides the functionality to find all connecting cells to
 *                    the provided currentCell.
 * @returns {Array} An array with all the connect cells that meet the requirements mention above.
 */
function getConnectedCells(currentCell){

    var connectedCells = [];

    cells.forEach(function(cell){
        if(isConnected(currentCell, cell)){
            var inCloseList = closeList.indexOf(cell) != -1;

            if(!inCloseList && cell.type == "void"){
                var inOpenList = openList.indexOf(cell) != -1;
                var g = currentCell.g != null ? currentCell.g + 1 : 1;
                var h = calcuateLength(cell, endCell);
                var f = g + h;

                if(!inOpenList){
                    // Add the cell if it is not present in the open list
                    cell.g = g;
                    cell.h = h;
                    cell.f = f;
                    cell.parent = currentCell;
                    connectedCells.push(cell);
                } else if(openList && cell.f > f) {
                    // Update the values to the cell if it is present in the openList and
                    // the new values are less than the current values.
                    cell.g = g;
                    cell.h = h;
                    cell.f = f;
                    cell.parent = currentCell;
                }
            }
        }
    });


    connectedCells.forEach(function(cell){

    });

    return connectedCells;
}

/**
 * The function provides the functionality to sort the openList. The list will be sorted
 * so that the cell with the lowest F will be at the end of the list. The cell with the
 * height will be in the beginning of the list.
 */
function sortOpenList(){
    openList.sort(function(a,b){
        // Sort the list so that the item with the lowest F value goes to the end of the list
        return b.f - a.f;
    });
}

/**
 * The function is used to display the shortest path when (or if) it has been found.
 * The function will backtrace from the end cell back to the start cell.
 */
function displayPath(){
    var currentCell = endCell;
    while(currentCell.parent != null){
        changeClass(currentCell, "path");
        currentCell = currentCell.parent;
    }
    changeClass(startCell, "start");
    changeClass(endCell, "end");
}

/**
 * The update function is used to update the current status of the search. The function
 * is the heart of the search and will be recursively until the shortest path has been
 * found or if it was unable to find it. The function does the following steps to find
 * the shortest path:
 * <ul>
 *     <li>Check if the search is still ongoing. If not, the update loop will be cancelled.</li>
 *     <li>Check if the open list is empty. If so, stops the search since no path could be found.</li>
 *     <li>Get the cell with the lowest F value.</li>
 *     <li>Check if the cell is the same as the end cell. If so, stops the search since a path has been found between the start and end cell.</li>
 *     <li>Find all connecting cells and add them to the open list.</li>
 *     <li>Sort open list.</li>
 *     <li>Do a recursive call to itself.</li>
 * </ul>
 * @returns {boolean}
 */
function update(){
    // If the search has been cancelled, then cancel the update loop
    if(!searchOngoing){
        return true;
    }

    // Empty list. Unable to find path. Stop the search
    if(openList.length == 0){
        return true;
    }

    var currentCell = openList.pop();
    closeList.push(currentCell);
    // Path was found. Stop the search
    if(currentCell == endCell){
        displayPath();
        return true;
    }

    changeClass(currentCell, "close");

    var connectedCells = getConnectedCells(currentCell);
    connectedCells.forEach(function(cell){
        openList.push(cell);
        changeClass(cell, "open");
    });

    sortOpenList();
    d3.timer(update, 5);
    return true;
}
