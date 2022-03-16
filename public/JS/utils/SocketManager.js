import { HUD } from '../ThreeJS/gameplay/HUD.js';
import Game from "../ThreeJS/game.js";

/* -------------------------------------------------------------------------- */
/*                               Some variables                               */
/* -------------------------------------------------------------------------- */
let socket = io();
let view3D, playerId;


/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */

/**
 * Transfer grid of the player to chek it in back part
 *
 * @param   {Array}  grid  Grid of the player
 * 
 */
function checkGrid(grid) {
    socket.emit("checkGrid", grid);
}

/**
 * Transfer to back part the shoot of the player
 *
 * @param   {Number}  x       x Position of the shot in the grid
 * @param   {Number}  y       y position ot the shoot in the grid
 * @param   {String}  weapon  Name of weapon used
 *
 */
function play(x,y, weapon) {
    socket.emit("playerPlayed", x, y, playerId, weapon);
}


/* -------------------------------------------------------------------------- */
/*                                   Socket                                   */
/* -------------------------------------------------------------------------- */

/**
 * Begin of gameplay, display grid to set on screen when 2 players are connected in the room
 */
socket.on("timeToPlay", () => {
    HUD.showAnnouncement("Other player is connecting", "Please wait...");
    setTimeout(() => {
        HUD.hideAnnouncement();
        setTimeout(HUD.showStartGrid, 1000);
    }, 10000)
})

/**
 * receive result of the check grid
 *
 * @param   {Boolean}  result      True if the gird is correct, else grid is incorrect
 *
 */
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

/**
 * Receive player ID
 *
 * @param   {Number}  result          ID of the player (0 or 1)
 *
 */
socket.on("resultPlayerId", (result) => {
    console.log("You are the player", result);
    Game.setPlayerId(result);
    playerId = result;
});

/**
 * Begin the Game, the players confrontation
 */
socket.on("startGameplay", () => {
    HUD.hideStartGrid();
    HUD.showAnnouncementDuring("The game starts", "Enjoy !", 2000);
    Game.setRaycasterState(true);
});

/**
 * Receive the result of a shoot to update the grid of the player
 *
 * @return  {Function}  updateWorld     Function to update world
 */
socket.on("resultPlay", updateWorld);

/**
 * Disconnection of player
 */
socket.on("disconnection", () => {
    window.location.href = "/lobby";
});


// /* -------------------------------------------------------------------------- */
// /*                                  Functions                                 */
// /* -------------------------------------------------------------------------- */

/**
 * Init the view 
 *
 * @param   {View}  view    View to display elements on game screen
 * 
 */
function init(view) {
    view3D = view;
}

/**
 * Return the player ID
 *
 * @return  {Number}  Player ID
 */
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


/* ----------------------------- Export function ---------------------------- */
export default {
    init,
    checkGrid,
    getPlayerId,
    play
};