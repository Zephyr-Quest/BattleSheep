const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");
const mysql = require("mysql");
const bodyParser = require("body-parser");
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

/* -------------------------------------------------------------------------- */
/*                         Get the different request                          */
/* -------------------------------------------------------------------------- */

app.get("/", (req, res) => {
    console.log("Affichage BDD");
    Database.getList((res) => {
        console.log(res);
    });
    console.log("Fin affichage");

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
    let sessionData = req.session;
    if (!sessionData.username) {
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
                        Database.getList((e) => {
                            console.log(e);
                        });
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
                        Database.getList((e) => {
                            console.log(e);
                        });
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

app.get("/lobby", (req, res) => res.render("lobby"));

app.get("/game", (req, res) => res.render("game"));

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

io.on("connection", (socket) => {
    console.log("Connexion d'un joueur au jeu");

    socket.on("wrapPosition", (grid, x, y, size, rotation) => {
        // console.log(grid, x, y, size, rotation);
        let res = gridVerif.wrapPosition(grid, x, y, size, rotation);
        console.log(res)
        socket.emit("responseWrap", res);
    })



    socket.on("host-room", (username) => {
        console.log("Trying to host !");
        const roomData = [];
        roomData.push(username);
        allRooms.push(roomData);
        let res = allRooms.findIndex(function (el) {
            return el[0] == username;
        });
        console.log(username + " Hosted room : room-" + res);
        socket.join("room-" + res);
    })

    socket.on("join-room", (hostName, username) => {
        console.log("Trying to join !");
        let res = allRooms.findIndex(function (el) {
            return el[0] == hostName;
        });
        allRooms[res].push(username);
        socket.join("room-" + res);
        console.log(username + " Joined room : room-" + res + " hosted by " + hostName);
        socket.in("room-" + res).emit("play");
    })


    socket.on("leave-room", (hostName, username) => {
        console.log("Trying to disconnect !");
        let res = allRooms.findIndex(function (el) {
            return (el[0] == hostName && el[1] == username);
        });
        allRooms.splice(res, 1);
        socket.leave("room-" + res);
        console.log(username + " " + hostName + " Left the room : room-" + res);
        console.log(allRooms);
    });

    socket.on("disconnect", () => {
        console.log("Déconnexion des joueurs");
    })
});

http.listen(process.env.APP_PORT, () => {
    console.log("Serveur lancé sur le port", process.env.APP_PORT);
});