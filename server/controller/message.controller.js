const Message = require("../models/message.model");
const User = require("../models/user.model");
const { getReceiverSocketId, io } = require("../lib/socket");
const multer = require("multer");
const cloudinary = require("../lib/cloudinary");
const streamifier = require("streamifier");

// Use memory storage so files can be uploaded to Cloudinary directly
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get users for sidebar (unchanged)
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

// Get messages (unchanged)
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

// Send message
const sendMessage = async (req, res) => {
  try {
    const { id: receiverid } = req.params;
    const { message } = req.body;
    const senderid = req.user._id;
    const imageFile = req.file;

    if (!receiverid) {
      return res.status(400).json({ message: "Receiver ID is required" });
    }

    if (!message?.trim() && !imageFile) {
      return res.status(400).json({ message: "Message or image is required" });
    }

    let imageUrl = null;

    // Upload to Cloudinary if an image is present
    if (imageFile) {
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "chat_images",
              resource_type: "image",
            },
            (error, result) => {
              if (result) {
                resolve(result.secure_url);
              } else {
                reject(error);
              }
            }
          );

          streamifier.createReadStream(imageFile.buffer).pipe(stream);
        });
      };

      try {
        imageUrl = await streamUpload();
      } catch (err) {
        console.error("Cloudinary Upload Error:", err);
        return res.status(500).json({ message: "Invalid image file" });
      }
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
    console.error("Send Message Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getUsersForSidebar,
  getMessages,
  sendMessage,
  upload,
};
