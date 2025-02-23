const express = require("express");
const { signup, login, logout, updateProfile, updateProfilePic ,checkAuth } = require("../controller/auth.controller");
const { protectRoute } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/check", protectRoute, checkAuth)

// router.put("/update-profile", protectRoute, updateProfile);
router.put("/update-profilepic", protectRoute, updateProfilePic)

module.exports = router;
