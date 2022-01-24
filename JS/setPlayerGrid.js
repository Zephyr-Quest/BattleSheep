class setPlayerGrid extends grid {
    constructor() {
        super();
        this.rotation = "row";

        // Set grid
        const playerGrid = document.getElementById("playerGrid");
        for (let row = 0; row < this.gridSize; row++) {
            const tr = document.createElement('tr');
            for (let col = 0; col < this.gridSize; col++) {
                const td = document.createElement('td');
                td.id = [row, col];
                td.className = "container";
                tr.appendChild(td);
            }
            playerGrid.appendChild(tr);
        }
        this.displayOnScreen();
        this.displayGrid();

        // Set buttons
        const rotateBtn = document.getElementById("rotate");
        const resetBtn = document.getElementById("reset");
        const validBtn = document.getElementById("valid");
        const container = document.querySelectorAll(".container");
        const boxs = document.querySelectorAll(".box");

        rotateBtn.addEventListener("click", () => {
            if (this.rotation === "row") this.rotation = "col";
            else this.rotation = "row";
            console.log(this.rotation);
        })

        resetBtn.addEventListener("click", () => {
            this.resetGrid();
            this.displayGrid();
            this.displayOnScreen();
        })

        validBtn.addEventListener("click", () => { })

        // Set drag and drop
        for (const box of boxs) {
            box.addEventListener("dragstart", (event) => {
                const box = event.target;
                event.dataTransfer.setData('text/plain', event.target.id);
                if (box.parentElement.classList[0] === "container") {
                    const classbox = box.classList;
                    const rotate = classbox[1];
                    console.log("start: ", rotate);
                    const id = event.dataTransfer.getData("text/plain");
                    const draggable = document.getElementById(id);
                    const parent = draggable.parentElement.id;
                    console.log(parent, id);
                    this.rangeSheep(parent[0], parent[2], rotate, id, undefined);
                    this.displayGrid();
                }
            })
            box.addEventListener("dragend", (event) => {
                // console.log("end");
                event.currentTarget.classList.replace(box.classList[1], this.rotation);
                console.log("end: ", box.classList[1]);
            })
        }
        for (const box of container) {
            box.addEventListener("dragover", (event) => {
                event.preventDefault();
                // console.log("over");
            })
            box.addEventListener("dragleave", () => {
                // console.log("leave");
            })
            box.addEventListener("dragenter", (event) => {
                event.preventDefault();
                // console.log("enter");
            })
            box.addEventListener("drop", (event) => {
                // console.log("droped");
                event.stopPropagation();
                const id = event.dataTransfer.getData("text/plain");
                const draggable = document.getElementById(id);
                event.target.appendChild(draggable);
                const parent = draggable.parentElement.id;
                this.rangeSheep(parent[0], parent[2], this.rotation, id, id);
                this.displayGrid();
            })
        }
    }

    displayOnScreen() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const currentBtn = document.getElementById([row, col]);
                currentBtn.innerHTML = (this.grid[row][col] === undefined ? "" : this.grid[row][col]);
            }
        }
    }

    rangeSheep(row, col, rotate, range, value) {
        for (let i = 0; i < range; i++) {
            if (rotate === "row") this.setCase(row, Number(col) + i, value);
            else this.setCase(Number(row) + i, col, value);
        }
    }
}