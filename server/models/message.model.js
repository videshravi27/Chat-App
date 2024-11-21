const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderid: {

    },
    receiverid: {

    },
    message: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "",
    }
})