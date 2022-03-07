const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const sharedsession = require('express-socket.io-session');

const {
    body,
    validationResult
} = require("express-validator");

const jsonParse = bodyParser.json();
// const urlencodedParse = bodyParser.urlencoded({extended: false});
const manageUser = require("./back/manageUser");
// const gridVerif = require ("./back/verif")

const {
    connect
} = require("http2");

const {
    BDD
} = require("./db/bdd");
const {
    all
} = require("express/lib/application");
const {
    hostname
} = require("os");
const Database = new BDD();

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const session = require("express-session")({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 2 * 60 * 60 * 1000,
        secure: false,
    },
});

app.use(jsonParse);
app.use(session);
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'img', 'favicon.ico')));

if (app.get("env") === "production") {
    app.set("trust proxy", 1);
    session.cookie.secure = true;
}

io.use(sharedsession(session, {
    // Session automatiquement sauvegardée en cas de modification
    autoSave: true
}));

/* -------------------------------------------------------------------------- */
/*                         Get the different request                          */
/* -------------------------------------------------------------------------- */

app.get("/", (req, res) => {
    res.render("index", {
        title: "BattleSheep by ZephyrStudio",
        description: "Welcome in our Web project !",
        scripts: [{
            name: "home",
            type: "module",
        }, ],
    });
});

app.get("/signup", (req, res) => {
    // Here : check if the user is already connected
    // If he's not, send him the signup page
    // else, redirect him to the scoreboard page
    if (!req.session.username) {
        console.log("Utilisateur non connecté, envoi vers formulaire de connexion");
        res.render("signup", {
            title: "BattleSheep | Sign up, Log in",
            description: "Sign up or log in to BattleSheep",
            scripts: [{
                    name: "http",
                    type: "text/javascript",
                },
                {
                    name: "signup",
                    type: "text/javascript",
                },
            ],
        });
    } else {
        console.log("Utilisateur connecté, envoi vers le lobby");
        res.render("lobby", {
            title: "BattleSheep | Lobby",
            description: "Lobby page, to join or host a game",
            // scripts: [{name: '', type: ''}]
        });
    }
});

app.post("/signup", body("pseudo").isLength({
        min: 3
    }).trim().escape(),
    body("password").isLength({
        min: 3
    }).trim(),
    (req, res) => {
        console.log("---SIGN UP---");

        let pseudo = req.body.pseudo;
        let password = req.body.password;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("---ERROR---");
            console.log(errors);
            res.status(400).json({
                errors: errors.array(),
            });
        } else {
            console.log("PSEUDO", pseudo);
            console.log("MDP", password);
            manageUser.signUp(password, (mdp) => {
                Database.signUp(pseudo, mdp, (e) => {
                    if (e == true) {
                        req.session.username = req.body.pseudo;
                        req.session.save();
                        console.log("Envoi vers le lobby");
                        // Database.getList((e) => {
                        //     console.log(e);
                        // });
                        res.send('OK');
                    }
                    // TODO AFFICHER DE RECOMMENCER SI FALSE
                });
            });
        }
    }
);

app.post("/login", body("pseudo").isLength({
        min: 3,
    }).trim().escape(),
    body("password").isLength({
        min: 3,
    })
    .trim(),
    (req, res) => {
        console.log("---LOG IN---");

        let pseudo = req.body.pseudo;
        let password = req.body.password;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("---ERROR---");
            console.log(errors);
            res.status(400).json({
                errors: errors.array(),
            });
        } else {
            console.log("PSEUDO", pseudo);
            console.log("MDP", password);
            manageUser.signIn(password, (mdp) => {
                Database.signIn(pseudo, mdp, (e) => {
                    if (e == true) {
                        req.session.username = req.body.pseudo;
                        req.session.save();
                        console.log("Envoi vers le lobby");
                        // Database.getList((e) => {
                        //     console.log(e);
                        // });
                        res.send('OK');
                    }

                    // TODO AFFICHER DE RECOMMENCER SI FALSE      

                });
            });
        }
    }
);

app.get("/rules", (req, res) => {
    res.render("rules", {
        title: "BattleSheep | Rules",
        description: "BattleSheep rules",
        scripts: [{
            name: "home",
            type: "module",
        }],
    });
});

app.get("/lobby", (req, res) => {
    if(!req.session.username){
        res.redirect("")
    }
    else{
        res.render("lobby");
    }
});

app.get("/game", (req, res) => {
    if(!req.session.username){
        res.redirect("/") 
    }
    else{
        res.render("game");
    }});
app.get("/grid", (req, res) => {
    res.render("grid", {
        title: "BattleSheep | grid",
        description: "grille des moutons",
        scripts: [{
                name: "grid",
                type: "class",
            },
            {
                name: "setPlayerGrid",
                type: "class",
            },
            {
                name: "sheep",
                type: "class",
            },
            {
                name: "setPlayerGrid",
                type: "class",
            },
            {
                name: "main",
                type: "text/javascript",
            }
        ],
    });
});

app.post("/logout", (req, res) => {
    console.log("---DECONNEXION---");
    req.session.destroy();
    res.send('OK');
});

// Capture 404 requests
app.use((req, res) => res.render("404"));

/* -------------------------------------------------------------------------- */
/*                                    ROOMS                                   */
/* -------------------------------------------------------------------------- */

let allRooms = [];

//TODO comparer les id de session au lieu des pseudos

io.on("connection", (socket) => {
    if(socket.handshake.session.idRoom == null){
        console.log("Connexion de "+socket.handshake.session.username + " au Lobby");
    }
    else{
        console.log("Connexion de "+socket.handshake.session.username + " à la " + socket.handshake.session.idRoom);
    }

    socket.on('login', () => {
        let srvSockets = io.sockets.sockets;
        console.log("Personnes connectées :")
        srvSockets.forEach(user => {
            console.log("- "+user.handshake.session.username);
        });
        Database.refreshScore(socket.handshake.session.username, "", "", (a) => {
            io.emit("display-score", a);
        });
        io.emit("display-rooms", allRooms);
        socket.emit("display-username", socket.handshake.session.username);
    });

    socket.on("get-score", user => {
        Database.refreshScore(user, "", "", (a) => {
            io.emit("display-room-score", user, a.first.score);
        });
    })

    /* ---------------------------------- Rooms ---------------------------------- */
    socket.on("host-room", () => {
        let username = socket.handshake.session.username;
        const roomData = [];
        roomData.push(username);
        allRooms.push(roomData);
        let res = allRooms.findIndex(function (el) {
            return el[0] == username;
        });
        console.log(username + " is hosting room-" + res);
        socket.join("room-" + res);
        socket.handshake.session.idRoom = "room-" + res;

        console.log("All rooms : "+allRooms)
        io.emit("display-rooms", allRooms);
    });

    socket.on("join-room", (hostName) => {
        let username = socket.handshake.session.username;
        if (hostName != username) {
            let res = allRooms.findIndex(function (el) {
                return el[0] == hostName;
            });
            allRooms[res].push(username);
            socket.join("room-" + res);
            console.log(username + " Joined room : room-" + res + " hosted by " + hostName);
            socket.handshake.session.idRoom = "room-" + res;

            io.emit("hide-card", hostName);
        }
    });

    socket.on("leave-room", (hostName, username) => {
        console.log("Trying to disconnect !");
        let res = allRooms.findIndex(function (el) {
            return (el[0] == hostName && el[1] == username);
        });
        allRooms.splice(res, 1);
        socket.leave("room-" + res);
        console.log(username + " " + hostName + " Left the room : room-" + res);
        console.log("All rooms : "+allRooms)
    });

    /* ---------------------------------- Game ---------------------------------- */
    socket.on("", () => {
        //! A utiliser dans socket du game    socket.to(...session.idRoom).emit("play");

    });

    socket.on("disconnect", () => {
        console.log("Déconnexion de " + socket.handshake.session.username);
    });
});


http.listen(process.env.APP_PORT, () => {
    console.log("Serveur lancé sur le port", process.env.APP_PORT);
});

const res = await axios.get('http://localhost:8080/game');
// Axios follows the redirect and sends a GET `/to` request, so the
// response will contain the string "Hello, World!"
res.data;