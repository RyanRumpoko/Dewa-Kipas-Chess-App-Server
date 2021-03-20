const router = require("express").Router();
const UserController = require("../controllers/userController");
const authenticate = require("../middlewares/authenticate");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/googlelogin", UserController.googleLogin);
router.get("/leaderboard", authenticate, UserController.getLeaderboard);

module.exports = router;
