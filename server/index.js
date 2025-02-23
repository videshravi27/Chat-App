require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth.route");
const messageRoutes = require("./routes/message.route");
const connectDB = require("./lib/db");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/message", messageRoutes);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("Server is running on port " + process.env.PORT);
});
