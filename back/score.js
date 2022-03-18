let score = 0;

function calculScore(time, nbNewSheepFound) {
    score += nbNewSheepFound*100/sqrt(time);
}