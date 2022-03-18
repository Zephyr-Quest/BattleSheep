import { HUD } from '../ThreeJS/gameplay/HUD.js';
import Game from "../ThreeJS/game.js";
import { Vector2 } from "three";
import SoundDesign from './SoundDesign.js';
import { Config } from '../ThreeJS/config.js';

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
    HUD.startChronoFrom(0, 0);
    if(playerId === 0)
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

/**
 * It updates the world by displaying the player grid, the current player, the list of weapon used, the
 * list of position to uncover, the minutes and seconds of the game, and if the game is finished.
 * @param {Array} startGrid - the grid of the player who starts the game
 * @param {Number} currentPlayer - the playerId of the current player
 * @param {Array} listPos - an array of objects with the following structure:
 * [ { x, y, playerId, state } ]
 * @param {Array} listWeaponUsed - an array of strings, each string is the name of a weapon used.
 * @param {Number} minutes - the number of minutes of the game
 * @param {Number} seconds - the number of seconds left in the game.
 * @param {Boolean} endGame - If the game is finished
 * @param [gifName] - the name of the gif to display during the turn
 */
function updateWorld(startGrid, currentPlayer, listPos, listWeaponUsed, minutes, seconds, endGame, gifName = undefined) {
    const view = Game.getView();

    // Print the player grid
    view.displayPlayerGrid(startGrid, playerId);
    Game.setRaycasterState(false);

    // Update his weapon list
    listWeaponUsed.forEach(weaponName => {
        HUD.blockWeapon(weaponName);
    });
    HUD.setCurrentWeapon("Shears");

    // Update his chrono
    HUD.startChronoFrom(minutes, seconds);

    // Start animations
    view.showCapillotractoms();
    SoundDesign.playCapillotractom();
    setTimeout(() => {
        // Print found sheeps
        // Calcul the player score
        let score = 0;
        listPos.forEach(element => {
            view.uncoverGridCase(new Vector2(element.x, element.y), element.playerId, element.state);
            score += element.playerId !== playerId && element.state === 2 ? 1 : 0;
        });
        SoundDesign.playRandomSheep();
        HUD.setScore(score);

        // Switch player
        if (!endGame) {
            if (playerId != currentPlayer) {
                HUD.showAnnouncementDuring("Enemy turn", "Just wait... Keep calm...", 1000);
            } else {
                Game.setRaycasterState(true);
                HUD.showAnnouncementDuring("Your turn", "Get fun !", 1000);
            }
        } else Game.setRaycasterState(false);

        // Show gif and end announcement
        setTimeout(() => {
            if (gifName !== undefined) {
                HUD.showGifDuring(gifName, 2000);
                if (endGame) setTimeout(() => {
                    HUD.showEndAnnouncement("Game finished", "Try another Game");
                }, 3000);
            } else if (endGame)
                HUD.showEndAnnouncement("Game finished", "Try another Game");
        }, endGame ? 10 : 2000);
    }, Config.capillotractom.duration + Config.capillotractom.durationBeforeRemove);
}


/* ----------------------------- Export function ---------------------------- */
export default {
    init,
    checkGrid,
    getPlayerId,
    play
};