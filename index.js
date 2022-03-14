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
        }, {
            name: "threejs_check",
            type: "module",
        }],
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
        res.redirect("/lobby");
        return;
    }
});

app.post("/signup", body("pseudo").isLength({
        min: 3
    }).trim().escape(),
    body("password").isLength({
        min: 3
    }).trim(),
    (req, res) => {
        console.log("--- SIGN UP ---");

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
            // console.log("PSEUDO", pseudo);
            // console.log("MDP", password);
            manageUser.signUp(password, (mdp) => {
                Database.signUp(pseudo, mdp, (e) => {
                    if (e == true) {
                        req.session.username = req.body.pseudo;
                        req.session.save();
                        // console.log("Envoi vers le lobby");
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
        console.log("--- LOG IN ---");

        let pseudo = req.body.pseudo;
        let password = req.body.password;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("--- ERROR ---");
            console.log(errors);
            res.status(400).json({
                errors: errors.array(),
            });
        } else {
            // console.log("PSEUDO", pseudo);
            // console.log("MDP", password);
            manageUser.signIn(password, (mdp) => {
                Database.signIn(pseudo, mdp, (e) => {
                    if (e == true) {
                        req.session.username = req.body.pseudo;
                        req.session.save();
                        // console.log("Envoi vers le lobby");
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
        }, {
            name: "threejs_check",
            type: "module",
        }],
    });
});

app.get("/lobby", (req, res) => {
    if (!req.session.username) {
        res.redirect("/");
        return;
    }

    Database.refreshScore(req.session.username, "", "", (scoreboard) => {
        res.render("lobby", {
            username: req.session.username,
            scoreboard
        });
    });
});

app.get("/game", (req, res) => {
    // if (!req.session.username) {
    //     res.redirect("/");
    //     return;
    // }

    res.render("game");
});

app.post("/logout", (req, res) => {
    console.log("--- DECONNEXION ---");
    req.session.destroy();
    res.send('OK');
});

app.post("", (req, res) => {

})

app.get("/not_available", (req, res) => res.render("not_available"));

// Capture 404 requests
app.use((req, res) => res.render("404"));

/* -------------------------------------------------------------------------- */
/*                                    ROOMS                                   */
/* -------------------------------------------------------------------------- */


//TODO comparer les id de session au lieu des pseudos

let allRooms = [],
    disconnectedUsers = [];

io.on("connection", (socket) => {
    if (socket.handshake.session.idRoom === undefined) {
        console.log("--- LOBBY ---");
        console.log("Connexion de " + socket.handshake.session.username + " au Lobby");
    } else {
        let idRoom = socket.handshake.session.idRoom
        console.log("--- GAME ---")
        console.log("Connexion de " + socket.handshake.session.username + " à la room " + idRoom);
        socket.join(idRoom)

        if (allRooms[idRoom] && allRooms[idRoom].length == 2) {
            io.to(idRoom).emit("timeToPlay")
        }
        // io.to(idRoom).emit("disconnection")

        /* const clients = io.sockets.adapter.rooms.get(idRoom);
        for (const clientId of clients) {
            const clientSocket = io.sockets.sockets.get(clientId);
            console.log("- " + clientSocket.handshake.session.username);
        } */
    }
    if (disconnectedUsers.includes(socket.handshake.session.username)) {

        const idRoom = socket.handshake.session.idRoom;
        io.to(idRoom).emit("disconnection");
        socket.leave(idRoom);
        socket.handshake.session.idRoom = undefined;
        disconnectedUsers.splice(disconnectedUsers.indexOf(socket.handshake.session.username), 1);
    }


    socket.on('login', () => {
        /* let srvSockets = io.sockets.sockets;
        console.log("Personnes connectées au lobby :")
        srvSockets.forEach(user => {
            console.log("- " + user.handshake.session.username);
        }); */
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

        let res = allRooms.findIndex(e => e[0] == username)

        console.log(username + " is hosting room-" + res);
        socket.handshake.session.idRoom = res;

        console.log("All rooms : " + allRooms)
        io.emit("display-rooms", allRooms);
        socket.disconnect();
    });

    socket.on("join-room", (hostName) => {
        let res = allRooms.findIndex(e => e[0] == hostName)

        if (allRooms[res] && allRooms[res].length < 2) {

            let username = socket.handshake.session.username;
            if (hostName != username) {
                allRooms[res].push(username);
                socket.handshake.session.idRoom = res;

                console.log(username + " Joined room : room-" + res + " hosted by " + hostName);
                io.emit("hide-card", hostName);
                socket.disconnect();
            }
        }
    });

    socket.on("leave-room", (hostName, username) => {
        console.log("Trying to disconnect !");
        let res = allRooms.findIndex(function (el) {
            return (el[0] == hostName && el[1] == username);
        });
        allRooms.splice(res, 1);
        socket.leave(socket.handshake.session.idRoom);
        socket.handshake.session.idRoom = undefined;


        console.log(username + " " + hostName + " Left the room : room-" + res);
        console.log("All rooms : " + allRooms)
    });

    /* ---------------------------------- Game ---------------------------------- */
    socket.on("checkGrid", (grid, idPlayer) => {
        let idRoom = socket.handshake.session.idRoom;

        socket.to(idRoom).emit("resultGrid", bool)
    });


    socket.on("disconnect", (reason) => {
        console.log("Disconnection of " + socket.handshake.session.username + " reason : " + reason)
        let idRoom = socket.handshake.session.idRoom;


        console.log("All Rooms : " + allRooms)
        console.table("Room ID : " + allRooms[idRoom])

        if (reason == "transport close") {
            disconnectedUsers.push(socket.handshake.session.username);
            // socket.handshake.session.idRoom = -1;
            console.log(disconnectedUsers);

            // if (idRoom != null && allRooms[idRoom].length <= 2) {

            // io.to(idRoom).emit("disconnection")


            // socket.leave(idRoom);

            if (allRooms[idRoom] && allRooms[idRoom].length == 2) {
                allRooms[idRoom].pop()
            } else {  
                allRooms.splice(idRoom, 1);

            }
            console.log("All Rooms : " + allRooms)
            console.table("Personnes dans la room : " + allRooms[idRoom])
            console.log("Socket ID : " + socket.handshake.session.idRoom);
            socket.to(idRoom).emit("disconnection"); 


            // } else {
            //     console.log("Déconnexion de " + socket.handshake.session.username + " du lobby");
            // }

            // for (const clientId of clients) {
            //     const clientSocket = io.sockets.sockets.get(clientId);
            //     clientSocket.leave(idRoom);
            //     clientSocket.handshake.session.idRoom = null
            //     console.log("Déconnexion de " + clientSocket.handshake.session.username + " du jeu")
            // }
        }
    });
});


http.listen(process.env.APP_PORT, () => {
    console.log("Serveur lancé sur le port", process.env.APP_PORT);
});