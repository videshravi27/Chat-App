const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: "",
  },
}, { timestamps: true } );

module.exports = mongoose.model("User", userSchema); 