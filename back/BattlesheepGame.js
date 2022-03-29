const Chrono = require("./chrono");

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
        this.scores = [];
    }

    /**
     * Add a new player to the game
     * @param {string} username The player name
     */
    addPlayer(username) {
        this.players.push(username);
        this.playerStartGrids.push(undefined);
        this.weaponsUsed.push(new Array)
        this.scores.push(0);
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
        this.playerStartGrids.forEach((grid, playerId) => {
            let gridIsDestroyed = true;
            
            // Check if the whole grid is hitten
            for (let x = 0; x < grid.length; x++) {
                for (let y = 0; y < grid.length; y++) {
                    if (grid[y][x] && !this.isInHistory(x, y, playerId, this.history))
                        gridIsDestroyed = false;
                }
            }

            if (gridIsDestroyed) this.isGameFinished = true;
        });
    }

    /**
     * Check if a position has been hitten during the game
     * @param {Number} x The row position
     * @param {Number} y The col position
     * @param {Number} playerId The playerId in this context
     * @returns If the case is hitten
     */
    isInHistory(x, y, playerId) {
        let result = false;

        this.history.forEach(event => {
            if (event.x === x && event.y === y && event.playerId === playerId && event.state === 2)
                result = true;
        });

        return result;
    }
};