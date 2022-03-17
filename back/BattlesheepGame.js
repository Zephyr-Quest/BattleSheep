const Chrono = require("./chrono");

/**
 * Check if a position has been hitten during the game
 * @param {Number} x The row position
 * @param {Number} y The col position
 * @param {Number} playerId The playerId in this context
 * @param {Array} history All hitten case
 * @returns If the case is hitten
 */
function isInHistory(x, y, playerId, history) {
    let result = false;

    history.forEach(event => {
        if (event.x === x && event.y === y && event.playerId === playerId && event.state === 2)
            result = true;
    });

    return result;
}

module.exports = class BattleSheepGame {
    /**
     * The BattlesheepGame constructor
     * @param {number} roomId The room id where the game is playing
     */
    constructor (roomId) {
        // Data
        this.roomId = roomId;
        this.players = [];
        this.playerStartGrids = [];
        
        // Game state
        this.history = [];
        this.currentPlayer = 0;
        this.weaponsUsed = [];
        this.chrono = new Chrono();
        this.isGameFinished = false;
        this.lastEvent = null;
    }

    /**
     * Add a new player to the game
     * @param {string} username The player name
     */
    addPlayer(username) {
        this.players.push(username);
        this.playerStartGrids.push(undefined);
        this.weaponsUsed.push(new Array)
    }

    /**
     * Add a new event to the history
     * @param {Object} data The new event in the game
     */
    addToHistory(data) {
        // 'data' is an object which contains :
        // { x, y, playerId, state }
        this.history.push(data);

        // Check if the game is finished
        this.playerStartGrids.forEach((playerId, grid) => {
            let gridIsDestroyed = true;
            
            // Check if the whole grid is hitten
            for (let row = 0; row < grid.length; row++) {
                for (let col = 0; col < grid[row].length; col++) {
                    if (grid[row][col] && !isInHistory(col, row, playerId, this.history))
                        gridIsDestroyed = false;
                }
            }

            if (gridIsDestroyed) this.isGameFinished = true;
        });
    }
};