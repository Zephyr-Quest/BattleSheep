const delay = 1000;

module.exports = class Chrono{
    constructor(){
        this.minutes = 0;
        this.seconds = 0;
        this.stopChrono = false;
    }
    
    /**
     * Increment the chrono each second
     */
    incrementChrono() {
        // Increment seconds
        this.seconds++;
    
        // Increment minutes
        if (this.seconds > 59) {
            this.seconds = 0;
            this.minutes++;
        }
    
        // Continue
        if (!this.stopChrono) setTimeout(() => this.incrementChrono(), delay);
    }

    /**
     * Get elapased seconds since the start of the chrono
     * @returns All elapsed seconds
     */
    getTimeSeconds() {
        let seconds = Number(this.seconds);
        let minutes = Number(this.minutes);
        
        while (minutes > 0) {
            seconds += 60;
            minutes--;
        }

        return seconds;
    }
}