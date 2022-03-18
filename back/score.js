/**
 * Function to calcul player score
 *
 * @param   {Number}  score            The current player score
 * @param   {Number}  time             Time of the game in seconds
 * @param   {Number}  nbNewSheepFound  Number of sheep found with the last shoot
 *
 * @return  {Number} score             Score of the player
 */
function calculScore(score, time, nbNewSheepFound) {
    return score + nbNewSheepFound*100/sqrt(time);
}

export { calculScore };