const db = require('../db/index.js');

const getUserAchievements = async (email) => {
    try {
        //const checkEmail = await db.any("Select * from g_user");
        const checkEmail = await db.any(`SELECT id FROM g_user WHERE email = $1`,[email])
        const userID = checkEmail[0].id;

        const getAchList = await db.any(`SELECT * FROM user_has_achieved  WHERE user_id = $1`, [userID]);
        return getAchList 
    } catch (error) {
        throw {
            name: "DatabaseQueryError",
            message: "Error fetching user",
            cause: error
        }
    }
}

const addUserAchievement = async(email) => { 
    try { 

        const checkEmail = await db.one(`SELECT id FROM g_user WHERE email = $1`,[email])
        if (!checkEmail) throw {name: "DuplicateKeyError", message: "Not a valid account!", status: false }
        
        // const addUser = await db.any(`
        // INSERT INTO g_user(uname, password, email)
        // VALUES($1, $2, $3)
        // `,[username,password, email])
        // console.log("I inserted")
        //     return { message: "User created successfully", status: true, user: addUser }
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

module.exports = {getUserAchievements, addUserAchievement}

