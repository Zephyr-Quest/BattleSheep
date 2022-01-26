const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/front/'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/front/index.html');
});





io.on('connection', (socket) => {
    console.log("Connexion d'un utilisateur");

    socket.on('disconnect', () =>{
        console.log("Déconnexion d'un utilisateur");
    });
});



http.listen(4200, () => {
    console.log('Serveur lancé sur le port 4200');
});