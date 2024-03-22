const connString = require('../noshare.js');

//const pgp = require('pg-promise')({});

//Use this setup for database unit testing
const initOptions = {
    schema: 'testschema'
}

const pgp = require('pg-promise')(initOptions);
//End of setup for database unit testing

const db = pgp(connString.getCred());
module.exports = db;
