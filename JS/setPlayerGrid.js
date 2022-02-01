class setPlayerGrid extends grid {
    constructor() {
        super();
        this.rotation = "row";
        this.nbSheep = 10;
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
            if (i < 4)
                this.tabSheep[i] = new sheep(1, this.rotation, undefined);
            else if (i < 7)
                this.tabSheep[i] = new sheep(2, this.rotation, undefined);
            else if (i < 9)
                this.tabSheep[i] = new sheep(3, this.rotation, undefined);
            else
                this.tabSheep[i] = new sheep(4, this.rotation, undefined);
        }
        this.CreateSheepOnScreen();

        // Set buttons
        const rotateBtn = document.getElementById("rotate");
        const resetBtn = document.getElementById("reset");
        const validBtn = document.getElementById("valid");
        const container = document.querySelectorAll(".container");
        let boxs = document.querySelectorAll(".box");

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
        for (const currentBox of boxs) {
            // console.log("start");
            currentBox.addEventListener("dragstart", (event) => {
                console.log(boxs)
                const currentBox = event.target;
                console.log(event.target);
                const currentSheep = this.tabSheep[currentBox.classList[2]];
                event.dataTransfer.setData('text/plain', currentBox.classList[2]);
                if (currentBox.parentElement.classList[0] === "container") {
                    this.rangeSheep(currentSheep.getFirstPosition(), currentSheep.getRotation(), currentSheep.getSize(), undefined);
                }
            })
            currentBox.addEventListener("dragend", (event) => {
                // console.log("end");
                const currentBox = event.target;
                const currentSheep = this.tabSheep[currentBox.classList[2]];
                currentSheep.setRotation(this.rotation);
                boxs = document.querySelectorAll(".box")
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
                const currentBox = document.getElementsByClassName(data)[0];
                currentContainer.appendChild(currentBox);
                const currentSheep = this.tabSheep[currentBox.classList[2]];
                const parent = currentBox.parentElement.id;
                currentSheep.setFirstPosition(parent);
                console.log(currentSheep.getFirstPosition());
                this.rangeSheep(currentSheep.getFirstPosition(), this.rotation, currentSheep.getSize(), currentSheep.getSize());
                this.displayGrid();
                this.displayOnScreen();
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
                        divSheep.setAttribute("draggable", "true");
                        divSheep.classList.add("box");
                        divSheep.classList.add(this.grid[row][col][0]);
                        if (this.grid[row][col][1] == "r") {
                            const preContainer = document.getElementById([row, col-1]);
                            divSheep.classList.add(preContainer.firstChild.classList[2]);
                            divSheep.innerText = this.tabSheep[preContainer.firstChild.classList[2]].getSize();
                        }
                        else {
                            const preContainer = document.getElementById([row-1, col]);
                            divSheep.classList.add(preContainer.firstChild.classList[2])
                            divSheep.innerText = this.tabSheep[preContainer.firstChild.classList[2]].getSize();
                        }
                        container.appendChild(divSheep);
                    }
                }
                else {
                    container.innerHTML = "";
                }
            }
        }
    }

    rangeSheep(sheepPosition, rotate, range, value) {
        const row = sheepPosition[0];
        const col = sheepPosition[2];
        for (let i = 0; i < range; i++) {
            if (rotate === "row")
                value == undefined ? this.setCase(row, Number(col) + i, value) : this.setCase(row, Number(col) + i, value + "r");
            else value == undefined ? this.setCase(Number(row) + i, col, value) : this.setCase(Number(row) + i, col, value + "l");
        }
    }

    CreateSheepOnScreen() {
        const div = document.getElementById("sheepBox");
        for (let i = 0; i < this.nbSheep; i++) {
            if (!document.getElementById(i)) {
                const divSheep = document.createElement("div");
                divSheep.setAttribute("draggable", "true");
                divSheep.classList.add("box");
                divSheep.classList.add(this.tabSheep[i].getSize());
                divSheep.classList.add(i);
                divSheep.innerText = this.tabSheep[i].getSize();
                div.append(divSheep);
            }
        }
    }
}