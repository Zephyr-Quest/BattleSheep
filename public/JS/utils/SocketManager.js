import { HUD } from '../ThreeJS/gameplay/HUD.js';
import Game from "../ThreeJS/game.js";

let socket = io();
let view3D;

// let currentPlayerId, view3D;

// socket.emit("checkGrid", grid, idPlayer);
// socket.emit("shot", HUD.currentWeapon, coord, idPlayer);

// socket.on("updateGame", (result, grid, idPlayer, weaponName, gameFinished) => {
//     if (!result) return console.log("invalid shot");

//     if (weaponName != "Shears") {
//         HUD.blockWeapon(weaponName);
//         HUD.currentWeapon = "Shears";
//     }

//     currentPlayerId = idPlayer === 0 ? 1 : 0;

//     // for (let x = 0; x < grid.length; x++)
//     //     for (let y = 0; y < grid.length; y++)
//     //         view3D.uncoverGridCase(new Vector2(x, y), currentGame.currentPlayer);
//     console.log(grid);

//     if (gameFinished)
//         console.log("STOP");

// })

function checkGrid(grid) {
    socket.emit("checkGrid", grid);
}

function getPLayerId (){ 
    socket.emit("getPlayerId")
 }

socket.on("timeToPlay", () => {
    HUD.showAnnouncement("Other player is connecting", "Please wait...");
    socket.emit("getPlayerId");
    setTimeout(() => {
        HUD.hideAnnouncement();
        setTimeout(HUD.showStartGrid, 1000);
    }, 10000)
})

socket.on("resultGrid", (result) => {
    HUD.hideStartGrid();
    if (result) {
        HUD.showAnnouncement("The other player is setting up his grid", "Please wait...")
        Game.setRaycasterState(true);
    }
    else {
        HUD.showAnnouncementDuring("Invalid grid", "try another grid", 1000);
        setTimeout(HUD.showStartGrid, 2000);
    }
})

socket.on("resultPlayerId", (result) => {
    Game.setPlayerId(result);
});

socket.on("startGameplay", () => {
    HUD.hideStartGrid();
    HUD.showAnnouncement("Start Gameplay", "");
})

socket.on("disconnection", () => {
    window.location.href = "/lobby";
})

// /* -------------------------------------------------------------------------- */
// /*                                  Functions                                 */
// /* -------------------------------------------------------------------------- */

function init(view) {
    view3D = view;
}

export default {
    init,
    checkGrid,
    getPLayerId
};