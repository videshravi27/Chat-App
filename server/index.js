require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.route");
const messageRoutes = require("./routes/message.route");
const connectDB = require("./lib/db");

const { app, server }= require("./lib/socket");

app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/uploads/chat_images", express.static("uploads/chat"));

app.use("/auth", authRoutes);
app.use("/message", messageRoutes);

server.listen(process.env.PORT, () => {
  connectDB();
  console.log("Server is running on port " + process.env.PORT);
});
