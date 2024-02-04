const argon2 = require('argon2');
const userModel = require("../models/users.js");
const getUsers = userModel.getUsers;
const addUser = userModel.addUser;
//import {getUsers} from "../models/users.js";



const fetchAllUsers = async (req, res, next) => {
    try {
        const userList = await getUsers();
        return res.status(200).send(userList)
    } catch (error) {
        next(error)
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

module.exports = {fetchAllUsers, otherFunction, register}
//exports.fetchAllUsers = fetchAllUsers;
//exports.otherFunction = otherFunction;
//module.exports = fetchAllUsers;

