import { HUD } from '../ThreeJS/gameplay/HUD.js';

let socket = io()

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

socket.on("resultGrid", (result) => {
    HUD.hideStartGrid();
    if (result) {
        HUD.showAnnouncement("The other player is setting up his grid", "Please wait...")
        // raycaster.isActive = true;
    }
    else {
        HUD.showAnnouncementDuring("Invalid grid", "try another grid", 1000);
        console.log("ok")
        setTimeout(HUD.showStartGrid, 2000);
    }
})

socket.on("timeToPlay", () => {
    HUD.showAnnouncement("Other player is connecting", "Please wait...");
    setTimeout(() => {
        HUD.hideAnnouncement();
        setTimeout(HUD.showStartGrid, 1000);
    }, 10000)
})

socket.on("disconnection", () => {
    window.location.href = "/lobby";
})

// const socketEvents = {
//     "updateGame": (result, grid, idPlayer, weaponName, gameFinished) => {
//         if (!result) return console.log("invalid shot");

//         if (weaponName != "Shears") {
//             HUD.blockWeapon(weaponName);
//             HUD.currentWeapon = "Shears";
//         }

//         currentPlayerId = idPlayer === 0 ? 1 : 0;

//         // for (let x = 0; x < grid.length; x++)
//         //     for (let y = 0; y < grid.length; y++)
//         //         view3D.uncoverGridCase(new Vector2(x, y), currentGame.currentPlayer);
//         console.log(grid);

//         if (gameFinished)
//             console.log("STOP");

//     },
//     "timeToPlay": () => {
//         console.log("play");
//         HUD.hideAnnouncement();
//         setTimeout(HUD.showStartGrid, 1000);
//     }
// }

// /* -------------------------------------------------------------------------- */
// /*                                  Functions                                 */
// /* -------------------------------------------------------------------------- */

function init(view) {
    let view3D = view;
}

// function connect() {
//     socket = io();

//     for (const eventName in socketEvents) {
//         if (Object.hasOwnProperty.call(socketEvents, eventName)) {
//             const event = socketEvents[eventName];
//             console.log(eventName, event);
//             socket.on(eventName, event);
//         }
//     }
//     console.log(socket);
// }


export default {
    init,
    checkGrid
    // connect
};