const Verif = require("./weapons");

let grid = [];
for (let i = 0; i < 10; i++) {
    let row = [];
    for (let j = 0; j < 10; j++)
        row.push(undefined);
    grid.push(row);
}

grid[0][0] = "2c";
grid[1][0] = "2c";
grid[2][0] = "2c";
grid[3][0] = "2c";
grid[0][1] = "2r";
grid[0][2] = "2r";

function printGrid(grid) {
    let playerString = "";
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            playerString += (grid[row][col] === undefined ? "U " : grid[row][col]);
            playerString += (col < 10 - 1 ? " " : "\n");
        }
    }
    console.log(playerString);
}

printGrid(grid);

const history = [
    { x: 0, y: 0, playerId: 0, state: 2 },
    { x: 0, y: 2, playerId: 0, state: 2 },
];

const result = Verif.attack(grid, "Wolf", 0, 1, history, 0);
console.log(result);
