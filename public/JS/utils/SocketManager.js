import { HUD } from '../ThreeJS/gameplay/HUD.js';
import Game from "../ThreeJS/game.js";

let socket = io();
let view3D, playerId;

function checkGrid(grid) {
    socket.emit("checkGrid", grid);
}

function play(pos, weapon) {
    socket.emit("playerPlayed", pos, playerId, weapon);
}

socket.on("timeToPlay", () => {
    HUD.showAnnouncement("Other player is connecting", "Please wait...");
    setTimeout(() => {
        HUD.hideAnnouncement();
        setTimeout(HUD.showStartGrid, 1000);
    }, 10000)
})

socket.on("resultGrid", (result) => {
    HUD.hideStartGrid();
    if (result) {
        HUD.showAnnouncement("The other player is setting up his grid", "Please wait...")
    }
    else {
        HUD.showAnnouncementDuring("Invalid grid", "try another grid", 1000);
        setTimeout(HUD.showStartGrid, 2000);
    }
})

socket.on("resultPlayerId", (result) => {
    console.log("You are the player", result);
    Game.setPlayerId(result);
    playerId = result;
});

socket.on("startGameplay", () => {
    HUD.hideStartGrid();
    HUD.showAnnouncementDuring("The game starts", "Enjoy !", 2000);
    Game.setRaycasterState(true);
});

socket.on("resultPlay", updateWorld);

socket.on("disconnection", () => {
    window.location.href = "/lobby";
});

// /* -------------------------------------------------------------------------- */
// /*                                  Functions                                 */
// /* -------------------------------------------------------------------------- */

function init(view) {
    view3D = view;
}

function getPlayerId() {
    return playerId;
}

function updateWorld(startGrid, playerId, currentPlayer, listPos, listWeaponUsed, minutes, seconds, endGame, gifName = undefined) {
    const view = Game.getView();

    view.displayPlayerGrid(startGrid, playerId);

    if (playerId != currentPlayer) {
        Game.setRaycasterState(false);
        HUD.showAnnouncementDuring("Enemy turn", "Just wait... Keep calm...", 1500);
    }
    else {
        Game.setRaycasterState(true);
        HUD.showAnnouncementDuring("Your turn", "Get fun", 1000);
    }

    listWeaponUsed.forEach(weaponName => {
        HUD.blockWeapon(weaponName);
        // HUD.setWeapon("Shears");
    });

    if (gifName !== undefined)
        HUD.showGifDuring(gifName, 2000);

    listPos.forEach(element => {
        view.uncoverGridCase(new Vector2(element.x, element.y), element.playerId, element.isSheep);
    });

    HUD.startChronoFrom(minutes, seconds);

    if (endGame) setTimeout(() => {
        HUD.showAnnouncement("Game finished", "Try another Game");
    }, 1000);
}

export default {
    init,
    checkGrid,
    getPlayerId,
    play
};