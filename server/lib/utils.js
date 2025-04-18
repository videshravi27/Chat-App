const jwt = require("jsonwebtoken");

const generateToken = (userid, res) => {
  const token = jwt.sign({ userid }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //prevent XSS attacks cross-site scripting attacks
    sameSite: "None",
    secure: true,
    expires: new Date(Date.now() + 86400000),
  });

  return token;
};

module.exports = { generateToken };
