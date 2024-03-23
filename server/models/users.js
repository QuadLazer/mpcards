const db = require('../db/index.js');

const getUsers = async () => {
    try {
        const users = await db.any("SELECT uname, email, win_count FROM g_user order by win_count desc, uname asc");
        console.log(users);
        return users
    } catch (err) {
        throw { 
            name: "getUsersError",
            message: "Error fetching users",
            cause: err
        }
    }
}

const getUser = async (identifier) => {
    try {
        const getUser = await db.oneOrNone(`SELECT uname, email, win_count FROM g_user WHERE email = $1 OR uname = $1`, [identifier]);
        if(!getUser)  throw error;
        return getUser 
    } catch (error) {
        throw {
                name: "QueryResultError",
                message: "Error fetching user",
                cause: error
            }
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

const deleteUser = async (username, email) => {
    try {
        const checkUser = await db.one(`
        SELECT * FROM g_user WHERE uname = $1 AND email = $2
        `, [username, email])
        if (!checkUser) return { message: "User not found", status: false }
        const deleted = await db.none(`
        DELETE FROM g_user WHERE uname = $1
        `, [username]);
        console.log(deleted)
        return { message: "User was deleted", status: true }
    } catch (error) {
        console.log(error)
        throw {
            name: "DatabaseQueryError",
            message: "Error deleting user",
            cause: error
        }
    }
}

const updateUser = async (username, email, newUsername, newEmail, newPassword) => {
    try {
        const checkUser = await db.oneOrNone(`
        SELECT * FROM g_user WHERE uname = $1 AND email = $2
        `, [username, email])
        if (!checkUser) return { message: "User not found", status: false }
        let rawString = String.raw`UPDATE g_user SET uname = $1, email = $2, password = $3 
        WHERE uname = $4
        RETURNING uname, email`;
        if (newUsername == null ) {
            if (newEmail == null) {
                //set new password only
                rawString = String.raw`UPDATE g_user SET  password = $1 
                WHERE uname = $2
                RETURNING uname, email`;
                const updated = await db.any(rawString, [newPassword, username])
                return {message: "User updated successfully", status: true, user: updated}
                } 
            else if (newPassword == null) {
                // set new email only
                rawString = String.raw`UPDATE g_user SET email = $1
                WHERE uname = $2
                RETURNING uname, email`;
                const updated = await db.any(rawString, [newEmail, username])
                return {message: "User updated successfully", status: true, user: updated}
                  
            }
            else {
                //set new email and password
                rawString = String.raw`UPDATE g_user SET email = $1,  password = $2 
                WHERE uname = $3
                RETURNING uname, email`;
                const updated = await db.any(rawString, [newEmail,newPassword, username])
                return {message: "User updated successfully", status: true, user: updated}
            }
        }
        else if (newEmail == null) {
            //set new user name only
            if (newPassword == null) {
                rawString = String.raw`UPDATE g_user SET  uname = $1 
                WHERE uname = $2
                RETURNING uname, email`;
                const updated = await db.any(rawString, [newUsername, username])
                return {message: "User updated successfully", status: true, user: updated}
                
            }
            else {
                //set new username and password
                rawString = String.raw`UPDATE g_user SET uname = $1,  password = $2 
                WHERE uname = $3
                RETURNING uname, email`;
                const updated = await db.any(rawString, [newUsername,newPassword, username])
                return {message: "User updated successfully", status: true, user: updated}
                
            }
        }
        else if (newPassword == null) {
            //set email and username
            rawString = String.raw`UPDATE g_user SET uname = $1,  email = $2 
            WHERE uname = $3
            RETURNING uname, email`;
            const updated = await db.any(rawString, [newUsername,newEmail, username])
            return {message: "User updated successfully", status: true, user: updated}
               
        }
        else {} 

        const updated = await db.any(rawString, [newUsername, newEmail, newPassword, username])
        return {message: "User updated successfully", status: true, user: updated}
    } catch (error) {
        console.log(error);
        throw {
            name: "DatabaseQueryError",
            message: "Error updating user",
            cause: error
        };
    }
}

const updateWinCount = async (username) => {
    try {
        const checkUser = await db.oneOrNone(`
        SELECT * FROM g_user WHERE uname = $1
        `, [username])
        if (!checkUser) return { message: "User not found", status: false }
        const updated = await db.any(`
        UPDATE g_user SET win_count = win_count + 1
        WHERE uname = $1
        RETURNING uname, email, win_count
        `, [username]);
        return { message: "User updated successfully", status: true, user: updated }
    } catch (error) {
        console.log(error);
        throw {
            name: "DatabaseQueryError",
            message: "Error updating user",
            cause: error
        };
    }
}

module.exports = { getUsers, getUser, addUser, deleteUser, updateUser, updateWinCount}