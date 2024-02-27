const db = require('../db/index.js');
const QueryError = new Error('No results returned');
QueryError.name = QueryError;

const getAchievements = async () => {
    try {
        const achievements = await db.any("SELECT * FROM achievement ORDER BY aname");
        return achievements;
    } catch (err) {
        throw { 
            name: "getAchievementsError",
            message: "Error fetching achievements",
            cause: err
        }

    }
}

const getAchievementByName = async (achievementName) => {
    try {
        const achievement = await db.one(`SELECT * FROM achievement where aname = $1`,[achievementName]);
        return achievement;
    } catch (error) {

        throw { 
            name: "DatabaseQueryError",
            message: "Error fetching achievement",
            cause: error
        }
    }
}



module.exports = { getAchievements, getAchievementByName}