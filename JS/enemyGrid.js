class enemyGrid extends grid {
    constructor() {
        super();

        const playerGrid = document.getElementById("playerGrid");
        
        for (let row = 0; row < this.gridSize; row++) {
            const tr = document.createElement('tr');
            for (let col = 0; col < this.gridSize; col++) {
                const td = document.createElement('td');
                const button = document.createElement('button');
                td.id = [row,col];
                td.appendChild(button);
                tr.appendChild(td);
            }
            playerGrid.appendChild(tr);
        }
        
        const resetBtn = document.getElementById("reset");
        const validBtn = document.getElementById("valid");
        const btnGame = document.querySelectorAll("td button");

        this.displayOnScreen();
        this.displayGrid();

        resetBtn.addEventListener("click", () => {
            this.resetGrid();
            this.displayGrid();
            this.displayOnScreen();
        })

        btnGame.forEach(element => {
            element.addEventListener("click", () => {
                const id = element.parentElement.id;
                console.log(this.grid[id[0]][id[2]]);
                if (this.grid[id[0]][id[2]] !== 1) {
                    this.setCase(id[0], id[2], 1);
                    this.displayGrid();
                    this.displayOnScreen();
                }
            })
        });
    }

    displayOnScreen() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const currentBtn = document.getElementById([row,col]).firstChild;
                currentBtn.innerHTML = (this.grid[row][col] === undefined ? "" : this.grid[row][col]);
            }
        }
    }
}