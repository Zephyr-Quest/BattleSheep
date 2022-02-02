let manageUser = (function () {

    const bcrypt = require('bcrypt');
    const saltRounds = 10; // ~10 hashes/sec

    let mdpHash = "";

    let stock = (hash) => {
        mdpHash = hash;
    }

    return {
        //! encryptPassword est sous async, crypt va etre plus simple à utiliser
        encryptPassword(password) {
            bcrypt.hash(password, saltRounds, function (err, hash) {
                if (err) return 0;
                else {
                    console.log(password);
                    console.log(hash);

                    stock(hash);
                    console.log(mdpHash);
                }
            });
        },

        checkUser(pass) {
            bcrypt.compare(pass, mdpHash, function (err, match) {
                if (err) return 0;
                else {
                    if (match) {
                        console.log(match, pass, mdpHash)
                    } else {
                        console.log(match, pass, mdpHash)
                    }
                }
            });

            console.log(bcrypt.compareSync(pass, mdpHash));
        },





        crypt(pass) {
            try {
                let mdp = bcrypt.hashSync(pass, saltRounds);
                stock(mdp);
            } catch (error) {
                console.log(error);
            }
        }
    }
})();

let password = "EngLePLusBeau";

manageUser.encryptPassword(password);

manageUser.checkUser(password);