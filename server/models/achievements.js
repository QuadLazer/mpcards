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

const getAchievementById = async (achievementId) => {
    try {
        const achievement = await db.one(`SELECT * FROM achievement where id = $1`,[achievementId]);
        return achievement;
    } catch (error) {

        throw { 
            name: "DatabaseQueryError",
            message: "Error fetching achievement",
            cause: error
        }
    }
}


const getAchPercent = async () => {
    try {
        const achievement = await db.any(
            `with u as(select count(*) as users from g_user),

            c as (select distinct count(*) as acount, aid from user_has_achieved
                  group by aid)
            select coalesce(pct,0) pct, id, aname,description from(
            select round((cast(acount as decimal)/users * 100),1) as pct, achievement.id, aname, description
            from u,c
            right join achievement on c.aid = achievement.id)s`
            );
        return achievement;
    } catch (error) {

        throw { 
            name: "DatabaseQueryError",
            message: "Error fetching achievement",
            cause: error
        }
    }
}



module.exports = { getAchievements, getAchievementById, getAchPercent}