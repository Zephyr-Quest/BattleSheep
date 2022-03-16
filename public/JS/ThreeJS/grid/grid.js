/* -------------------------------------------------------------------------- */
/*                          Represent a general grid                          */
/* -------------------------------------------------------------------------- */
export class grid {

    constructor() {
        this.gridSize = 10;

        this.grid = new Array;
        for (let row = 0; row < this.gridSize; row++) {
            this.grid[row] = new Array;
            for (let col = 0; col < this.gridSize; col++) {
                this.grid[row][col] = undefined;
            }
        }
    }

    /**
     * Display grid in console
     */
    displayGrid() {
        let playerString = "";
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                playerString += (this.grid[row][col] === undefined ? "U " : this.grid[row][col]);
                playerString += (col < this.gridSize - 1 ? " " : "\n");
            }
        }
        console.log("Player grid :");
        console.log(playerString);
    }

    /**
     * Reset the grid
     */
    resetGrid() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                this.grid[row][col] = undefined;
            }
        }
    }

    /**
     * Check if a case if free or not
     * @param {Number} row row of the grid
     * @param {Number} col column of the grid
     * @returns {Boolean} true if there's nothing, false else
     */
    isFree(row, col) {
        return (this.grid[row][col] === undefined ? true : false);
    }

    /**
     * Set a case of the grid
     * @param {Number} row row of the grid to set
     * @param {Number} col column of the grid to set
     * @param {Number} value size of the sheep
     */
    setCase(row, col, value) {
        this.grid[row][col] = value;
    }

    /**
     * Get a simple grid to ThreeJS
     * @returns The final grid
     */
    getSimpleGrid() {
        let result = new Array();

        for (let row = 0; row < this.gridSize; row++) {
            result[row] = new Array();
            for (let col = 0; col < this.gridSize; col++)
                result[row][col] = this.grid[row][col] ? 1 : 0;
        }

        return result;
    }
};