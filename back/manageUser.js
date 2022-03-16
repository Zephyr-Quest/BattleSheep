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
                    console.log(err);
                    return 0;
                }
                console.log("crypted: " + crypted);
                //console.log("rounds used from hash:", bcrypt.getRounds(crypted));

                bcrypt.compare(password, crypted, function (err, match) {
                    if (err) {
                        console.log(err);
                        return 0;
                    }
                    if (match) {
                        console.log("Hash success")
                        callback(crypted) // Transmission BDD
                    } else {
                        console.log("An error while comparing the password and the hash has occured")
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