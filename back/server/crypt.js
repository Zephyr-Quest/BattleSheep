let manageUser = (function () {

    const bcrypt = require('bcrypt');
    const saltRounds = 10; // ~10 hashes/sec


    return {
        cryptPassword(password) {
            bcrypt.hash(password, saltRounds, function (err, crypted) {
                if (err) {
                    console.log(err);
                    return 0;
                }
                mdpHash = crypted;
                console.log('crypted: ' + crypted);
                console.log('rounds used from hash:', bcrypt.getRounds(crypted));

                bcrypt.compare(password, crypted, function (err, match) {
                    if (err) {
                        console.log(err);
                        return 0;
                    }
                    if (match) {
                        console.log(match, password, crypted)
                    } else {
                        console.log(match, password, crypted)
                    }
                })
            })
        },


        crypt(pass) {
            try {
                let mdp = bcrypt.hashSync(pass, saltRounds);
                stock(mdp);
            } catch (error) {
                console.log(error);
            }
        },

        checkUser(pass) {
            let toTest = mdpHash;
            bcrypt.compare(pass, toTest, function (err, match) {

                if (match) {
                    console.log(match, pass, mdpHash)
                } else {
                    console.log(match, pass, mdpHash)
                }
            })



            /*   try {
                  let match = bcrypt.compareSync(pass, mdpHash)
                  if (match) {
                      console.log(match, pass, mdpHash)
                  } else {
                      console.log(match, pass, mdpHash)
                  }
              } catch (error) {
                  console.log(error);
              } */
        }
    }
})();

let password = "EngLePLusBeau";

console.log("-------------------------------------");
manageUser.cryptPassword(password);

//manageUser.checkUser("EngLePlusBeau");