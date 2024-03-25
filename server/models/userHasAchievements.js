const db = require('../db/index.js');

const getUserAchievements = async (email) => {
    try {
        const checkEmail = await db.one(`SELECT id FROM g_user WHERE email = $1`,[email])
        if(!checkEmail) throw {name: "NotValidUser", message: "Not a valid account!", status: false }
        const userID = checkEmail.id;

        const getAchList = await db.any(`SELECT * FROM user_has_achieved  WHERE user_id = $1`, [userID]);
        //if(getAchList.length === 0) return { message: "User has no achievements", status: true }
        return getAchList 
    } catch (error) {
        if (error.name === "NotValidUser"){
            console.log("No user found with that email address")
            throw error
        }else{
            throw {
                name: "DatabaseQueryError",
                message: "Error fetching user",
                cause: error
            }
        }
    }
}

const addUserAchievement = async(email,achievementName) => { 
    try { 
        const checkEmail = await db.oneOrNone(`SELECT id FROM g_user WHERE email = $1`,[email])
        if (!checkEmail) throw {name: "NotValidUser", message: "Not a valid account!", status: false }
        const userID = checkEmail.id;
        const d = new Date();
        const date_with_time = +d.getFullYear()+"-"
                        +("0" + (d.getMonth()+1)).slice(-2)+"-"
                        +("0" + d.getDate()).slice(-2)+" "
                        +("0" + d.getHours()).slice(-2)+":"
                        +("0" + d.getMinutes()).slice(-2)+":"
                        +("0" + d.getSeconds()).slice(-2);
        console.log(date_with_time);
        const addedAchievement = await db.any(`
        INSERT INTO user_has_achieved(user_id, aid, a_date)
        VALUES($1, $2, $3)`,[userID, achievementName, date_with_time])
        return { message: "Achievement added to user", status: true, user: userID, achievement: achievementName }
    } catch (error) {
        if (error.name === "NotValidUser"){
            console.log("No user found with that email address")
            throw error
        }else{
            throw {
                name: "DatabaseQueryError",
                message: "Error adding achievement",
                cause: error
            }
        }
    }
}

const deleteAchievement = async (email,achievementName) => {
    try {
        const checkEmail = await db.oneOrNone(`SELECT id FROM g_user WHERE email = $1`,[email])
        if (!checkEmail) throw {name: "NotValidUser", message: "Not a valid account!", status: false }
        const userID = Number(checkEmail.id);
        const deleted = await db.none(`
        DELETE FROM user_has_achieved WHERE user_id = $1 AND aid = $2 
        `, [userID,achievementName]);
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

module.exports = {getUserAchievements, addUserAchievement, deleteAchievement}

