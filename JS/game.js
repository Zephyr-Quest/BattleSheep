class game extends grid {
    constructor() {
        super();

        // Set grid
        const enemyGrid = document.getElementById("enemyGrid");
        for (let row = 0; row < this.gridSize; row++) {
            const tr = document.createElement('tr');
            for (let col = 0; col < this.gridSize; col++) {
                const td = document.createElement('td');
                const button = document.createElement('button');
                td.id = [row, col];
                td.appendChild(button);
                tr.appendChild(td);
            }
            enemyGrid.appendChild(tr);
        }

        // Set button grid
        const btnGame = document.querySelectorAll("td button");
        btnGame.forEach(element => {
            element.addEventListener("click", () => {
                const id = element.parentElement.id;
                if (this.grid[id[0]][id[2]] === undefined) {
                    this.attack(id[0], id[2]);
                    if (this.currentWeapon.name !== "shears") {
                        const weaponButton = document.getElementById(this.currentWeapon.rank);
                        weaponButton.setAttribute("disabled", "true");
                        this.currentWeapon = this.weapons[0];
                    }
                    this.displayGrid();
                    this.displayOnScreen();
                }
            })
        });

        // Set weapons
        this.weapons = [];
        this.weapons[0] = new Weapon("shears", 0);
        this.weapons[1] = new Weapon("map", 1);
        this.weapons[2] = new Weapon("torpedo", 2);
        this.weapons[3] = new Weapon("fragment", 3);
        this.currentWeapon = this.weapons[0];
        const tableWeapons = document.getElementById("weapons");
        for (let i = 0; i < this.weapons.length; i++) {
            const button = document.createElement('button');
            button.id = i;
            button.innerText = this.weapons[i].name;
            tableWeapons.appendChild(button);
            // Listener
            button.addEventListener("click", () => {
                this.currentWeapon = this.weapons[button.id];
                console.log(this.currentWeapon);
            })
        }

        this.setAnimation();
    }

    displayOnScreen() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const currentBtn = document.getElementById([row, col]).firstChild;
                currentBtn.innerHTML = (this.grid[row][col] === undefined ? "" : this.grid[row][col]);
            }
        }
    }

    // Fonction qui va disparaitre par la suite, va être géré par le back mais utile pour les tests pour l'instant
    attack(r, c) {
        // Shears
        if (this.currentWeapon.name == "shears") this.setCase(r, c, this.currentWeapon.rank + " ");


        // Torpedo
        if (this.currentWeapon.name == "torpedo") {
            this.setCase(r, c, this.currentWeapon.rank + " ");
        }

        else {
            let minR;
            (r == 0) ? minR = 0 : minR = Number(r) - 1;
            let maxR;
            (r == 9) ? maxR = 10 : maxR = Number(r) + 2;
            let maxC;
            (c == 9) ? maxC = 10 : maxC = Number(c) + 2;
            let minC;

            // Map
            if (this.currentWeapon.name == "map") {
                for (minR; minR < maxR; minR++) {
                    (c == 0) ? minC = 0 : minC = Number(c) - 1;
                    for (minC; minC < maxC; minC++) {
                        this.setCase(minR, minC, this.currentWeapon.rank + " ");
                    }
                }
            }

            // Fragment
            if (this.currentWeapon.name == "fragment") {
                (c == 0) ? minC = 0 : minC = Number(c) - 1;
                for (minR; minR < maxR; minR++) {
                    this.setCase(minR, c, this.currentWeapon.rank + " ");
                }
                for (minC; minC < maxC; minC++) {
                    this.setCase(r, minC, this.currentWeapon.rank + " ");
                }
            }
        }
    }

    setAnimation() {
        const container = document.querySelectorAll("#enemyGrid td button");

        for (const box of container) {
            box.addEventListener("mouseleave", (event) => {
                console.log("leave")
                this.animation(event, "leave");
            })

            box.addEventListener("mouseenter", (event) => {
                console.log("begin enter");
                this.animation(event, "enter");
                console.log("end enter")
            })
        }
    }

    animation(event, value) {
        const idBox = event.path[1].id;
        let r = Number(idBox[0]);
        let c = Number(idBox[2]);
        let boxToWrite = document.getElementById([r, c]);

        // Shears
        if (this.currentWeapon.name == "shears") {
            boxToWrite.innerHTML = value;
            console.log("shears");
        }

        // Torpedo
        else if (this.currentWeapon.name == "torpedo") {
            boxToWrite.innerHTML = value;
            console.log("torpedo");
        }

        else {
            let minR;
            (r == 0) ? minR = 0 : minR = Number(r) - 1;
            let maxR;
            (r == 9) ? maxR = 10 : maxR = Number(r) + 2;
            let maxC;
            (c == 9) ? maxC = 10 : maxC = Number(c) + 2;
            let minC;

            // Map
            if (this.currentWeapon.name == "map") {
                for (minR; minR < maxR; minR++) {
                    (c == 0) ? minC = 0 : minC = Number(c) - 1;
                    for (minC; minC < maxC; minC++) {
                        console.log(minR, minC)
                        boxToWrite = document.getElementById([minR, minC]);
                        boxToWrite.innerHTML = value;
                    }
                }
                console.log("map")
            }

            // Fragment
            else if (this.currentWeapon.name == "fragment") {
                (c == 0) ? minC = 0 : minC = Number(c) - 1;
                for (minR; minR < maxR; minR++) {
                    boxToWrite = document.getElementById([minR, minC]);
                    boxToWrite.innerHTML = value;
                }
                for (minC; minC < maxC; minC++) {
                    boxToWrite = document.getElementById([minR, minC]);
                    boxToWrite.innerHTML = value;
                }
                console.log("fragment");
            }
        }
        console.log("end animation")
    }
}