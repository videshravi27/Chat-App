const { generateToken } = require("../lib/utils.js");
const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
    const { email, password, fullName } = req.body;
    try{
        if(!email || !password || !fullName){
            return res.status(400).json({message: "All fields must be filled"})
        }

        if(password.length < 5){
            return res.status(400).json({message: "Password must be atleast 5 characters long"});
        }

        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            fullName
        })
        if(newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            return res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
                profilePic: newUser.profilePic,
            });
        }else{
            return res.status(400).json({message: "Failed to create user"});
        }
    }catch(error){
        console.log("Error", error,message)
        return res.status(500).json({message: "Internal server error"});
    }
};
const login = async (req, res) => {};

module.exports = { signup, login };
