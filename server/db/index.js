const connString = require('../noshare.js');

const pgp = require('pg-promise')({}); //passing in empty object congiuration
const db = pgp(connString.getCred());
module.exports = db;