/* -------------------------------------------------------------------------- */
/*                                  Libraries                                 */
/* -------------------------------------------------------------------------- */
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const sharedsession = require('express-socket.io-session');
const { calculScore } = require('./back/score');

const {
    body,
    validationResult
} = require("express-validator");

const jsonParse = bodyParser.json();
// const urlencodedParse = bodyParser.urlencoded({extended: false});
const manageUser = require("./back/manageUser");
const BSGame = require("./back/BattlesheepGame");

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
const Verif = require('./back/weapons');

const Database = new BDD();

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

/* ------------------------- Session initialization ------------------------- */
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
    // Session automatically change if changement
    autoSave: true
}));

/**
 * Obtain the higher id of an object
 * @param {Object} obj 
 * @return {String} max id
 */
function getMaxKey(obj) {
    let result = -1;

    Object.keys(obj).forEach(key => {
        if (key > result) result = key;
    });
    return result;
}

/* -------------------------------------------------------------------------- */
/*                         Get the different request                          */
/* -------------------------------------------------------------------------- */
// get the index page
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

// get the signup page
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

// post request to signup
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

// post request to login
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
            manageUser.signIn(password, (mdp) => {
                Database.signIn(pseudo, mdp, (e) => {
                    if (e == true) {
                        req.session.username = req.body.pseudo;
                        req.session.save();
                        res.send('OK');
                    }

                    // TODO AFFICHER DE RECOMMENCER SI FALSE      

                });
            });
        }
    }
);

// get the rule page
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

// get the lobby page
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

// get the game page
app.get("/game", (req, res) => {
    if (!req.session.username) {
        res.redirect("/");
        return;
    }

    res.render("game");
});

// post request to logout
app.post("/logout", (req, res) => {
    console.log("--- DECONNEXION ---");
    req.session.destroy();
    res.send('OK');
});

// get the not available page (if browser = firefox for example)
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

// connection to socket
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

        if (!disconnectedUsers.includes(username)) {
            const id = allRooms[idRoom][0].name === username ? 0 : 1;
            socket.emit("resultPlayerId", id);
            if (allRooms[idRoom] && allRooms[idRoom].length == 2) {
                console.log("Time to play")
                io.to(idRoom).emit("timeToPlay");
            }
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

    // get and emit to everyone his score and rooms already created
    socket.on('login', () => {
        Database.refreshScore(socket.handshake.session.username, "", "", (a) => {
            io.emit("display-score", a);
        });
        io.emit("display-rooms", allRooms);
        socket.emit("display-username", socket.handshake.session.username);
    });

    // emit to the everyone the score of the actual rooms
    socket.on("get-score", user => {
        Database.refreshScore(user, "", "", (a) => {
            io.emit("display-room-score", user, a.first.score);
        });
    })

    /* -------------------------------------------------------------------------- */
    /*                                    Rooms                                   */
    /* -------------------------------------------------------------------------- */

    // create a new room and emit it to everyone on lobby
    socket.on("host-room", () => {
        let username = socket.handshake.session.username;
        let res = Number(getMaxKey(allRooms)) + 1;
        let data = {
            name: username,
            playerId: 0,
            validGrid: false
        };

        // Create room and game
        allRooms[res] = [data]
        allGames[res] = new BSGame(res);
        allGames[res].addPlayer(username);

        console.log(username, " is hosting room-", res);
        socket.handshake.session.idRoom = res;

        io.emit("display-rooms", allRooms);
        socket.disconnect();
    });

    // join the room clicked (by the hostname) and emit to everyone to hide the joined room
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
                allGames[res].addPlayer(username);
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

    // the player ("playerId") play at the "x", "y" coordinates with the "weapon" 
    socket.on("playerPlayed", (x, y, playerId, weapon) => {
        // The player with the id "playerId", played on the case with the position "x", "y", with the weapon "weapon" 
        const idRoom = socket.handshake.session.idRoom;
        const currentGame = allGames[idRoom];
        const touchedId = playerId === 0 ? 1 : 0;
        const touchedGrid = currentGame.playerStartGrids[touchedId];

        // Check attack data
        let isCorrect = Verif.isCoordValid(x, y);
        isCorrect &&= (currentGame.currentPlayer === playerId);
        isCorrect &&= (Verif.isWeapon(weapon));
        isCorrect &&= (!currentGame.weaponsUsed[playerId].includes(weapon));
        if (!isCorrect) return;

        console.log("### Player", playerId, "is playing (room " + idRoom + ") ###");
        console.log("Weapon :", weapon);
        console.log("Target position :", x, y);

        // Calcul damages
        const result = Verif.attack(touchedGrid, weapon, x, y, currentGame.history, touchedId);
        for (let i = 0; i < result.length; i++)
            result[i].playerId = touchedId;
        console.log("The player touched :", result);

        // Update the player's score
        let nbNewFoundSheep = 0;
        result.forEach(res => {
            if (res.state === 2)
                nbNewFoundSheep++;
        })
        currentGame.scores[playerId] += calculScore(currentGame.chrono.getTimeSeconds(), nbNewFoundSheep);

        // Update the game state
        result.forEach(damage => {
            currentGame.addToHistory(damage);
        });
        currentGame.currentPlayer = touchedId;
        if (weapon !== "Shears")
            currentGame.weaponsUsed[playerId].push(weapon);
        console.log("The game is finished ?", currentGame.isGameFinished);

        // Store scores
        if (currentGame.isGameFinished)
            Database.refreshScore(currentGame.players[playerId], currentGame.players[touchedId], Math.floor(currentGame.scores[playerId]));

        // Get the touched flock
        const flock = Verif.propagationWrapper(currentGame.playerStartGrids[touchedId], x, y);
        console.log(flock);

        // Get the flock state
        let isFlockDown = true;
        if (flock)
            isFlockDown = flock.every( coord => currentGame.isInHistory(coord.x, coord.y, touchedId) );
        else isFlockDown = false;
        
        // Send the refresh to the front-end
        const players = io.sockets.adapter.rooms.get(idRoom);
        for (const p of players) {
            const pSocket = io.sockets.sockets.get(p);
            const pUsername = pSocket.handshake.session.username;
            const pId = allRooms[idRoom].findIndex(e => e.name == pUsername);

            pSocket.emit(
                "resultPlay",
                currentGame.playerStartGrids[pId],
                currentGame.currentPlayer,
                currentGame.history,
                currentGame.weaponsUsed[pId],
                currentGame.chrono.minutes,
                currentGame.chrono.seconds,
                currentGame.isGameFinished,
                isFlockDown,
                Math.floor(currentGame.scores[pId])
            );
        }
    });

    // Verify the grid when the user validate it, if both grid are verified, start gameplay
    socket.on("checkGrid", (grid) => {
        let idRoom = socket.handshake.session.idRoom;
        let username = socket.handshake.session.username;

        let nbSheep = 0;
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                if (grid[x][y] != undefined) nbSheep++;
            }
        }

        nbSheep = 20;
        if (nbSheep === 20) {
            let idPlayer = allRooms[idRoom].findIndex(e => e.name == username)

            allRooms[idRoom][idPlayer].validGrid = true;
            allGames[idRoom].playerStartGrids[idPlayer] = grid;

            if (allRooms[idRoom].every(e => e.validGrid == true)) {
                io.to(idRoom).emit("startGameplay");
                allGames[idRoom].chrono.incrementChrono();
                return;
            } else return socket.emit("resultGrid", true);
        }
        return socket.emit("resultGrid", false);
    });

/* -------------------------------------------------------------------------- */
/*                                Disconnection                               */
/* -------------------------------------------------------------------------- */


    socket.on("disconnect", (reason) => {
        console.log("Disconnection of ", socket.handshake.session.username, " reason : ", reason);
        let idRoom = socket.handshake.session.idRoom;

        if (reason == "transport close") {
            disconnectedUsers.push(socket.handshake.session.username);
            console.log(disconnectedUsers);

            if (allRooms[idRoom] && allRooms[idRoom].length == 2) {
                allRooms[idRoom].pop();
                allRooms[idRoom][0].username = "!";
            } else {
                delete allRooms[idRoom];
            }
            socket.to(idRoom).emit("disconnection");
        }
    });
});

http.listen(process.env.APP_PORT, () => {
    console.log("Serveur lancé sur le port", process.env.APP_PORT);
});