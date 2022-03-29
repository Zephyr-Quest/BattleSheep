/* -------------------------------------------------------------------------- */
/*                           A module to play sound                           */
/* -------------------------------------------------------------------------- */

const SOUND_PATH = "../../sound/";
const SOUND_EXT = ".mp3";

function loop(audio) {
    if (typeof audio.loop == 'boolean')
        audio.loop = true;
    else
        audio.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);
}


/* -------------------------------------------------------------------------- */
/*                              Public functions                              */
/* -------------------------------------------------------------------------- */

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

/**
 * Play the end music
 */
function playEndMusic() {
    const music = new Audio(SOUND_PATH + "music_end_game" + SOUND_EXT);
    loop(music);
    music.play();
}

export default { playCapillotractom, playRandomSheep, playEndMusic };