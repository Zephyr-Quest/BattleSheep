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
        scripts: [{
            name: 'home',
            type: 'module'
        }]
    });
});

app.get('/signup', (req, res) => {
    // Here : check if the user is already connected
    // If he's not, send him the signup page
    // else, redirect him to the scoreboard page
    res.render('signup', {
        title: 'BattleSheep | Sign up, Log in',
        description: 'Sign up or log in to BattleSheep',
        scripts: [{
            name: 'signup',
            type: 'text/javascript'
        }]
    });
});

app.get('/rules', (req, res) => {
    res.render('rules', {
        title: 'BattleSheep | Rules',
        description: 'BattleSheep rules',
        scripts: [{
            name: 'home',
            type: 'module'
        }]
    });
});

app.get('/lobby', (req, res) => res.render('lobby'));

app.post('/login', (req, res) => {
    console.log("Forms recu");
});



io.on('connection', (socket) => {
    console.log("Connexion d'un utilisateur");

    socket.on('disconnect', () => {
        console.log("Déconnexion d'un utilisateur");
    });

});



http.listen(4200, () => {
    console.log('Serveur lancé sur le port 4200');
});



/* -------------------------------------------------------------------------- */
/*                                     BDD                                    */
/* -------------------------------------------------------------------------- */

const session = require('express-session')({
    secret: "1234",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 2 * 60 * 60 * 1000,
        secure: false
    }
});
const mysql = require('mysql');

if (app.get('env') === "production") {
    app.set('trust proxy', 1);
    session.cookie.secure = true;
}

// Conexion 
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "battlesheep"
})

con.connect(err => {
    if (err) throw err;
    else console.log("Connexion effectuée");
})