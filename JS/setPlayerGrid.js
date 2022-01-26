class setPlayerGrid extends grid {
    constructor() {
        super();
        this.rotation = "row";
        this.nbSheep = 4;
        this.tabSheep = [];
        
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
        
        // Set sheeps
        for (let i = 0; i < this.nbSheep; i++) {
            this.tabSheep[i] = new sheep((i+1), this.rotation);
        }
        this.CreateSheepOnScreen();

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
            this.CreateSheepOnScreen();
        })

        validBtn.addEventListener("click", () => { })

        // Set drag and drop
        for (const currentbox of boxs) {
            // console.log("start");
            currentbox.addEventListener("dragstart", (event) => {
                const currentbox = event.target;
                console.log(this.tabSheep[currentbox.classList[1]]);
                const currentSheep = this.tabSheep[Number(currentbox.classList[1])];
                event.dataTransfer.setData('text/plain', currentbox.classList[1]);
                if (currentbox.parentElement.classList[0] === "container") {
                    const data = event.dataTransfer.getData("text/plain");
                    const draggable = document.getElementsByClassName(data)[0];
                    const parent = draggable.parentElement.id;
                    this.rangeSheep(parent[0], parent[2], currentSheep.getRotation(), currentSheep.getSize(), undefined);
                }
            })
            currentbox.addEventListener("dragend", (event) => {
                // console.log("end");
                const currentbox = event.target;
                const currentSheep = this.tabSheep[currentbox.classList[1]];
                currentSheep.setRotation(this.rotation);
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
                const currentContainer = event.target;
                const data = event.dataTransfer.getData("text/plain");
                const currentbox = document.getElementsByClassName(data)[0];
                currentContainer.appendChild(currentbox);
                const parent = currentbox.parentElement.id;
                const currentSheep = this.tabSheep[Number(currentbox.classList[1])];
                this.rangeSheep(parent[0], parent[2], this.rotation, currentSheep.getSize(), currentSheep.getSize());
                this.displayGrid();
                this.displayOnScreen()
            })
        }
    }

    displayOnScreen() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const container = document.getElementById([row, col]);
                if (this.grid[row][col] != undefined) {
                    if (!container.hasChildNodes()) {
                        const divSheep = document.createElement("div");
                        divSheep.classList.add("box");
                        divSheep.classList.add(this.grid[row][col] - 1);
                        container.appendChild(divSheep);
                    }
                }
                else{
                    container.innerHTML = "";
                }
            }
        }
    }

    rangeSheep(row, col, rotate, range, value) {
        for (let i = 0; i < range; i++) {
            if (rotate === "row") this.setCase(row, Number(col) + i, value);
            else this.setCase(Number(row) + i, col, value);
        }
    }

    CreateSheepOnScreen(){
        const div = document.getElementById("sheepBox");
        for (let i = 0; i < this.nbSheep; i++) {
            if (!document.getElementById(i)) {
                const divSheep = document.createElement("div");
                divSheep.classList.add("box");
                divSheep.classList.add(i);
                divSheep.innerText = i+1;
                div.append(divSheep);
            }
        }
    }
}