const argon2 = require('argon2');
const userModel = require("../models/users.js");
const getUsers = userModel.getUsers;
const getUser = userModel.getUser;
const addUser = userModel.addUser;
const deleteUser = userModel.deleteUser;
const updateUser = userModel.updateUser;
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

module.exports = {fetchAllUsers, findUser, eraseUser, modifyUser, otherFunction, register}
//exports.fetchAllUsers = fetchAllUsers;
//exports.otherFunction = otherFunction;
//module.exports = fetchAllUsers;

