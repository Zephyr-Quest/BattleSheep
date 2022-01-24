class grid {

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

    displayGrid() {
        let playerString = "";
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                playerString += (this.grid[row][col] === undefined ? "U" : this.grid[row][col]);
                playerString += (col < this.gridSize - 1 ? " " : "\n");
            }
        }
        console.log("Player grid :");
        console.log(playerString);
    }

    resetGrid() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                this.grid[row][col] = undefined;
            }
        }
    }

    isFree(row, col) {
        return (this.grid[row][col] === undefined ? true : false);
    }

    setCase(row, col, value) {
        this.grid[row][col] = value;
    }
}