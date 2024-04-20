
const router = require("express").Router();
const controllers = require("../controllers/controller");

const fetchAllUsers = controllers.fetchAllUsers;
const findUser = controllers.findUser;
const eraseUser = controllers.eraseUser;
const modifyUser = controllers.modifyUser;
const modifyWinCount = controllers.modifyWinCount;
const register = controllers.register;
const fetchAllAchievements = controllers.fetchAllAchievements;
const findAchievement = controllers.findAchievement;
const findUserAchieved = controllers.findUserAchieved;
const addAchievementToUser = controllers.addAchievementToUser;
const removeAchievement = controllers.removeAchievement;
const fetchPercentAchieve = controllers.fetchPercentAchieve;

router.get("/users/fetchUsers", fetchAllUsers);
router.get("/users/findUser/:userEmail", findUser);
router.post("/users/register", register);
router.delete("/users/delete", eraseUser);
router.put("/users/updateAccount", modifyUser);
router.put("/users/updateWinCount", modifyWinCount);

router.get("/ach/fetchAchievements", fetchAllAchievements);
router.get("/ach/findAchievement/:achId", findAchievement);
router.get("/ach/fetchPercentAchieved", fetchPercentAchieve);

router.get("/uha/fetchUserAch/:email", findUserAchieved);
router.post("/uha/addUserAch", addAchievementToUser);
router.delete("/uha/delUserAch",removeAchievement);

module.exports = router;

