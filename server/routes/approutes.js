
const router = require("express").Router();
const controllers = require("../controllers/controller");
//const fa = require("../controllers/controller").fetchAllUsers;
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

//const router = express.Router();

router.get("/users/fetchUsers", fetchAllUsers);
router.get("/users/findUser", findUser);
router.get("/users/sameFetch", otherFunction);
router.post("/users/register", register);
router.delete("/users/delete", eraseUser);
router.put("/users/updateAccount", modifyUser);

router.get("/ach/fetchAchievements", fetchAllAchievements);
router.get("/ach/findAchievement", findAchievement);

router.get("/uha/fetchUserAch", findUserAchieved);
router.get("/uha/addUserAch", addAchievementToUser);

module.exports = router;

