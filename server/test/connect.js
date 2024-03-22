const connString = require('../noshare.js');

const initOptions = {
    schema: 'testschema'
}

const pgp = require('pg-promise')(initOptions);

const testdb = pgp(connString.getCred());

// before(async () => {
//     connection = pgp(connString.getCred());
//   });
//   db = await conection.
//   after(async () => {
//     await testdb.close();
//   });



module.exports = testdb;