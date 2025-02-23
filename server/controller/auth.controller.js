const { generateToken } = require("../lib/utils");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const cloudinary = require("../lib/cloudinary");

const signup = async (req, res) => {
  const { email, password, fullName } = req.body;
  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields must be filled" });
    }

    if (password.length < 5) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 5 characters long" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      fullName,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      return res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "Failed to create user" });
    }
  } catch (error) {
    console.log("Error", error, message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields must be filled" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    if (user.email !== email) {
      return res.status(400).json({ message: "Wrong Email" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// const updateProfile = async (req, res) => {
//   try {
//     const userid = req.user._id;

//     const { fullName, email, password } = req.body;
//     if (!fullName && !email && !password) {
//       return res
//         .status(400)
//         .json({ message: "At least one field must be provided" });
//     }

//     let updateData = {};
//     if (fullName) updateData.fullName = fullName;
//     if (email) updateData.email = email;

//     if (password) {
//       const salt = await bcrypt.genSalt(10);
//       updateData.password = await bcrypt.hash(password, salt);

//       await User.findByIdAndUpdate(userid, {
//         password: updateData.password,
//       });
//       return res.status(200).json({ message: "Password updated successfully" });
//     }

//     const user = await User.findByIdAndUpdate(userid, updateData, {
//       new: true,
//     }).select("-password");
//     res.status(200).json(user);
//   } catch (error) {
//     console.log("Error", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

const updateProfilePic = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const checkAuth = async (req, res) => {
  try {
    // console.log("req.user:", req.user); 
    // if (!req.user) {
    //   return res.status(401).json({ message: "Unauthorized" });
    // }

    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { signup, login, logout, updateProfilePic, checkAuth };