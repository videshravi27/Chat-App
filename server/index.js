require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth.route");

const connectDB = require("./lib/db");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoutes);

app.listen(process.env.PORT, () => {
  connectDB()
  console.log("Server is running on port " + process.env.PORT);
});