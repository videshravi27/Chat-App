const Message = require("../models/message.model");
const User = require("../models/user.model");
const { getReceiverSocketId, io } = require("../lib/socket");
const { compressImage } = require("../lib/compressImage");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/chat_images");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Get users for sidebar (excluding the logged-in user)
const getUsersForSidebar = async (req, res) => {
  try {
    const loggedinUserid = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedinUserid },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get messages between two users
const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    if (!userToChatId) {
      return res.status(400).json({ message: "Receiver ID is needed" });
    }
    const myid = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderid: myid, receiverid: userToChatId },
        { senderid: userToChatId, receiverid: myid },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send a message with text or image
const sendMessage = async (req, res) => {
  try {
    const { id: receiverid } = req.params;
    const { message } = req.body;
    const senderid = req.user._id;
    const imageFile = req.file;

    if (!receiverid) {
      return res.status(400).json({ message: "Receiver ID is required" });
    }

    // console.log("req.body:", req.body);

    if (!message?.trim() && !imageFile) {
      return res.status(400).json({ message: "Message or image is required" });
    }

    let imageUrl = null;
    if (imageFile) {
      try {
        const compressedBuffer = await compressImage(
          fs.readFileSync(imageFile.path)
        );
        fs.writeFileSync(imageFile.path, compressedBuffer);

        imageUrl = `http://localhost:4000/uploads/chat/${imageFile.filename}`;
        console.log("Uploaded Image URL:", imageUrl);
      } catch (uploadError) {
        console.error("Image Upload Exception:", uploadError);
        return res.status(500).json({ message: "Error uploading image" });
      }
    }

    if (!message?.trim() && !imageUrl) {
      return res.status(400).json({ message: "Cannot send empty messages" });
    }

    const newMessage = new Message({
      senderid,
      receiverid,
      message: message?.trim() || "",
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverid);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getUsersForSidebar, getMessages, sendMessage };
