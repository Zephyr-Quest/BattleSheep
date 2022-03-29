/* -------------------------------------------------------------------------- */
/*                              SignUp and SignIn                             */
/* -------------------------------------------------------------------------- */
let manageUser = (function () {
    const bcrypt = require("bcrypt");
    const saltRounds = 10; // ~10 hashes/sec

    return {
        /**
         * Encrypt password and add the user to the DB
         * 
         * @param {string} password     password to crypt
         * @param {function} callback   callback when password crypted
         */
        signUp(password, callback) {
            bcrypt.hash(password, saltRounds, function (err, crypted) {
                if (err) {
                    console.error(err);
                    return 0;
                }

                bcrypt.compare(password, crypted, function (err, match) {
                    if (err) {
                        console.error(err);
                        return 0;
                    }
                    if (match) {
                        callback(crypted) // Transmission BDD
                    } else {
                        console.error("An error while comparing the password and the hash has occured")
                    }
                });
            });
        },

        /**
         * Connect the user to the DB
         * 
         * @param {string} password     password not crypted
         * @param {function} callback
         */
        signIn(password, callback) {
            callback(password); // Transmission BDD
        }
    }
})();

module.exports = manageUser;