const express = require("express");
const { signup, login, logout, updateProfile, checkAuth } = require("../controller/user.controller");
const { protectRoute } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile)
router.put("/check", protectRoute, checkAuth)

module.exports = router;
