const express = require("express");
const router = express.Router();

// const { isLoggedIn } = require("../middlewares/user");
const { 
    signup, 
    login, 
    logout,
    getAllUser } = require("../controllers/userController");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/getAllUser").get(getAllUser);

module.exports = router;