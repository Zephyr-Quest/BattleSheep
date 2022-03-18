const delay = 1000;

module.exports = class Chrono{
    constructor(){
        this.minutes = 0;
        this.seconds = 0;
        this.stopChrono = false;
    }
    
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
}