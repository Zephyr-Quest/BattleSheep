(function () {
    socket = io();

    let currentGame = new setPlayerGrid();
    socket.on("responseWrap", answer =>{
        console.log(answer)
        if (answer == true) {
            // if (wrapPosition(this.grid, Number(currentContainer.id[0]), Number(currentContainer.id[2]), currentSheep.sheepSize, this.rotation)) {
            currentGame.currentContainerDropped.appendChild(currentGame.currentBoxDropped);
            currentGame.currentSheepDropped.firstPosition = currentGame.currentContainerDropped.id;
            currentGame.currentSheepDropped.direction = currentGame.rotation;

        }
    })
})();