class playerGrid extends grid {
    constructor() {
        super();
        this.nbSheep = 10;

        // Set grid
        const playerGrid = document.getElementById("playerGrid");
        for (let row = 0; row < this.gridSize; row++) {
            const tr = document.createElement('tr');
            for (let col = 0; col < this.gridSize; col++) {
                const td = document.createElement('td');
                td.id = ["p", row, col];
                tr.appendChild(td);
            }
            playerGrid.appendChild(tr);
        }
        this.displayOnScreen();
        this.displayGrid();
    }
    
    displayOnScreen() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const currentTd = document.getElementById(["p", row, col]);
                currentTd.innerHTML = (this.grid[row][col] === undefined ? "" : this.grid[row][col]);
            }
        }
    }
}