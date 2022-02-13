// Pour utiliser les fonctionc dans un autre fichier : 
// const Database =require("./BDD")
// et tu auras plus qu'à faire un Database.signIn() ou autre
// (attention à adapter le chemin)

/* -------------------------------------------------------------------------- */
/*                                     BDD                                    */
/* -------------------------------------------------------------------------- */
const {
    con
} = require("./BDDConnexion")

// const session = require('express-session')({
//     secret: "1234",
//     resave: true,
//     saveUninitialized: true,
//     cookie: {
//         maxAge: 2 * 60 * 60 * 1000,
//         secure: false
//     }
// });

// if (app.get('env') === "production") {
//     app.set('trust proxy', 1);
//     session.cookie.secure = true;
// }

/**
 * Insert user and password in table
 *
 * @param   {string}  user  username to insert
 * @param   {string}  pass  password
 *
 * @return  {error}        return if error
 */
export function signUp(user, pass, callback) {
    // Insert element
    if (user == "" || pass == "") {
        return;
    }
    try {
        const users = {
            username: user,
            password: pass
        }

        sql = 'INSERT into users SET ?'
        con.query(sql, users, (err, result) => {
            if (err) throw err;
            console.log("1 element inserted")
            callback(result)
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
export function signIn(usr, pass, callback) {
    let quer = "SELECT * from users WHERE username='" + usr + "' AND password='" + pass + "'";
    con.query(quer, (err, result) => {
        if (err) throw err;
        if (result == "") console.log("Utilisateur introuvable");
        else {
            console.log("Résultat trouvé : ")
            console.log(result)
            callback(result);
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
export function getListFromUser(usr, callback) {
    let quer = "SELECT * from users WHERE username='" + usr + "'";
    con.query(quer, (err, result) => {
        if (err) throw err;
        console.log(result)
        callback(result)
    })
}

/**
 * get user and password for a id given
 *
 * @param   {string}  id  id
 *
 * @return  {Array}       usr and pass
 */
export function getListFromId(id, callback) {
    let quer = "SELECT * from users WHERE id='" + id + "'";
    con.query(quer, (err, result) => {
        if (err) throw err;
        console.log(result)
        callback(result)
    })
}