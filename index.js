const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const mysql = require('mysql');

const manageUser = require('./back/server/crypt.js');
app.use(express.urlencoded({extended: false}));



if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const session = require('express-session')({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 2 * 60 * 60 * 1000, secure: false}
});
app.use(session)

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
    session.cookie.secure = true;
}
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', {
        title: 'BattleSheep by ZephyrStudio',
        description: 'Welcome in our Web project !',
        scripts: [{name: 'home', type: 'module'}]
    });
});

app.get('/signup', (req, res) => {
    // Here : check if the user is already connected
    // If he's not, send him the signup page
    // else, redirect him to the scoreboard page

    let sessionData = req.session;
    if (!sessionData.username) {
        console.log('Utilisateur non connecté, envoi vers formulaire de connexion')
        res.render('signup', {
            title: 'BattleSheep | Sign up, Log in',
            description: 'Sign up or log in to BattleSheep',
            scripts: [{name: 'signup', type: 'text/javascript'}]
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


app.post('/signup', (req, res) => {
    let pseudo = req.body.pseudo
    pseudo = pseudo.trim()
    pseudo = encodeURI(pseudo)
    console.log('Pseudo sécurisé')
    req.session.username = pseudo;
    req.session.save()
    console.log("Envoi vers le lobby")
    res.render('lobby', {
        title: 'BattleSheep | Lobby',
        description: 'Lobby page, to join or host a game',
        // scripts: [{name: '', type: ''}]
    });
});



app.get('/rules', (req, res) => {
    res.render('rules', {
        title: 'BattleSheep | Rules',
        description: 'BattleSheep rules',
        scripts: [{name: 'home', type: 'module'}]
    });
});

app.get('/lobby', (req, res) => res.render('lobby'));

app.get('/game', (req, res) => res.render('game'));



io.on('connection', (socket) => {
    console.log('Connexion d\'un utilisateur');

    socket.on('disconnect', () => {
        console.log('Déconnexion d\'un utilisateur');
    });
});


http.listen(process.env.APP_PORT, () => {
    console.log('Serveur lancé sur le port', process.env.APP_PORT);
});

/* -------------------------------------------------------------------------- */
/*                                     BDD                                    */
/* -------------------------------------------------------------------------- */

// Conexion
const con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.DATABASE_NAME
})

con.connect(err => {
    if (err) throw err;
    else console.log('Connexion à', process.env.DATABASE_NAME);

    /**
     * Insert user and password in table
     *
     * @param   {string}  user  username to insert
     * @param   {string}  pass  password
     *
     * @return  {error}        return if error
     */
    function signUp(user, pass) {
        // Insert element
        if (user == '' || pass == '') {
            return;
        }
        try {
            const users = {username: user, password: pass}

            sql = 'INSERT into users SET ?'
            con.query(sql, users, (err, result) => {
                if (err) throw err;
                console.log('1 element inserted')
                console.log(result)
            })
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
     * @return  {Array}        array of users matching
     */
    function signIn(usr, pass) {
        let quer = 'SELECT * from users WHERE username=\'' + usr
                   + '\' AND password=\'' + pass + '\'';
        con.query(quer, (err, result) => {
            if (err) throw err;
            if (result == '') console.log('Utilisateur introuvable');
            else {
                console.log('Résultat trouvé : ')
                console.log(result)
                return result;
            }
        })
    }

    /**
     * get user and password for a username given
     *
     * @param   {string}  user  username
     *
     * @return  {Array}       usr and pass
     */
    function getListFromUser(usr) {
        let quer = 'SELECT * from users WHERE username=\'' + usr + '\'';
        con.query(quer, (err, result) => {
            if (err) throw err;
            console.log(result)
            return result
        })
    }

    /**
     * get user and password for a id given
     *
     * @param   {string}  id  id
     *
     * @return  {Array}       usr and pass
     */
    function getListFromId(id) {
        let quer = 'SELECT * from users WHERE id=\'' + id + '\'';
        con.query(quer, (err, result) => {
            if (err) throw err;
            console.log(result)
            return result
        })
    }
})