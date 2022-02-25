export const HUD = (function () {
    // HTML elements
    const
        scoreSpan = document.getElementById("score"),
        minutesSpan = document.getElementById("minutes"),
        secondsSpan = document.getElementById("seconds"),
        weaponsMenu = document.getElementById("weapons_menu");

    // Chrono
    const delay = 1000;
    let
        chronoMinutes = 0,
        chronoSeconds = 0,
        stopChrono = false;
    
    /**
     * Increment the chrono every 'delay'
     */
    function incrementChrono() {
        // Increment seconds
        chronoSeconds++;

        // Increment minutes
        if (chronoSeconds > 59) {
            chronoSeconds = 0;
            chronoMinutes++;
        }
        
        // Display the chrono
        updateChronoHUD();

        // Continue
        if (!stopChrono)
            setTimeout(incrementChrono, delay);
    }

    /**
     * Update the chrono on the HUD
     */
    function updateChronoHUD() {
        minutesSpan.innerText = chronoMinutes < 10 ? "0" + chronoMinutes : chronoMinutes;
        secondsSpan.innerText = chronoSeconds < 10 ? "0" + chronoSeconds : chronoSeconds;
    }

    return {
        /* -------------------------------------------------------------------------- */
        /*                               Score functions                              */
        /* -------------------------------------------------------------------------- */

        /**
         * Update the score on the HUD
         * @param {Number} score The new player score
         */
        setScore(score) {
            if (typeof score !== 'number' || score < 0 || score > 20)
                return;
            
            // Set the score on the HUD
            scoreSpan.innerText = score;
        },

        /* -------------------------------------------------------------------------- */
        /*                              Chrono functions                              */
        /* -------------------------------------------------------------------------- */

        /**
         * Start the chrono from the given timestamp
         * @param {Number} minutes The timestamp minutes
         * @param {Number} seconds The timestamp seconds
         */
        startChronoFrom(minutes, seconds) {
            if (typeof minutes !== 'number' || minutes < 0 || minutes > 99)
                return;
            if (typeof seconds !== 'number' || seconds < 0 || seconds > 59)
                return;
            
            // Set the chrono
            chronoMinutes = minutes;
            chronoSeconds = seconds;

            // Display the chrono
            updateChronoHUD();

            // Start the chrono
            incrementChrono();
        },

        /**
         * Stop the chrono
         */
        stopChrono() {
            stopChrono = true;
        },

        /**
         * Restart the chrono
         */
        startChrono() {
            stopChrono = false;

            // Display the chrono
            updateChronoHUD();

            // Start the chrono
            incrementChrono();
        },

        getChronoStatus: () => !stopChrono,
        getChronoValue: () => [chronoMinutes, chronoSeconds],
        getChronoMinutes: () => chronoMinutes,
        getChronoSeconds: () => chronoSeconds,

        /* -------------------------------------------------------------------------- */
        /*                              Weapons functions                             */
        /* -------------------------------------------------------------------------- */

        /**
         * Show the weapons menu
         */
        showWeaponsMenu() {
            weaponsMenu.classList.add("show-weapons");
        },

        /**
         * Hide the weapons menu
         */
        hideWeaponsMenu() {
            weaponsMenu.classList.add("hide-weapons");
            setTimeout(() => {
                weaponsMenu.classList.remove("show-weapons");
                weaponsMenu.classList.remove("hide-weapons");
            }, 500);
        }
    };
})();