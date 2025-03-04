const Message = require('../models/message.model');
const User = require('../models/user.model');
const cloudinary = require('../lib/cloudinary');

const getUsersForSidebar = async (req, res) => {
    try {
        const loggedinUserid = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedinUserid}}).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myid = req.user._id;
        
        const messages = await Message.find({
            $or: [
                { senderid: myid, receiverid: userToChatId },
                { senderid: userToChatId, receiverid: myid }
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error", error.message);
        res.status(500).json({message: "Internal server error"})   
    }
}

const sendMessage = async (req, res) => {
    try{
        const { id: receiverid } = req.params;
        const { message, image } = req.body;
        const senderid = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderid,
            receiverid,
            message,
            image: imageUrl
        });
        await newMessage.save();
        res.status(201).json(newMessage);
    }catch(error){
        console.log("Error", error.message);
        res.status(500).json({message: "Internal server error"})
    }
}

module.exports = { getUsersForSidebar, getMessages, sendMessage}