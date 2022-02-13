/* -------------------------------------------------------------------------- */
/*                                     BDD                                    */
/* -------------------------------------------------------------------------- */

const session = require('express-session')({
    secret: "1234",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 2 * 60 * 60 * 1000,
        secure: false
    }
});
const mysql = require('mysql');

if (app.get('env') === "production") {
    app.set('trust proxy', 1);
    session.cookie.secure = true;
}

// Conexion 
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "battlesheep"
})

con.connect(err => {
    if (err) throw err;
    else console.log("Connexion effectuée");

    /**
     * Insert user and password in table
     *
     * @param   {string}  user  username to insert
     * @param   {string}  pass  password
     *
     * @return  {error}        return if error
     */
    function signUp(user,pass){
        // Insert element
        if(user=="" || pass==""){return;}
        try {
            const users={
                username:user,
                password:pass
            }

            sql = 'INSERT into users SET ?'
            con.query(sql, users,(err,result)=>{
                if (err) throw err;
                console.log("1 element inserted")
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
    function signIn(usr,pass){
        let quer="SELECT * from users WHERE username='"+usr+"' AND password='"+pass+"'";
        con.query(quer,(err,result)=>{
            if(err) throw err;
            if(result=="") console.log( "Utilisateur introuvable");
            else {
                console.log("Résultat trouvé : ")
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
    function getListFromUser(usr){
        let quer="SELECT * from users WHERE username='"+usr+"'";
        con.query(quer,(err,result)=>{
            if(err) throw err;
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
    function getListFromId(id){
        let quer="SELECT * from users WHERE id='"+id+"'";
        con.query(quer,(err,result)=>{
            if(err) throw err;
            console.log(result)
            return result
        })
    }
})