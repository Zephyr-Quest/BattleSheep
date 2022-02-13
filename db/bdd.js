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

/**
 * Insert user and password in table
 *
 * @param   {string}  user  username to insert
 * @param   {string}  pass  password
 *
 * @return  {error}        return if error
 */
function signUp(user, pass, callback) {
    // Insert element
    if (user == "" || pass == "") {
        return;
    } else {
        const users = {
            username: user,
            password: pass
        }
        let quer = "SELECT * from users WHERE username='" + user + "'";
        con.query(quer, (err, result) => {
            if (err) throw err;
            if (Object.keys(result).length != 0) {
                console.log("Need to login - Already signed up")
            } else {
                let query = 'INSERT into users SET ?'
                con.query(query, users, (err, result) => {
                    if (err) throw err;
                    console.log("1 Element inserted ")
                    callback(result)
                })
            }
        })
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
function signIn(usr, pass, callback) {
    if (usr == "" || pass == "") {
        return;
    } else {
        let quer = "SELECT * from users WHERE username='" + usr + "' AND password='" + pass + "'";
        con.query(quer, (err, result) => {
            if (err) throw err;
            if (result == "") console.log("Utilisateur introuvable ");
            else {
                console.log("Résultat trouvé : ")
                callback(result);
            }
        })
    }
}


/**
 * Get All table
 *
 * @param   {string}  user  username
 *
 * @return  {Array}       usr and pass
 */
function getList(callback) {
    let quer = "SELECT * from users";
    con.query(quer, (err, result) => {
        if (err) throw err;
        callback(result)
    })
}

/**
 * get user and password for a username given
 *
 * @param   {string}  user  username
 *
 * @return  {Array}       usr and pass
 */
function getListFromUser(usr, callback) {
    if (usr == "") return;
    else {
        let quer = "SELECT * from users WHERE username='" + usr + "'";
        con.query(quer, (err, result) => {
            if (err) throw err;
            callback(result)
        })
    }
}

/**
 * get user and password for a id given
 *
 * @param   {string}  id  id
 *
 * @return  {Array}       usr and pass
 */
function getListFromId(id, callback) {
    if (id == "") return;
    else {
        let quer = "SELECT * from users WHERE id='" + id + "'";
        con.query(quer, (err, result) => {
            if (err) throw err;
            callback(result)
        })
    }
}

/**
 * Remove user from DB
 *
 * @param   {String}  username  Username to remove
 * @param   {callback}  callback  
 *
 * @return  {Array}            
 */
function removeUser(username, callback) {
    // Insert element
    if (username == "") {
        return;
    } else {
        let que = 'DELETE from users WHERE username="' + username + '"';
        con.query(que, (err, result) => {
            if (err) throw err;
            console.log("1 element removed")
            callback(result)
        })
    }
}

/**
 * Remove user from DB
 *
 * @param   {String}  username  Username to remove
 * @param   {callback}  callback  
 *
 * @return  {Array}            
 */
function removeAllUser(callback) {
    let que = 'DELETE from users';
    con.query(que, (err, result) => {
        if (err) throw err;
        console.log("All element removed")
        callback(result)
    })
}

module.exports = {
    signIn,
    signUp,
    getList,
    getListFromId,
    getListFromUser,
    removeUser,
    removeAllUser
}