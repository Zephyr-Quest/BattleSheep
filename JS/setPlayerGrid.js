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
        this.setDrop();

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
            for (let i = 0; i < this.nbSheep; i++) {
                this.tabSheep[i].setFirstPosition(undefined);
            }
        })
        
        validBtn.addEventListener("click", () => { })
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
                        if (this.grid[row][col][1] == "r") {
                            const preContainer = document.getElementById([row, col - 1]);
                            divSheep.classList.add(preContainer.firstChild.classList[1]);
                            divSheep.innerText = this.tabSheep[preContainer.firstChild.classList[1]].getSize();
                        }
                        else {
                            const preContainer = document.getElementById([row - 1, col]);
                            divSheep.classList.add(preContainer.firstChild.classList[1]);
                            divSheep.innerText = this.tabSheep[preContainer.firstChild.classList[1]].getSize();
                        }
                        container.appendChild(divSheep);
                        this.setDrag(divSheep);
                    }
                }
                else if (container.hasChildNodes()) {
                    if (!container.firstElementChild.hasAttribute("moving")) {
                        container.innerHTML = "";
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
            else value == undefined ? this.setCase(Number(row) + i, col, value) : this.setCase(Number(row) + i, col, value + "c");
        }
    }

    CreateSheepOnScreen() {
        const div = document.getElementById("sheepBox");
        for (let i = 0; i < this.nbSheep; i++) {
            if (!document.getElementById(i)) {
                const divSheep = document.createElement("div");
                divSheep.setAttribute("draggable", "true");
                divSheep.classList.add("box");
                divSheep.classList.add(i);
                divSheep.id = i;
                divSheep.innerText = this.tabSheep[i].getSize();
                div.append(divSheep);
                this.setDrag(divSheep);
            }
        }
    }

    setDrag(currentBox) {
        currentBox.addEventListener("dragstart", (event) => {
            // console.log("start");
            const currentBox = event.target;
            const currentSheep = this.tabSheep[currentBox.classList[1]];
            event.dataTransfer.setData('text/plain', currentBox.classList[1]);
            if (currentBox.parentElement.classList[0] === "container") {
                this.rangeSheep(currentSheep.getFirstPosition(), currentSheep.getRotation(), currentSheep.getSize(), undefined);
                currentBox.setAttribute("moving", "true");
                this.displayOnScreen();
            }
        })

        currentBox.addEventListener("dragend", (event) => {
            // console.log("end");
            const currentBox = event.target;
            const currentSheep = this.tabSheep[currentBox.classList[1]];
            if (currentBox.parentElement.id != currentSheep.getFirstPosition()) {
                const container = document.getElementById(currentSheep.getFirstPosition())
                container.append(currentBox);
            }
            this.rangeSheep(currentSheep.getFirstPosition(), currentSheep.getRotation(), currentSheep.getSize(), currentSheep.getSize());
            this.displayGrid();
            currentBox.removeAttribute("moving");
            this.displayOnScreen();
        })
    }

    setDrop() {
        const container = document.querySelectorAll(".container");

        for (const box of container) {
            box.addEventListener("dragover", (event) => {
                event.preventDefault();
                // console.log("over");//     container.innerHTML = "";
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
                const currentSheep = this.tabSheep[currentBox.classList[1]];
                const parent = currentBox.parentElement.id;
                currentSheep.setFirstPosition(parent);
                currentSheep.setRotation(this.rotation);
            })
        }
    }
}