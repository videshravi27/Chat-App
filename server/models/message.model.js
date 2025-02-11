const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
    },
    image: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);