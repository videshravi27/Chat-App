const express = require("express");
const { protectRoute } = require("../middleware/auth.middleware");
const { getUsersForSidebar, getMessages, sendMessage, upload } = require("../controller/message.controller");
const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar)
router.get("/:id", protectRoute, getMessages)

router.post("/send/:id", protectRoute, upload.single("image"), sendMessage);

module.exports = router;