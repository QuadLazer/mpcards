
const router = require("express").Router();
const controllers = require("../controllers/controller");

const fetchAllUsers = controllers.fetchAllUsers;
const findUser = controllers.findUser;
const eraseUser = controllers.eraseUser;
const modifyUser = controllers.modifyUser;
const otherFunction = controllers.otherFunction;
const register = controllers.register;
const fetchAllAchievements = controllers.fetchAllAchievements;
const findAchievement = controllers.findAchievement;
const findUserAchieved = controllers.findUserAchieved;
const addAchievementToUser = controllers.addAchievementToUser;

router.get("/users/fetchUsers", fetchAllUsers);
router.get("/users/findUser/:userEmail", findUser);
router.get("/users/sameFetch", otherFunction);
router.post("/users/register", register);
router.delete("/users/delete", eraseUser);
router.put("/users/updateAccount", modifyUser);

router.get("/ach/fetchAchievements", fetchAllAchievements);
router.get("/ach/findAchievement/:achId", findAchievement);

router.get("/uha/fetchUserAch/:email", findUserAchieved);
router.get("/uha/addUserAch", addAchievementToUser);

module.exports = router;

