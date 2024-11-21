const jwt = require("jsonwebtoken");

const generateToken = (userid, res) => {
  const token = jwt.sign({ userid }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });

  res.cookie("token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,  //prevent XSS attacks cross-site scripting attacks
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    expires: new Date(Date.now() + 86400000),
  });

  return token;
};

module.exports = { generateToken };
