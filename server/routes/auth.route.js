const express = require("express");
const { signup, login, logout, updateProfile, updateProfilePic, upload, checkAuth } = require("../controller/auth.controller");
const { protectRoute } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/check", protectRoute, checkAuth)

// router.put("/update-profile", protectRoute, updateProfile);
router.put("/update-profilepic", protectRoute, upload.single("profilePic"), updateProfilePic);

module.exports = router;
