const connString = require('/etc/secrets/noshare.js');

let pgp;

//const pgp = require('pg-promise')({});

//Use this setup for database unit testing
if (process.env.NODE_ENV === 'test') {
    const initOptions = {
        schema: 'testschema'
    }
    
    pgp = require('pg-promise')(initOptions);
    //End of setup for database unit testing

}
else {
    pgp = require('pg-promise')({});
}

const db = pgp(connString.getCred());
module.exports = db;
