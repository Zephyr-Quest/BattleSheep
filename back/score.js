let score = 0;

/**
 * Function to calcul player score
 *
 * @param   {Number}  time             Time of the game in seconds
 * @param   {Number}  nbNewSheepFound  Number of sheep found with the last shoot
 *
 * @return  {Number} score             Score of the player
 */
function calculScore(time, nbNewSheepFound) {
    score += nbNewSheepFound*100/Math.sqrt(time);
}