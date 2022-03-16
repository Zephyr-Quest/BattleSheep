import Game from "./ThreeJS/game.js";
import SplashScreen from "./utils/SplashScreen.js";
import { Config } from "./ThreeJS/config.js";
import { HUD } from "./ThreeJS/gameplay/HUD.js";
import SocketManager from './utils/SocketManager.js';
import { Vector2 } from 'three';

window.addEventListener("load", () => {
    SplashScreen.start(() => {
        // The splash screen is done
        SplashScreen.hideScreen();

        Game.init(() => {
            Game.setRaycasterState(false);
            SocketManager.init(Game.getView());
            Game.setRaycasterEvent(clickEvent);
            Game.setCameraFromVector(Config.cameraPositions[SocketManager.getPlayerId() === 0 ? "q" : "d"]);
        });
    });

    /* --------------------------------- Events --------------------------------- */

    window.addEventListener("keyup", onKeyUp);
});

function clickEvent(pos) {
    console.log(pos);
    SocketManager.play(pos.x, pos.y, HUD.getCurrentWeapon());
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