
const router = require("express").Router();
const controllers = require("../controllers/controller");
//const fa = require("../controllers/controller").fetchAllUsers;
const fetchAllUsers = controllers.fetchAllUsers;
const otherFunction = controllers.otherFunction;
const register = controllers.register;

//const router = express.Router();

router.get("/fetchUsers", fetchAllUsers);
router.get("/sameFetch", otherFunction);
router.post("/register", register);

module.exports = router;

