class enemyGrid extends grid {
    constructor() {
        super();

        // Set enemy grid
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
            button.innerHTML = this.weapons[i].name;
            tableWeapons.appendChild(button);
            // Listener
            button.addEventListener("click", () => {
                this.currentWeapon = this.weapons[button.id];
            })
        }

        this.setAnimation();
    }

    displayOnScreen() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const currentBtn = document.getElementById([row, col]).firstChild;
                // currentBtn.innerHTML = (this.grid[row][col] === undefined ? "" : this.grid[row][col]);
                currentBtn.innerHTML = "";
                if (this.grid[row][col] === undefined ? "" : this.grid[row][col])
                    currentBtn.parentElement.classList.add("unavailable");
            }
        }
    }

    // Fonction qui va disparaitre par la suite, va être géré par le back mais utile pour les tests pour l'instant
    attack(r, c) {
        // Shears
        if (this.currentWeapon.name == "shears") {
            this.setCase(r, c, 0 + " ");
        }


        // Torpedo
        else if (this.currentWeapon.name == "torpedo") {
            this.setCase(r, c, 0 + " ");
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
                        if (this.grid[minR][minC] == undefined) {
                            this.setCase(minR, minC, 0 + " ");
                        }
                    }
                }
            }

            // Fragment
            else if (this.currentWeapon.name == "fragment") {
                (c == 0) ? minC = 0 : minC = Number(c) - 1;
                for (minR; minR < maxR; minR++) {
                    if (this.grid[minR][c] == undefined) {
                        this.setCase(minR, c, 0 + " ");
                    }
                }
                for (minC; minC < maxC; minC++) {
                    if (this.grid[r][minC] == undefined) {
                        this.setCase(r, minC, 0 + " ");
                    }
                }
            }
        }
    }

    setAnimation() {
        const container = document.querySelectorAll("#enemyGrid td button");

        for (const box of container) {
            box.addEventListener("mouseleave", (event) => {
                this.animation(event, "");
            })

            box.addEventListener("mouseenter", (event) => {
                this.animation(event, '<i class="fa fa-crosshairs"></i>');
            })
        }
    }

    animation(event, value) {
        const idBox = event.path[1].id;
        let r = Number(idBox[0]);
        let c = Number(idBox[2]);

        // Pb résolue !
        // En écrivant dans la cellule du tableau, tu enlevais le boutton à l'intérieur
        // Or c'est sur les bouttons que tes events 'mouseenter' et 'mouseleave' sont définis
        let boxToWrite = document.getElementById([r, c]).querySelector('button');

        // Shears
        if (this.currentWeapon.name == "shears") {
            if (this.grid[r][c] == undefined) boxToWrite.innerHTML = value;
            else if (this.grid[r][c] !== undefined && event.type == "mouseenter") boxToWrite.innerHTML = '<i class="fa fa-times" style="color:rgb(231, 12, 12 )"></i>';
            else if (this.grid[r][c] !== undefined && event.type == "mouseleave") boxToWrite.innerHTML = "";
        }

        // Torpedo
        else if (this.currentWeapon.name == "torpedo") {
            if (this.grid[r][c] == undefined) boxToWrite.innerHTML = value;
            else if (this.grid[r][c] !== undefined && event.type == "mouseenter") boxToWrite.innerHTML = '<i class="fa fa-times" style="color:rgb(231, 12, 12 )"></i>';
            else if (this.grid[r][c] !== undefined && event.type == "mouseleave") boxToWrite.innerHTML = "";
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
                        boxToWrite = document.getElementById([minR, minC]).querySelector('button');
                        if (this.grid[minR][minC] == undefined) boxToWrite.innerHTML = value;
                        else if (this.grid[minR][minC] !== undefined && event.type == "mouseenter") boxToWrite.innerHTML = '<i class="fa fa-times" style="color:rgb(231, 12, 12 )"></i>';
                        else if (this.grid[minR][minC] !== undefined && event.type == "mouseleave") boxToWrite.innerHTML = "";
                    }
                }
            }

            // Fragment
            else if (this.currentWeapon.name == "fragment") {
                (c == 0) ? minC = 0 : minC = Number(c) - 1;
                for (minR; minR < maxR; minR++) {
                    boxToWrite = document.getElementById([minR, c]).querySelector('button');
                    if (this.grid[minR][c] == undefined) boxToWrite.innerHTML = value;
                    else if (this.grid[minR][c] !== undefined && event.type == "mouseenter") boxToWrite.innerHTML = '<i class="fa fa-times" style="color:rgb(231, 12, 12 )"></i>';
                    else if (this.grid[minR][c] !== undefined && event.type == "mouseleave") boxToWrite.innerHTML = "";
                }
                for (minC; minC < maxC; minC++) {
                    boxToWrite = document.getElementById([r, minC]).querySelector('button');
                    if (this.grid[r][minC] == undefined) boxToWrite.innerHTML = value;
                    else if (this.grid[r][minC] !== undefined && event.type == "mouseenter") boxToWrite.innerHTML = '<i class="fa fa-times" style="color:rgb(231, 12, 12 )"></i>';
                    else if (this.grid[r][minC] !== undefined && event.type == "mouseleave") boxToWrite.innerHTML = "";
                }
            }
        }
    }
}