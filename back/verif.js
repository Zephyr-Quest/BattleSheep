/**
 * Battle Ship
 * this file contains all the verification functions for the game and the server
 * - is_grid_valid
 * - is_ship_position_on_grid_valid
 * - is_ship_hit
 * - is_ship_sunk
 * - update_grid 
 * Size of the grid is 10x10
 * Ship size :
 * - 4 ship of size 1
 * - 3 ship of size 2
 * - 2 ship of size 3
 * - 1 ship of size 4
 * 
 * Rules :
 * - The grid is filled with undefined
 * - When ships are placed, the grid countain the ship size
 * - When a ship is hit, the case is changed to -1
 * - When a ship is sunk, the ship is removed from the grid 
 * - Weapon :
 * - Classical shot : 1 case
 * - Radar : discover a circle of 3 cases
 * - Torpedo : destroy a line of 2 cases
 * - Submarine : destroy a circle of 2 cases
 */

// Set a 10x10 grid filled with undefined
function init_grid() {
    var grid = [];
    for (var i = 0; i < 10; i++) {
        grid[i] = [];
        for (var j = 0; j < 10; j++) {
            grid[i][j] = undefined;
        }
    }
    return grid;
}

grid = init_grid();

/**
 * Update the grid with the ship
 */
function update_grid(grid, ship) {
    let i = ship.position.x;
    let j = ship.position.y;
    let size = ship.size;
    let direction = ship.direction;
    let ship_grid = ship.grid;
    for (let k = 0; k < size; k++) {
        if (direction == "row") {
            grid[i][j] = ship_grid[k];
            j++;
        } else {
            grid[i][j] = ship_grid[k];
            i++;
        }
    }
    return grid;
}

/**
 * Check if the ship is hit
 */
function is_ship_hit(grid, ship) {
    let i = ship.position.x;
    let j = ship.position.y;
    let size = ship.size;
    let direction = ship.direction;
    for (let k = 0; k < size; k++) {
        if (direction == "row") {
            if (grid[i][j] == -1) return true;
            j++;
        } else {
            if (grid[i][j] == -1) return true;
            i++;
        }
    }
    return false;
}

// Hit with normal shot
function hit(grid, x, y) {
    grid[x][y] = -1;
    return grid;
}

// Hit with radar
function radar(grid, x, y) {
    grid[x][y] = -1;
    grid[x + 1][y] = -1;
    grid[x - 1][y] = -1;
    grid[x][y + 1] = -1;
    grid[x][y - 1] = -1;
    return grid;
}


/**
 * Check if the position of the ship is valid and update the grid
 */
function is_ship_position_on_grid_valid(grid, ship) {
    rotation = ship.direction;
    position = ship.first_position;
    size = ship.size;

    // Check if the ship is on the grid
    if (rotation == "row") {
        if (position[0] + size > 10) {
            return false;
        }
    } else if (rotation == "col") {
        if (position[1] + size > 10) {
            return false;
        }
    }

    // Check if the ship is not on another ship
    for (var i = 0; i < size; i++) {
        if (rotation == "row") {
            if (grid[position[0] + i][position[1]] != undefined) {
                return false;
            }
        } else if (rotation == "col") {
            if (grid[position[0]][position[1] + i] != undefined) {
                return false;
            }
        }
    }

    return true;
}