const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const ejs = require('ejs');

// app.engine('.ejs', ejs.__express);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', {
        title: 'BattleSheep by ZephyrStudio',
        description: 'Welcome in our Web project !',
        scripts: [
            { name: 'home', type: 'module' }
        ]
    });
});

app.get('/signup', (req, res) => {
    // Here : check if the user is already connected
    // If he's not, send him the signup page
    // else, redirect him to the scoreboard page
    res.render('signup', {
        title: 'BattleSheep | Sign up, Log in',
        description: 'Sign up or log in to BattleSheep',
        scripts: [
            { name: 'signup', type: 'text/javascript' }
        ]
    });
});

app.get('/rules', (req, res) => {
    res.render('rules', {
        title: 'BattleSheep | Rules',
        description: 'BattleSheep rules',
        scripts: [
            { name: 'home', type: 'module' }
        ]
    });
});

app.get('/lobby', (req, res) => res.render('lobby'));

app.get('/game', (req, res) => res.render('game'));

app.post('/login', (req, res)=>{
    console.log("Forms recu");
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