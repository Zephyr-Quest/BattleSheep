/* ---------------------------------- Data ---------------------------------- */

const weaponsName = ["Shears", "Strimmer", "Epidemic", "Wolf"];

/* ---------------------------- Weapons functions --------------------------- */

// Attack the grid
function attack(grid, type, x, y, history, playerId) {
    let result = [];
    
    switch (type) {
        case "Shears": result = hit(grid, x, y); break;
        case "Strimmer": result = radar(grid, x, y); break;
        case "Epidemic": result = submarine(grid, x, y); break;
        case "Wolf": result = torpedo(grid, x, y, history, playerId); break;
    }

    return result;
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
        return [];
    } else {
        return [{
            x: x,
            y: y,
            state: grid[y][x] ? 2 : 0 // 0 : empty, 1 : ship, 2 : hit
        }];
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
                    state: grid[j][i] ? 1 : 0 // 0 : nothing, 1 : ship visible
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
        return [];
    }

    // If the case is empty
    if (!grid[y][x]) {
        return [{
            x: x,
            y: y,
            state: 0
        }];
    }

    else {
        let result = [];
        let touched = 0;
        if (grid[y][x][1] == "c") {
            const size = Number(grid[y][x][0]);
            for (let i = Math.max(0, x - size); i <= Math.mix(10, x + size); i++) {
                if (grid[y][i][1] === "c" && Number(grid[y][i][0]) === size) {
                    checkHistory(history, i, y, playerId)['state'] === 2 ? touched++ : 0;
                    result.push({
                        x: i,
                        y: y,
                        state: 2
                    });
                }
            }
        }
        else {
            for (let i = Math.max(y - size, 0); i <= Math.min(y + size, 10); i++) {
                if (grid[i][x][1] === "r" && Number(grid[i][x][0]) === size) {
                    checkHistory(history, x, i, playerId)['state'] === 2 ? touched++ : 0;
                    result.push({
                        x: i,
                        y: y,
                        state: 2
                    });
                }
            }
        }

        if (touched === 2) {
            return result;
        } else if (touched > 2) {
                return result.slice(0, 2);
            } else {
            return [{
                x: x,
                y: y,
                state: 2
                }]
            }


    }

    return result;
}

// Submarine
// Destroy a circle of 2 cases
function submarine(grid, x, y) {
    // Check if the coordonate is on the grid
    if (x < 0 || x > 9 || y < 0 || y > 9) {
        return [];
    }
    let results = [];
    for (let i = Math.max(x, x - 2); i < Math.min(x, x + 2); i++) {
        for (let j = Math.max(y, y - 2); j < Math.min(y, y + 2); j++) {
            results.push({
                x: i,
                y: j,
                state: grid[j][i] ? 2 : 0 // 0 : empty, 1 : ship, 2 : hit
            });
        }
    }
    return results;
}


/* ----------------------------- Utils function ----------------------------- */

function checkHistory(history, x, y, playerId) {
    for (let i = 0; i < history.length; i++) {
        if (history[i].x == x && history[i].y == y && history[i].playerId == playerId) {
            return history[i];
        }
    }
    return undefined;
}

/**
 * Check if coords are in the grid
 * @param {Number} x The x coord
 * @param {Number} y The y coord
 * @returns If coords are valid
 */
const isCoordValid = (x, y) => x >= 0 && x < 10 && y >= 0 && y < 10;

/**
 * Check if the name of a weapon is known
 * @param {String} name The weapon name to check
 * @returns If the weapon is a correct one
 */
const isWeapon = name => weaponsName.includes(name);

module.exports = { attack, isCoordValid, isWeapon };