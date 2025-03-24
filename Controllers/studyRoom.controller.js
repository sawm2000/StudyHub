const StudyRoom = require("../Models/studyRoom.model");
const User = require("../Models/user.model");
const createError = require("../error");

const createRoom = async (req, res, next) => {
  try {
    const { roomName } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "User not found!"));

    const newRoom = new StudyRoom({
      roomName,
      roomUsers: [user._id],
    });

    await newRoom.save();
    res
      .status(201)
      .json({ message: "Room created successfully", room: newRoom });
  } catch (err) {
    next(err);
  }
};

const joinRoom = async (req, res, next) => {
  try {
    const { roomId } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "User not found!"));

    const room = await StudyRoom.findById(roomId);
    if (!room) return next(createError(404, "Room not found!"));

    if (room.roomUsers.includes(user._id)) {
      return next(createError(400, "You are already in the room"));
    }

    room.roomUsers.push(user._id);
    await room.save();

    res.status(200).json({ message: "Joined room successfully", room });
  } catch (err) {
    next(err);
  }
};


module.exports = { createRoom, joinRoom};
