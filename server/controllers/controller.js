const argon2 = require('argon2');
const userModel = require("../models/users.js");
const achievementsModel = require("../models/achievements.js");
const userAchieveModel = require("../models/userHasAchievements.js");
const getUsers = userModel.getUsers;
const getUser = userModel.getUser;
const addUser = userModel.addUser;
const deleteUser = userModel.deleteUser;
const updateUser = userModel.updateUser;
const getAchievements = achievementsModel.getAchievements;
const getAchByName = achievementsModel.getAchievementByName;
const getUserAchieved = userAchieveModel.getUserAchievements;
const addAchievement = userAchieveModel.addUserAchievement;
//import {getUsers} from "../models/users.js";



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
        let {identifier} = req.body
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
        let { username, email, password } = req.body
        //password = await argon2.hash(password)
        console.log(username);
        console.log(email);
        console.log(password);
        const user = await addUser(username, email, password)
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
        let {achievementName} = req.body
        const achievement = await getAchByName(achievementName);
        return res.status(200).send(achievement)
    } catch (error) {
        next(error)
    }

}
//The variable name here has to match what is passed in as json
const findUserAchieved = async (req, res, next) => {
    try {
        let {email} = req.body
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

