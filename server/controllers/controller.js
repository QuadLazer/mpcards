const argon2 = require('argon2');
const validator = require('email-validator');
const userModel = require("../models/users.js");
const achievementsModel = require("../models/achievements.js");
const userAchieveModel = require("../models/userHasAchievements.js");
const getUsers = userModel.getUsers;
const getUser = userModel.getUser;
const addUser = userModel.addUser;
const deleteUser = userModel.deleteUser;
const updateUser = userModel.updateUser;
const getAchievements = achievementsModel.getAchievements;
const getAchById = achievementsModel.getAchievementById;
const getUserAchieved = userAchieveModel.getUserAchievements;
const addAchievement = userAchieveModel.addUserAchievement;




const fetchAllUsers = async (req, res, next) => {
    try {
        const userList = await getUsers();
        return res.status(200).send(userList)
    } catch (error) {
        next(error)
    }

}

const findUser = async (req, res, next) => {
    try {
        let identifier = req.params['userEmail']
        const user = await getUser(identifier);
        return res.status(200).send(user)
    } catch (error) {
        next(error)
    }

}

const eraseUser = async (req, res, next) => {
    try {
        let {username, email} = req.body
        const deleted = await deleteUser(username, email);
        return res.status(200).send(deleted)
    } catch (error) {
        next (error)
    }
}

const modifyUser = async (req, res, next) => {
    try {
        let {username, email, newUsername, newEmail, newPassword} = req.body
        const updated = await updateUser(username, email, newUsername, newEmail, newPassword);
        return res.status(200).send(updated)
    } catch (error) {
        next (error)
    }
}

const otherFunction = async (req, res, next) => {
    try {
        const userList = await getUsers();
        return res.status(200).send(userList)
    } catch (error) {
        next(error)
    }

}

const register = async (req, res, next) => {
    try {
        let { email, password } = req.body
        if (!validator.validate(email) || password.length < 6) {
            return res.status(400);
        }
        const hash = await argon2.hash(password)
        console.log(email);
        let username = email;
        const user = await addUser(username, email, hash)
        return res.status(201).send(user)
    } catch (error) {
        next(error)
    }
}

const fetchAllAchievements = async (req, res, next) => {
    try {
        const achievementList = await getAchievements();
        return res.status(200).send(achievementList)
    } catch (error) {
        next(error)
    }
}

const findAchievement = async (req, res, next) => {
    try {
        let achievementId = req.params['achId'];
        const achievement = await getAchById(achievementId);
        return res.status(200).send(achievement)
    } catch (error) {
        next(error)
    }

}
//The variable name here has to match what is passed in as json
const findUserAchieved = async (req, res, next) => {
    try {
        let email = req.params['email'];
        const achievement = await getUserAchieved(email);
        return res.status(200).send(achievement)
    } catch (error) {
        next(error)
    }

}

const addAchievementToUser = async (req, res, next) => {
    try {
        let {email,achievementName} = req.body
        const addedToUser = await addAchievement(email,achievementName);
        return res.status(200).send(addedToUser)
    } catch (error) {
        next(error)
    }
}

module.exports = {fetchAllUsers, findUser, eraseUser, modifyUser, otherFunction, register,
fetchAllAchievements, findAchievement, findUserAchieved, addAchievementToUser}
//exports.fetchAllUsers = fetchAllUsers;
//exports.otherFunction = otherFunction;
//module.exports = fetchAllUsers;

