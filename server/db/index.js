const connString = require('../noshare.js');

const pgp = require('pg-promise')({}); 
const db = pgp(connString.getCred());
module.exports = db;