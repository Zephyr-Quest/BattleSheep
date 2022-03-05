let socket = io()

socket.emit("login", "");

/* ---------------------- Display the differents rooms ---------------------- */

socket.on("display-rooms", (allRooms) => {
    let htmlScore = "";
    allRooms.forEach(element => {
        console.log("element")
        console.log(element)
        let score = "blabla";
        htmlScore += '<div class="card" title="Click to join the' + element[0] + '\'game"><ion-icon name="log-in"></ion-icon><ul><li>Host : <strong class="green">' + element[0] + '</strong></li><li>High score : <strong>' + score + '</strong></li></ul></div>'
    });
    document.getElementById("games-display").innerHTML = htmlScore;


    for (const card of document.querySelectorAll("#games-display .card")) {
        card.addEventListener("click", () => {
            let host = card.getElementsByClassName("green")[0].innerText;
            socket.emit("join-room", host)
            window.location.href = "/game"
        })
    }
})

/* -------------------------- Button to host a game ------------------------- */

document.getElementById("new_game").addEventListener("click", () => {
    console.log("Clicked to host !")
    socket.emit("host-room", "");
    window.location.href = "/game"
});

/* ----------------------------- Hide full room ----------------------------- */

socket.on("hide-card", host => {
    for (const card of document.querySelectorAll("#games-display .card")) {
        let usr = card.getElementsByClassName("green")[0].innerText;
        if (usr == host) {
            card.style.display = "none"
        }
    }
})