import Game from "./ThreeJS/game.js";
import SplashScreen from "./utils/SplashScreen.js";
import { Config } from "./ThreeJS/config.js";
import { HUD } from "./ThreeJS/gameplay/HUD.js";
import SocketManager from './utils/SocketManager.js';
import { Vector2 } from 'three';

let socket = io();

window.addEventListener("load", () => {
    SplashScreen.start(() => {
        // The splash screen is done
        SplashScreen.hideScreen();
        // Game.init();
        // SocketManager.init(Game.getView());
        Game.init(() => {
            SocketManager.init(Game.getView());
            Game.setPlayerId = socket.emit("getPlayerId");
            // Game.setRaycasterEvent(() => {
            //     const tmp = [
            //         { x: 0, y: 0, playerId: 0, isSheep: false },
            //         { x: 1, y: 0, playerId: 0, isSheep: true }
            //     ];
            //     updateWorld(tmp, "Wolf", 5, 3, 10, true);
            // })
        });
    });

    /* --------------------------------- Events --------------------------------- */

    window.addEventListener("keyup", onKeyUp);
});

function updateWorld(startGrid, playerId, currentPlayer, listPos, listWeaponUsed, score, minutes, seconds, endGame, gifName = undefined) {
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

    HUD.setScore(score);
    HUD.startChronoFrom(minutes, seconds);

    if (endGame) setTimeout(() => {
        HUD.showAnnouncement("Game finished", "Try another Game");
    }, 1000);
}

/**
 * Callback of keyup event
 * @param {KeyboardEvent} e The keyup event object
 */
function onKeyUp(e) {
    if (e.code === 'Space') {
        // Debug
    } else if (e.key === 'f') {
        const toFullscreen = document.querySelector("body");
        if (toFullscreen.requestFullscreen)
            toFullscreen.requestFullscreen();
        else if (toFullscreen.webkitRequestFullscreen)
            toFullscreen.webkitRequestFullscreen();
        else if (toFullscreen.msRequestFullscreen)
            toFullscreen.msRequestFullscreen();
    } else {
        // Check camera controls
        for (const keyCode in Config.cameraPositions) {
            if (!Config.cameraPositions.hasOwnProperty(keyCode) || e.key !== keyCode)
                continue;

            // Switch the camera position
            const pos = Config.cameraPositions[keyCode];
            Game.setCameraFromVector(pos);
        }
    }
}