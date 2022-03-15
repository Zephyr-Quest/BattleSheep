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
const BSGame = require("./back/BattlesheepGame")

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

function getMaxKey(obj) {
    let result = -1;

    Object.keys(obj).forEach(key => {
        if (key > result) result = key;
    });

    return result;
}

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
    if (!req.session.username) {
        res.redirect("/");
        return;
    }

    res.render("game");
});

app.post("/logout", (req, res) => {
    console.log("--- DECONNEXION ---");
    req.session.destroy();
    res.send('OK');
});

app.get("/not_available", (req, res) => res.render("not_available"));

// Capture 404 requests
app.use((req, res) => res.render("404"));

/* -------------------------------------------------------------------------- */
/*                                    ROOMS                                   */
/* -------------------------------------------------------------------------- */


//TODO comparer les id de session au lieu des pseudos

let allRooms = {};
let allGames = {};
let disconnectedUsers = [];

let iiiii = 0;

io.on("connection", (socket) => {
    const username = socket.handshake.session.username;

    if (socket.handshake.session.idRoom === undefined) {
        console.log("--- LOBBY ---");
        console.log("Connexion de ", username, " au Lobby");
    } else {
        let idRoom = socket.handshake.session.idRoom
        console.log("--- GAME ---")
        console.log("Connexion de ", username, " à la room ", idRoom);
        socket.join(idRoom)
        console.log(allRooms[idRoom])
        if (allRooms[idRoom] && allRooms[idRoom].length == 2) {
            console.log("Time to play")
            io.to(idRoom).emit("timeToPlay");
        }
    }
    if (disconnectedUsers.includes(username)) {

        const idRoom = socket.handshake.session.idRoom;
        io.to(idRoom).emit("disconnection");
        socket.leave(idRoom);
        socket.handshake.session.idRoom = undefined;
        disconnectedUsers.splice(disconnectedUsers.indexOf(username), 1);
    }

    /* -------------------------------------------------------------------------- */
    /*                                    Lobby                                   */
    /* -------------------------------------------------------------------------- */

    socket.on('login', () => {
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
        let res = iiiii++;
        let data = {
            name: username,
            playerId: 0,
            validGrid: false
        };
        allRooms[res] = [data]


        console.log(username, " is hosting room-", res);
        socket.handshake.session.idRoom = res;

        console.log("All rooms : ", allRooms)
        io.emit("display-rooms", allRooms);
        socket.disconnect();
    });

    socket.on("join-room", (hostName) => {
        let res = Object.keys(allRooms).findIndex(key => allRooms[key][0].name == hostName)
        console.log(allRooms[res])
        if (allRooms[res] && allRooms[res].length < 2) {

            let username = socket.handshake.session.username;
            if (hostName != username) {
                let data = {
                    name: username,
                    playerId: 1,
                    validGrid: false
                };
                allRooms[res].push(data);
                socket.handshake.session.idRoom = res;
                console.log(username, " Joined room : room-", res, " hosted by ", hostName);
                io.emit("hide-card", hostName);

                socket.disconnect();
            }
        }
    });


    /* -------------------------------------------------------------------------- */
    /*                                    Game                                    */
    /* -------------------------------------------------------------------------- */

    socket.on("checkGrid", (grid) => {
        let idRoom = socket.handshake.session.idRoom;
        let username = socket.handshake.session.username;
        // let result = false;

        let nbSheep = 0;

        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                if (grid[x][y] != undefined) {
                    nbSheep++;
                }
            }
        }


        // if (nbSheep === 20) result = true;
        // else result = false;

        if (nbSheep === 20) {
            let idArray = allRooms.findIndex(function (e) {
                return (e[0].name == username || e[1].name == username);
            });
            let idPlayer = allRooms[idArray].findIndex(e => e.name == username)

            allRooms[idArray][idPlayer].validGrid = true;

            if (allRooms[idArray].every(e => e.validGrid == true)) {
                return io.to(idRoom).emit("startGameplay");
            } else return socket.emit("resultGrid", true);
        }
        return socket.emit("resultGrid", false);
    });

    socket.on("getPlayerGrid", () => {
        const idRoom = socket.handshake.session.idRoom;
        const username = socket.handshake.session.username;
        let id = 0;
        allRooms[idRoom][0].name === username ? id = 0 : id = 1;
        socket.emit("resultPlayerId", id);
    })

    socket.on("checkGrid", (grid) => {
        let idRoom = socket.handshake.session.idRoom;
        let username = socket.handshake.session.username;

        let nbSheep = 0;
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                if (grid[x][y] != undefined) nbSheep++;
            }
        }

        if (nbSheep === 20) {
            let idPlayer = allRooms[idRoom].findIndex(e => e.name == username)

            allRooms[idRoom][idPlayer].validGrid = true;
            let game = new BSGame(idRoom)
            game.addPlayer(allRooms[idRoom][idPlayer].name, grid)
            allGames[idRoom] = game;

            if (allRooms[idRoom].every(e => e.validGrid == true)) {


                return io.to(idRoom).emit("startGameplay");
            } else return socket.emit("resultGrid", true);
        }
        return socket.emit("resultGrid", false);
    });

    /* ------------------------------- Disconnect ------------------------------- */

    socket.on("disconnect", (reason) => {
        console.log("Disconnection of ", socket.handshake.session.username, " reason : ", reason);
        let idRoom = socket.handshake.session.idRoom;


        console.log("All Rooms : ", allRooms)
        console.log("Room ID : ", allRooms[idRoom])

        if (reason == "transport close") {
            disconnectedUsers.push(socket.handshake.session.username);
            console.log(disconnectedUsers);

            if (allRooms[idRoom] && allRooms[idRoom].length == 2) {
                for (let i = 0; i < 2; i++) {
                    allRooms[idRoom][i].playerId = undefined;
                    allRooms[idRoom][i].validGrid = false;
                } 
                delete allRooms[idRoom];

               // allRooms[idRoom].pop()
            }// } else {
            //     delete allRooms[idRoom]
            //     //delete allGames[idRoom]
            //     // allRooms.splice(idRoom, 1);
            //     // allGames.splice(idRoom, 1);
            // }
            console.log("All Rooms : " + allRooms)
            console.log("Personnes dans la room : " + allRooms[idRoom])
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