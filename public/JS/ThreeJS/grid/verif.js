/* -------------------------------------------------------------------------- */
/*                                 Verif file                                 */
/* -------------------------------------------------------------------------- */

/* ---------------------------------- Rules --------------------------------- */

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

import { sheep } from './sheep.js';

/* --------------------------- Check grid function -------------------------- */

// Check if a grid is valid
function check_grid(grid) {
    let count = 0; // Count the number of ship
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (grid[i][j] != undefined) {
                count++;
            }
        }
    }
   return count === 20;
}

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

/**
 * Check if the ship is on the grid
 * @param {Array} grid
 * @param {Object} ship
 * @returns {Boolean} if
 */
function update_grid(grid, ship) {
    let i = ship.position.x;
    let j = ship.position.y;
    let size = ship.size;
    let result = [];
    let direction = ship.direction;
    let ship_grid = ship.grid;
    for (let k = 0; k < size; k++) {
        if (direction == "row") {
            results[i][j] = ship_grid[k];
            j++;
        } else {
            results[i][j] = ship_grid[k];
            i++;
        }
    }
    return (grid, results);
}


// Wrapper for is_ship_position_on_grid_valid
function wrapPosition(grid, x, y, size, rotation) {
    const position = {
        x,
        y
    }
    const ship = new sheep(size, rotation, position);
    return isPositionValid(grid, ship);
}

/**
 * Check if the position of the ship is valid and update the grid
 */
function isPositionValid(grid, ship) {
    let rotation = ship.direction;
    let position = ship.firstPosition;
    let size = ship.sheepSize;
    // Check if the ship is on the grid
    if (rotation == "col") {
        if (position.x + size > 10) {
            return false;
        }
    } else if (rotation == "row") {
        if (position.y + size > 10) {
            return false;
        }
    }

    // Check if the ship is not on another ship
    for (let i = 0; i < size; i++) {
        if (rotation == "col") {
            if (grid[position.x + i][position.y] !== undefined) {
                return false;
            }
        } else if (rotation == "row") {
            if (grid[position.x][position.y + i] !== undefined) {
                return false;
            }
        }
    }

    return true;
}


/* ---------------------------- Weapons functions --------------------------- */



// Attack the grid
function attack(grid, type, x, y) {
    if (type == "shears") {
        return hit(grid, x, y);
    } else if (type == "radar") {
        return radar(grid, x, y);
    } else if (type == "torpedo") {
        return torpedo(grid, x, y);
    } else if (type == "submarine") {
        return submarine(grid, x, y);
    }
    return false;
}

/**
 * Hit with a normal shot
 * @param {Object} grid 
 * @param {Number} x coordonate x
 * @param {Number} y coordonate y
 * @returns list of the case seen by the event
 */
function hit(grid, x, y) {
    // Check if the coordonate is on the grid
    if (x < 0 || x > 9 || y < 0 || y > 9) {
        return false;
    } else {
        return {
            x: x,
            y: y,
            state: grid[x][y] == undefined ? 0 : 2 // 0 : empty, 1 : ship, 2 : hit
        }
    }
}


// Return the case shown by the radar
function radar(grid, x, y) {
    let result = [];
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                result.push({
                    x: i,
                    y: j,
                    state: grid[i][j] == undefined ? 0 : 1 // 0 : nothing, 1 : ship visible
                });
            }
        }
    }
    return result;
}

// Torpedo
// Détruit un bateau s'il reste 2 cases à détruire
function torpedo(grid, x, y, history, playerId) {

    // Check if the coordonate is on the grid
    if (x < 0 || x > 9 || y < 0 || y > 9) {
        return false;
    }

    // If the case is empty
    if (grid[x][y] == undefined) { 
        return [{
            x: x,
            y: y,
            state: 0
        }];
    }

    // else {
    //     let result = [];
    //     let touched = 0;
    //     if (grid[x][y][1] == "c") {
    //         for (let i = x - grid[x][y][0]; i <= x + grid[x][y][0]; i++) {
    //             if true {
    //         true
    //     }
    // }

    // let result = [];
    // for (let i = max(x, x - 1); i < min(x, x + 1); i++) {
    //     // Check if a ship is on the case
    //     if (i >= 0 && i < 10) {
    //         if (grid[i][y] != undefined) {
    //             result.push({
    //                 x: i,
    //                 y: y,
    //                 state: false
    //             });
    //         };
    //     }
    // }
    // return result;
}

// Submarine
// Destroy a circle of 2 cases
function submarine(grid, x, y) {
    // Check if the coordonate is on the grid
    if (x < 0 || x > 9 || y < 0 || y > 9) {
        return false;
    }
    let results = [];
    for (let i = max(x, x - 2); i < min(x, x + 2); i++) {
        for (let j = max(y, y - 2); j < min(y, y + 2); j++) {
            results.push({
                x: i,
                y: j,
                state: grid[i][j] == undefined ? 0 : 2 // 0 : empty, 1 : ship, 2 : hit
            });
        }
    }
    return (grid, results);
}


/* ----------------------------- Utils function ----------------------------- */

function checkHistory(history, x, y, playerId) {
    for (let i = 0; i < history.length; i++) {
        if (history[i].x == x && history[i].y == y && history[i].playerId == playerId) {
            return history[i];
        }
    }
    return undefined;
};

export { wrapPosition };