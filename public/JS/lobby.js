let socket = io()

socket.emit("login", "");


/* -------------------------- Display the username -------------------------- */
socket.on("display-username", username => {
    document.getElementById("username").innerText = username;
})

/* --------------------------- Display the podium --------------------------- */
socket.on("display-score", (podium) => {
    document.getElementById("firstName").innerText = podium.first.name;
    document.getElementById("firstScore").innerText = podium.first.score;
    document.getElementById("secondName").innerText = podium.second.name;
    document.getElementById("secondScore").innerText = podium.second.score;
    document.getElementById("thirdName").innerText = podium.third.name;
    document.getElementById("thirdScore").innerText = podium.third.score;
    
    
    let card1 = document.getElementById("card1")
    let card2 = document.getElementById("card2")
    let card3 = document.getElementById("card3")
    if (document.getElementById("firstName").innerText == "") {
        card1.style.display = "none";
    } else {
        card1.style.display = "flex";
    }
    if (document.getElementById("secondName").innerText == "") {
        card2.style.display = "none";
    } else {
        card2.style.display = "flex";
    }
    if (document.getElementById("thirdName").innerText == "") {
        card3.style.display = "none";
    } else {
        card3.style.display = "flex";
    }
    
});

/* ---------------------- Display the differents rooms ---------------------- */
socket.on("display-rooms",(allRooms)=>{
    let htmlScore="";
    allRooms.forEach(element => {
        console.log("element")
        console.log(element)
        // let score = socket.emit("get-score", element.roomData.username)
        let score="blabla";
        htmlScore += '<div class="card" title="Click to join the'+element[0]+'\'game"><ion-icon name="log-in"></ion-icon><ul><li>Host : <strong class="green">'+element[0]+'</strong></li><li>High score : <strong>'+score+'</strong></li></ul></div>'
    });
    document.getElementById("games-display").innerHTML=htmlScore;
    

    for (const card of document.querySelectorAll("#games-display .card")) {
        card.addEventListener("click",()=>{
            let host=card.getElementsByClassName("green")[0].innerText;
            socket.emit("join-room",host)
            window.location.href = "/game"
        })
    }
})

/* -------------------------- Button to host a game ------------------------- */
document.getElementById("new_game").addEventListener("click",()=>{
    console.log("Clicked to host !")
    socket.emit("host-room","");
    window.location.href = "/game"
})
/* ----------------------------- Hide full room ----------------------------- */
socket.on("hide-card",host=>{
    for (const card of document.querySelectorAll("#games-display .card")) {
        let usr=card.getElementsByClassName("green")[0].innerText;
        if(usr==host){
            card.style.display="none" 
        }
    }
})