const delay = 1000;

module.exports = class Chrono{
    constructor(){
        this.minutes = 0;
        this.seconds = 0;
        this.stopChrono = false;
    }
    
    incrementChrono() {
        // Increment seconds
        chronoSeconds++;
    
        // Increment minutes
        if (chronoSeconds > 59) {
            chronoSeconds = 0;
            chronoMinutes++;
        }
    
        // Continue
        if (!stopChrono) setTimeout(this.incrementChrono(), delay);
    }
}