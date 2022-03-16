/* -------------------------------------------------------------------------- */
/*                           A module to play sound                           */
/* -------------------------------------------------------------------------- */

const SOUND_PATH = "../../sound/";
const SOUND_EXT = ".mp3";

/**
 * Play the Capillotractom sound
 */
function playCapillotractom() {
    const sound = new Audio(SOUND_PATH + "capillotractom" + SOUND_EXT);
    sound.play();
}

/**
 * Play a random sheep sound
 */
function playRandomSheep() {
    const sheepId = Math.floor(Math.random() * 3) + 1;
    const sound = new Audio(SOUND_PATH + "sheep" + sheepId + SOUND_EXT);
    sound.play();
}

export default { playCapillotractom, playRandomSheep };