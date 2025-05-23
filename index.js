require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const authRoutes = require("./Routes/auth.routes");
const studyRoomRoutes = require("./Routes/studyRoom.routes");
const messageRoutes = require("./Routes/message.routes");
const userRoutes = require("./Routes/users.routes");
const videoRoutes = require("./Routes/video.routes")
const path = require("path");

app.use(cors());
const uri = process.env.DB_URL;
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
}
connect();
app.use(express.json());
app.use("/", authRoutes);
app.use("/room", studyRoomRoutes);
app.use("/message", messageRoutes);
app.use("/user", userRoutes);
app.use("/video", videoRoutes)

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen("8000", () => {
  console.log("server started on 8000");
});
