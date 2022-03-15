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
};