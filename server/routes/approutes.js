
const router = require("express").Router();
const controllers = require("../controllers/controller");
//const fa = require("../controllers/controller").fetchAllUsers;
const fetchAllUsers = controllers.fetchAllUsers;
const findUser = controllers.findUser;
const eraseUser = controllers.eraseUser;
const modifyUser = controllers.modifyUser;
const otherFunction = controllers.otherFunction;
const register = controllers.register;

//const router = express.Router();

router.get("/fetchUsers", fetchAllUsers);
router.get("/findUser", findUser);
router.get("/sameFetch", otherFunction);
router.post("/register", register);
router.delete("/delete", eraseUser);
router.put("/updateAccount", modifyUser);

module.exports = router;

