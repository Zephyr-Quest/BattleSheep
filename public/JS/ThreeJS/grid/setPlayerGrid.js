import { grid } from './grid.js';
import { wrapPosition } from './verif.js';
import { sheep } from './sheep.js';

/* -------------------------------------------------------------------------- */
/*                         Class to manage start grid                         */
/* -------------------------------------------------------------------------- */
export class setPlayerGrid extends grid {

    /**
     * The setPlayerGrid constructor
     * @param {View} view3d The ThreeJS view
     * @param {funcion} callback What is run after the selection
     */
    constructor(view3d, callback) {
        super();
        this.rotation = "row";
        this.nbSheep = 10;
        this.tabSheep = [];
        this.view3d = view3d;
        this.endCallback = callback;

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
            document.getElementById("sheepBox").style.display = "block";
            this.resetGrid();
            this.displayGrid();
            this.CreateSheepOnScreen();
            this.displayOnScreen();
            for (let i = 0; i < this.nbSheep; i++) {
                this.tabSheep[i].firstPosition = undefined;
            }
        })

        validBtn.addEventListener("click", this.endCallback);
    }

    displayOnScreen() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const container = document.getElementById([row, col]);
                if (this.grid[row][col] != undefined) {
                    if (!container.hasChildNodes()) {
                        // Create the sheep div
                        const divSheep = document.createElement("div");
                        divSheep.setAttribute("draggable", "true");
                        divSheep.classList.add("box");

                        // Create the sheep img
                        const imgSheep = document.createElement('img');
                        imgSheep.src = "img/sheep_head.png";
                        imgSheep.alt = "Sheep head";
                        divSheep.append(imgSheep);

                        // Create indice
                        const nbSpan = document.createElement("span");

                        if (this.grid[row][col][1] == "r") {
                            const preContainer = document.getElementById([row, col - 1]);
                            divSheep.classList.add(preContainer.firstChild.classList[1]);
                            nbSpan.innerText = this.tabSheep[preContainer.firstChild.classList[1]].sheepSize;
                        }
                        else {
                            const preContainer = document.getElementById([row - 1, col]);
                            divSheep.classList.add(preContainer.firstChild.classList[1]);
                            nbSpan.innerText = this.tabSheep[preContainer.firstChild.classList[1]].sheepSize;
                        }

                        divSheep.append(nbSpan);
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

        const simpleGrid = this.getSimpleGrid();
        this.view3d.displayPlayerGrid(simpleGrid, 0);
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
            if (document.getElementById(i))
                document.getElementById(i).remove();

            // Create the sheep div
            const divSheep = document.createElement("div");
            divSheep.setAttribute("draggable", "true");
            divSheep.classList.add("box");
            divSheep.classList.add(i);
            divSheep.id = i;
            
            // Create the sheep img
            const imgSheep = document.createElement('img');
            imgSheep.src = "img/sheep_head.png";
            imgSheep.alt = "Sheep head";
            divSheep.append(imgSheep);

            // Create indice
            const nbSpan = document.createElement("span");
            nbSpan.innerText = this.tabSheep[i].sheepSize;
            divSheep.append(nbSpan);

            div.append(divSheep);
            this.setDrag(divSheep);
        }
    }

    setDrag(currentBox) {
        currentBox.addEventListener("dragstart", (event) => {
            // console.log("start");
            let currentBox = event.target;
            if (currentBox.nodeName === 'IMG' || currentBox.nodeName === 'span')
                currentBox = currentBox.parentElement;

            const currentSheep = this.tabSheep[currentBox.classList[1]];
            event.dataTransfer.setData('text/plain', currentBox.classList[1]);
            if (currentBox.parentElement.classList[0] === "container") {
                this.rangeSheep(currentSheep.firstPosition, currentSheep.direction, currentSheep.sheepSize, undefined);
                currentBox.setAttribute("moving", "true");
                this.displayOnScreen();
            }
        })

        currentBox.addEventListener("dragend", (event) => {
            // console.log("end");
            let currentBox = event.target;
            if (currentBox.nodeName === 'IMG' || currentBox.nodeName === 'span')
                currentBox = currentBox.parentElement;

            const currentSheep = this.tabSheep[currentBox.classList[1]];
            if (currentBox.parentElement.id != currentSheep.firstPosition) {
                const container = document.getElementById(currentSheep.firstPosition)
                container.append(currentBox);
            }
            this.rangeSheep(currentSheep.firstPosition, currentSheep.direction, currentSheep.sheepSize, currentSheep.sheepSize);
            this.displayGrid();
            currentBox.removeAttribute("moving");
            this.displayOnScreen();
        })
    }

    setDrop() {
        const container = document.querySelectorAll(".container");

        for (const box of container) {
            box.addEventListener("dragover", (event) => {
                // console.log("over");//
                event.preventDefault();
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
                const currentSheep = this.tabSheep[currentBox.classList[1]];
                if (!currentContainer.hasChildNodes()) {
                    if (wrapPosition(this.grid, Number(currentContainer.id[0]), Number(currentContainer.id[2]), currentSheep.sheepSize, this.rotation)) {
                        currentContainer.appendChild(currentBox);
                        currentSheep.firstPosition = currentContainer.id;
                        currentSheep.direction = this.rotation;
                        
                        // Check if sheepBox is empty
                        const sheepBox = document.getElementById("sheepBox");
                        if (sheepBox.children.length === 0)
                            sheepBox.style.display = "none";
                    }
                }
            })
        }
    }
};