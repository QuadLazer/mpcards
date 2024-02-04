const db = require('../db/index.js');

const getUsers = async (req, res, next) => {
    try {
        let users = await db.any("SELECT * FROM users");
        res.status(200).json({
            users, //users: users
            status: "success",
            message: "ALL USERS"
        })
    } catch (err) {
        next(err)
    }
    
}

module.exports = { getUsers};