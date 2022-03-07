/* ------------------------------ HTML elements ----------------------------- */

const splashScreenDiv = document.getElementById("splash_screen");
const steps = splashScreenDiv.querySelectorAll("div");

/* --------------------------------- Params --------------------------------- */

const TRANSITION_DURATION = 2000;
const STEP_DURATION = 1000;

/* ---------------------------- Private functions --------------------------- */

/**
 * Show the given step
 * @param {number} stepId The id of the step to show
 * @param {function} callback What do after the sequence
 */
function showStep(stepId, callback) {
    steps[stepId].style.display = "flex";
    setTimeout(() => {
        steps[stepId].style.opacity = 1;
        setTimeout(() => hideStep(stepId, callback, stepId < steps.length - 1), TRANSITION_DURATION + STEP_DURATION);
    }, 20);
}

/**
 * Hide the given step
 * @param {number} stepId The id of the step to show
 * @param {function} callback What do after the sequence
 * @param {boolean} nextStep If the next step must be displayed
 */
function hideStep(stepId, callback, nextStep = false) {
    steps[stepId].style.opacity = 0;
    setTimeout(() => {
        steps[stepId].style.display = "none";
        if (nextStep) showStep(++stepId, callback);
        else callback();
    }, TRANSITION_DURATION);
}

/* ---------------------------- Public functions ---------------------------- */

/**
 * Show the entire sequence
 * @param {function} callback What do next
 */
function start(callback) {
    showStep(0, callback);
}

/**
 * Hide the splash screen
 */
function hideScreen() {
    splashScreenDiv.style.opacity = 0;
    setTimeout(() => {
        splashScreenDiv.style.display = "none";
    }, 2000);
}

export default { start, hideScreen };