export const HUD = (function () {
    // HTML elements
    const
        scoreSpan = document.getElementById("score"),
        minutesSpan = document.getElementById("minutes"),
        secondsSpan = document.getElementById("seconds"),
        weaponsMenu = document.getElementById("weapons_menu"),
        announcementDiv = document.getElementById("announcement"),
        endAnnouncementDiv = document.getElementById("endAnnouncement"),
        gifDiv = document.getElementById("gif_display");

    // Chrono
    const delay = 1000;
    let
        chronoMinutes = 0,
        chronoSeconds = 0,
        stopChrono = true;
    
    // Weapons
    let currentWeapon = "Shears";
    
    // Add listeners
    for (const weaponDiv of weaponsMenu.querySelectorAll(".weapon"))
        weaponDiv.addEventListener("click", weaponChoosed);    
    
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

    /**
     * Which is called when a player click on a weapon
     * @param {PointerEvent} e 
     */
    function weaponChoosed(e) {
        let target = e.target;
        if (target.nodeName === 'IMG')
            target = target.parentElement;
        const name = target.title;

        // Check if the weapon is disabled
        if (target.classList.contains("disabled"))
            return;

        // Toggle the div style
        for (const weapon of weaponsMenu.querySelectorAll(".weapon")) {
            weapon.querySelector('.icon').style.display = 'block';
            weapon.querySelector('.icon-selected').style.display = 'none';
        }
        target.querySelector('.icon').style.display = 'none';
        target.querySelector('.icon-selected').style.display = 'block';

        // Set the using weapon
        currentWeapon = name;
    }

    /**
     * Get a weapon div by its title
     * @param {string} name The weapon name
     * @returns The weapon HTML Element
     */
    function getWeaponDivByName(name) {
        let weaponDiv = null;

        for (const currentWeapon of weaponsMenu.querySelectorAll('.weapon'))
            if (currentWeapon.title === name)
                weaponDiv = currentWeapon;

        return weaponDiv
    }

    /**
     * Show an announcement div
     * @param {HTMLElement} div The div to show
     * @param {string} title The title to print
     * @param {string} subtitle The subtitle to print
     */
    function showAnnouncementDiv(div, title, subtitle) {
        // Set content
        div.querySelector('h1').innerText = title;
        div.querySelector('h2').innerText = subtitle;

        // Set style
        div.parentElement.style.display = "flex";
        div.style.display = "block";
        setTimeout(() => {
            div.style.opacity = 1;
        }, 10);
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
        getScore: () => Number(scoreSpan.innerText),

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
                
            if (stopChrono) {
                // Start the chrono
                stopChrono = false;
                incrementChrono();
            }
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
         * Mark a weapon as blocked
         * @param {string} name The weapon name
         */
        blockWeapon(name) {
            const weapon = getWeaponDivByName(name);
            if (!weapon) throw "The weapon doesn't exist.";

            weapon.classList.add("disabled");
        },

        /**
         * Show the weapons menu
         */
        showWeaponsMenu() {
            weaponsMenu.parentElement.style.display = "flex";
        },

        /**
         * Hide the weapons menu
         */
        hideWeaponsMenu() {
            weaponsMenu.parentElement.style.display = "none";
        },

        getCurrentWeapon: () => currentWeapon,

        /**
         * Set the current weapon by updating the HUD
         * @param {String} weaponName The weapon name
         */
        setCurrentWeapon(weaponName) {
            // Get the weapon div
            let target = null;
            for (const currentWP of weaponsMenu.querySelectorAll(".weapon")) {
                if (currentWP.title === weaponName) 
                    target = currentWP;
            }
            if (!target) return;

            // Check if the weapon is disabled
            if (target.classList.contains("disabled"))
                return;

            // Toggle the div style
            for (const weapon of weaponsMenu.querySelectorAll(".weapon")) {
                weapon.querySelector('.icon').style.display = 'block';
                weapon.querySelector('.icon-selected').style.display = 'none';
            }
            target.querySelector('.icon').style.display = 'none';
            target.querySelector('.icon-selected').style.display = 'block';

            // Set the using weapon
            currentWeapon = weaponName;
        },

        /* -------------------------------------------------------------------------- */
        /*                            Announcement functions                           */
        /* -------------------------------------------------------------------------- */

        /**
         * Show an annoucement
         * @param {string} title The annoucement title
         * @param {string} subtitle The annoucement subtitle
         */
        showAnnouncement(title, subtitle) {
            showAnnouncementDiv(announcementDiv, title, subtitle);
        },

        /**
         * Show an end annoucement
         * @param {string} title The annoucement title
         * @param {string} subtitle The annoucement subtitle
         */
        showEndAnnouncement(title, subtitle) {
            showAnnouncementDiv(endAnnouncementDiv, title, subtitle);
        },

        /**
         * Show an announcement during a given time
         * @param {string} title The announcement title
         * @param {string} subtitle The announcement subtitle
         * @param {number} duration The annoucement duration (ms)
         */
        showAnnouncementDuring(title, subtitle, duration) {
            this.showAnnouncement(title, subtitle);
            setTimeout(this.hideAnnouncement, duration);
        },

        /**
         * Hide the annoucement
         */
        hideAnnouncement() {
            // Set style
            announcementDiv.style.opacity = 0;
            setTimeout(() => {
                announcementDiv.style.display = "none";
                announcementDiv.parentElement.style.display = "none";
            }, 500);
        },

        /**
         * Show a gif to the screen
         * @param {string} name The GIF name
         */
        showGif(name) {
            // Set content
            gifDiv.querySelector('img').src = "img/gifs/" + name + ".gif";

            // Set style
            gifDiv.parentElement.style.display = "flex";
            gifDiv.style.display = "block";
            setTimeout(() => {
                gifDiv.style.opacity = 1;
            }, 10);
        },

        /**
         * Show a GIF during a given time
         * @param {string} name The GIF name
         * @param {number} duration The GIF duration (ms)
         */
        showGifDuring(name, duration) {
            this.showGif(name);
            setTimeout(this.hideGif, duration);
        },

        /**
         * Hide the current GIF
         */
        hideGif() {
            // Set style
            gifDiv.style.opacity = 0;
            setTimeout(() => {
                gifDiv.style.display = "none";
                gifDiv.parentElement.style.display = "none";
            }, 500);
        },

        /* -------------------------------------------------------------------------- */
        /*                                 Start grid                                 */
        /* -------------------------------------------------------------------------- */

        /**
         * Show the start grid
         */
        showStartGrid() {
            for (const node of document.querySelectorAll(".start-grid, #buttons, main")) {
                node.style.display = "flex";
            }
            document.querySelector('nav').style.display = "none";
            document.querySelector('main').style.backgroundColor = "rgba(0, 0, 0, 0.3)";
        },

        /**
         * Hide the start grid
         */
        hideStartGrid() {
            for (const node of document.querySelectorAll(".start-grid, #buttons, main"))
                node.style.display = "none";
            document.querySelector('nav').style.display = "flex";
            document.querySelector('main').style.backgroundColor = "transparent";
        },

    };
})();