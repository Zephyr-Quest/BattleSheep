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

/**
 * It updates the world by displaying the player grid, the current player, the list of weapon used, the
 * list of position to uncover, the minutes and seconds of the game, and if the game is finished.
 * @param {Array} startGrid - the grid of the player who starts the game
 * @param {Number} playerId - the id of the player who is playing
 * @param {Number} currentPlayer - the playerId of the current player
 * @param {Array} listPos - an array of objects with the following structure:
 * [ { x, y, playerId, state } ]
 * @param {Array} listWeaponUsed - an array of strings, each string is the name of a weapon used.
 * @param {Number} minutes - the number of minutes of the game
 * @param {Number} seconds - the number of seconds left in the game.
 * @param {Boolean} endGame - If the game is finished
 * @param [gifName] - the name of the gif to display during the turn
 */
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
        HUD.showEndAnnouncement("Game finished", "Try another Game");
    }, 1000);
}

export default {
    init,
    checkGrid,
    getPlayerId,
    play
};