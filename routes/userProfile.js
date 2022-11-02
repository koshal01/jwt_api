const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middlewares/user");
const { 
    addUserProfile, 
    editUserProfile
    } = require("../controllers/userProfileController");

router.route("/addUserProfile").post(addUserProfile);
router.route("/editUserProfile").put(isLoggedIn, editUserProfile);

module.exports = router;