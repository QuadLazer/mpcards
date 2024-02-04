const db = require('../db/index.js');

const getUsers = async () => {
    try {
        const users = await db.any("SELECT * FROM g_user");
        console.log(users);
        return users
    } catch (err) {
        throw { 
            name: "getUsersError",
            message: "Error fetching users",
            cause: error
        }
        //next(err)
    }
}

const addUser = async(username, email, password) => { 
    try { //id, uname, password, email

        const checkEmail = await db.oneOrNone(`SELECT * FROM g_user WHERE email = $1`,[email])
        if (checkEmail) throw {name: "DuplicateKeyError", message: "Email already in use", status: false }
        

        const checkUsername = await db.oneOrNone(`SELECT * FROM g_user WHERE uname = $1`, [username])
        if (checkUsername) throw { name: "DuplicateKeyError", message: "Username already in use", status: false }

        
        const addUser = await db.any(`
        INSERT INTO g_user(uname, password, email)
        VALUES($1, $2, $3)
        `,[username,password, email])
        console.log("I inserted")
            return { message: "User created successfully", status: true, user: addUser }
    } catch (error) {
        if (error.name === "DuplicateKeyError"){
            console.log("duplicate key error")
            throw error
        }else{
            throw {
                name: "DatabaseQueryError",
                message: "Error creating user",
                cause: error
            }
        }
    }
}

module.exports = { getUsers, addUser}