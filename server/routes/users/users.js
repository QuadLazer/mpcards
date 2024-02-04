const users = require("express").Router();
const { getUsers } = require("../../queries/users.js"); //importing after creation


users.get("/", getUsers);

module.exports = users;