let socket = io()

socket.emit("login", "");

/* ---------------------- Display the differents rooms ---------------------- */
socket.on("display-rooms", (allRooms) => {
    let htmlScore = "";
    allRooms.forEach(element => {
        console.log(element);
        if (element.length < 2)
            htmlScore += '<div class="card" title="Click to join ' + element[0].name + '\'s game"><ion-icon name="log-in"></ion-icon><ul><li class="name">Host : <strong class="green">' + element[0].name + '</strong></li><li class="score">High score : <strong>' + "blabla" + '</strong></li></ul></div>'
    });
    document.getElementById("games-display").innerHTML = htmlScore;
        
    
    for (const card of document.querySelectorAll("#games-display .card")) {
        card.addEventListener("click", () => {
            let host = card.getElementsByClassName("green")[0].innerText;
            let res = allRooms.findIndex(e => e[0].name == host)
            
            if (allRooms[res] && allRooms[res].length < 2) {
                socket.emit("join-room", host);
                window.location.href = "/game";
            }
        })
    }
    allRooms.forEach(element => {
        element.forEach(e => socket.emit("get-score", e.name));
    });
})

socket.on("display-room-score", (user, score) => {
    let nameLI = document.querySelectorAll("#games-display .card li.name")
    let scoreLI = document.querySelectorAll("#games-display .card li.score")

    for (let i = 0; i < nameLI.length; i++) {
        if (nameLI[i].innerText == "Host : " + user) {
            scoreLI[i].innerHTML = "High score : <strong>" + score + "</strong>"
        }
    }
});
/* -------------------------- Button to host a game ------------------------- */

document.getElementById("new_game").addEventListener("click", () => {
    console.log("Clicked to host !")
    socket.emit("host-room", "");
    window.location.href = "/game";
});

/* ----------------------------- Hide full room ----------------------------- */

socket.on("hide-card", host => {
    console.log(host)
    for (const card of document.querySelectorAll("#games-display .card")) {
        let usr = card.getElementsByClassName("green")[0].innerText;
        if (usr == host) {
            card.style.display = "none"
        }
    }
})