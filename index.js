const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const {
    body,
    validationResult
} = require('express-validator');

const jsonParse = bodyParser.json();
// const urlencodedParse = bodyParser.urlencoded({extended: false});
const manageUser = require('./back/server/crypt.js');
const {
    connect
} = require('http2');



if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const session = require('express-session')({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 2 * 60 * 60 * 1000,
        secure: false
    }
});

app.use(jsonParse);
app.use(session)
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
    session.cookie.secure = true;
}


/* -------------------------------------------------------------------------- */
/*                         Get the different request                          */
/* -------------------------------------------------------------------------- */


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
    let sessionData = req.session;
    if (!sessionData.username) {
        console.log(
            'Utilisateur non connecté, envoi vers formulaire de connexion');
        res.render('signup', {
            title: 'BattleSheep | Sign up, Log in',
            description: 'Sign up or log in to BattleSheep',
            scripts: [{
                    name: 'http',
                    type: 'text/javascript'
                },
                {
                    name: 'signup',
                    type: 'text/javascript'
                }
            ]
        });
    } else {
        console.log('Utilisateur connecté, envoi vers le lobby')
        res.render('lobby', {
            title: 'BattleSheep | Lobby',
            description: 'Lobby page, to join or host a game',
            // scripts: [{name: '', type: ''}]
        });
    }
});

app.post('/signup',
    body('pseudo').isLength({
        min: 3
    }).trim().escape(),
    body('password').isLength({
        min: 3
    }).trim(),
    (req, res) => {
        console.log("---SIGN UP---")

        let pseudo = req.body.pseudo;
        let password = req.body.password;

             const errors = validationResult(req)
             if (!errors.isEmpty()) {
                 console.log('---ERROR---')
                 console.log(errors);
                 res.status(400).json({errors: errors.array()});
             }
             else {
                 console.log('PSEUDO', pseudo);
                 console.log('MDP', password);
                 // manageUser.cryptPassword(password)
                 //! envoi à la BDD

            req.session.username = req.body.pseudo;
            req.session.save();
            console.log('Envoi vers le lobby');
            res.send('OK');
        }
    });
// Pas d'inquiétude sur cette fin de fonction,
// c'est juste clang-format qui fout la merde
// Résolu dès que clang 14 est release

app.post('/login',
    body('pseudo').isLength({
        min: 3
    }).trim().escape(),
    body('password').isLength({
        min: 3
    }).trim(),
    (req, res) => {
        console.log("---LOG IN---")

        let pseudo = req.body.pseudo;
        let password = req.body.password;

             const errors = validationResult(req)
             if (!errors.isEmpty()) {
                 console.log('---ERROR---')
                 console.log(errors);
                 res.status(400).json({errors: errors.array()});
             }
             else {
                 console.log('PSEUDO', pseudo);
                 console.log('MDP', password);
                 //! check avec la BDD

            req.session.username = req.body.pseudo;
            req.session.save();
            console.log('Envoi vers le lobby');
            res.send('OK');
        }
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

app.get('/game', (req, res) => res.render('game'));

app.get('/logout', (req, res) => {
    console.log("---DECONNEXION---")
    req.session.destroy()
    res.render('index', {
        title: 'BattleSheep by ZephyrStudio',
        description: 'Welcome in our Web project !',
        scripts: [{name: 'home', type: 'module'}]
    });
});



io.on('connection', (socket) => {
    console.log('Connexion d\'un joueur au jeu');

    socket.on('disconnect', () => {
        console.log('Déconnexion d\'un joueur');
    });
});


http.listen(process.env.APP_PORT, () => {
    console.log('Serveur lancé sur le port', process.env.APP_PORT);
});

/* -------------------------------------------------------------------------- */
/*                                     BDD                                    */
/* -------------------------------------------------------------------------- */

// Connexion
const con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.DATABASE_NAME
});

con.connect(err => {
    if (err) throw err;
    else console.log('Connexion à', process.env.DATABASE_NAME);

    /**
     * Insert user and password in table
     *
     * @param   {string}  user  username to insert
     * @param   {string}  pass  password
     *
     * @return  {error}         return if error
     */
    function signUp(user, pass) {
        // Insert element
        if (user == '' || pass == '') {
            return;
        }
        try {
            const users = {
                username: user,
                password: pass
            }

            sql = 'INSERT into users SET ?';
            con.query(sql, users, (err, result) => {
                if (err) throw err;
                console.log('1 element inserted');
                console.log(result);
            });
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * look for user in table with correct password
     *
     * @param   {string}  user  username
     * @param   {string}  pass  password
     *
     * @return  {Array}         array of users matching
     */
    function signIn(user, pass) {
        let quer = "SELECT * from users WHERE username='" + user
                   + "' AND password='" + pass + "'";
        con.query(quer, (err, result) => {
            if (err) throw err;
            if (result == '') console.log('Utilisateur introuvable');
            else {
                console.log('Résultat trouvé : ');
                console.log(result);
                return result;
            }
        });
    }

    /**
     * get user and password for a username given
     *
     * @param   {string}  user  username
     *
     * @return  {Array}         user and pass
     */
    function getListFromUser(usr) {
        let quer = "SELECT * from users WHERE username='" + usr + "'";
        con.query(quer, (err, result) => {
            if (err) throw err;
            console.log(result);
            return result;
        });
    }

    /**
     * get user and password for a id given
     *
     * @param   {string}  id  id
     *
     * @return  {Array}       user and pass
     */
    function getListFromId(id) {
        let quer = "SELECT * from users WHERE id='" + id + "'";
        con.query(quer, (err, result) => {
            if (err) throw err;
            console.log(result);
            return result;
        });
    }
});

const Database = require("./db/bdd")