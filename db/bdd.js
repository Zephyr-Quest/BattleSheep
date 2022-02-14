// Pour utiliser les fonctionc dans un autre fichier :
// const Database =require("./BDD")
// et tu auras plus qu'à faire un Database.signIn() ou autre
// (attention à adapter le chemin)

/* -------------------------------------------------------------------------- */
/*                                     BDD                                    */
/* -------------------------------------------------------------------------- */
// Connexion

const bcrypt = require("bcrypt");

const mysql = require('mysql');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

class BDD {
    constructor() {
        this.con = mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USERNAME,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.DATABASE_NAME
        });
    }

    /**
     * Insert user and password in table
     *
     * @param   {string}  user  username to insert
     * @param   {string}  pass  password
     *
     * @return  {error}        return if error
     */
    signUp(user, pass, callback) {
        // Insert element
        if (user == "" || pass == "") {
            return;
        } else if (user == null || pass == null) return;
        else {
            const users = {
                username: user,
                password: pass
            };
            let quer = "SELECT * from users WHERE username=?";
            this.con.query(quer, [user], (err, result) => {
                if (err) throw err;
                if (Object.keys(result).length != 0) {
                    console.log("Need to login - Already signed up");
                    callback(false)
                } else {
                    let query = 'INSERT into users SET ?';
                    this.con.query(query, [users], (err, result) => {
                        if (err) throw err;
                        console.log("1 Element inserted ")
                        callback(true)
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
    signIn(usr, pass, callback) {
        if (usr == "" || pass == "") {
            return;
        } else {
            let quer = "SELECT * from users WHERE username=?";
            this.con.query(quer, [usr], (err, result) => {
                if (err) throw err;
                if (result == "") console.log("Utilisateur introuvable ");
                else {
                    console.log("Résultat trouvé : ")
                    bcrypt.compare(pass, result[0].password, function (err, match) {
                        if (err) {
                            console.log(err);
                            return 0;
                        }
                        if (match) {
                            console.log("Login Success :")
                            callback(true) // Transmission BDD
                        } else {
                            console.log("Login wrong")
                            callback(false)
                        }
                    });
                }
            });
        }
    }


    /**
     * Get All table
     *
     * @param   {string}  user  username
     *
     * @return  {Array}       usr and pass
     */
    getList(callback) {
        let quer = "SELECT * from users";
        this.con.query(quer, (err, result) => {
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
    getListFromUser(usr, callback) {
        if (usr == "") return;
        else {
            let quer = "SELECT * from users WHERE username=?";
            this.con.query(quer, [usr], (err, result) => {
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
    getListFromId(id, callback) {
        if (id == "") return;
        else {
            let quer = "SELECT * from users WHERE id=?";
            this.con.query(quer, [id], (err, result) => {
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
    removeUser(username, callback) {
        // Insert element
        if (username == "") {
            return;
        } else {
            let que = 'DELETE from users WHERE username=?';
            this.con.query(que, [username], (err, result) => {
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
    removeAllUser(callback) {
        let que = 'DELETE from users';
        this.con.query(que, (err, result) => {
            if (err) throw err;
            console.log("All element removed")
            callback(result)
        })
    }

    refreshScore(user,against,score, callback){
        if (user == "" || against=="" || score=="") {
            return;
        } else {
            let que = 'SELECT * from users WHERE username=?';
            this.con.query(que, [user], (err, result) => {
                if (err) throw err;
                if(result=="") callback(false)
                else{

                    const scoreObj = {
                        firstScore: result[0].firstScore,
                        firstName: result[0].firstName,
                        secondScore: result[0].secondScore,
                        secondName: result[0].secondName,
                        thirdScore: result[0].thirdScore,
                        thirdName: result[0].thirdName
                    };
                    if(score>result[0].firstScore){
                        scoreObj.thirdName=scoreObj.secondName;
                        scoreObj.thirdScore=scoreObj.secondScore;
                        scoreObj.secondName=scoreObj.firstName;
                        scoreObj.secondScore=scoreObj.firstScore;
                        scoreObj.firstName=against;
                        scoreObj.firstScore=score;
                    } else if(score>result[0].secondScore){
                        scoreObj.thirdName=scoreObj.secondName;
                        scoreObj.thirdScore=scoreObj.secondScore;
                        scoreObj.secondName=against;
                        scoreObj.secondScore=score;
                    } else if(score>result[0].thirdScore){
                        scoreObj.thirdName=against;
                        scoreObj.thirdScore=score;
                    } 
    
                    let query = 'UPDATE users SET ? WHERE username=?';
                    this.con.query(query, [scoreObj,user], (err, result) => {
                        if (err) throw err;
                        console.log("Score Updated")
                        let Podium = {
                            first:{
                                name: scoreObj.firstName,
                                score: scoreObj.firstScore,
                            },
                            second:{
                                name: scoreObj.secondName,
                                score: scoreObj.secondScore,
                            }, 
                            third:{
                                name: scoreObj.thirdName,
                                score: scoreObj.thirdScore,
                            }
                        };
                        callback(Podium)
                    })
                }
            })
        }
    }
}

module.exports = {
    BDD
}