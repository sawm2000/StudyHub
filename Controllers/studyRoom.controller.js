const StudyRoom = require("../Models/studyRoom.model");
const User = require("../Models/user.model");
const Message = require("../Models/message.model");
const createError = require("../error");
const crypto = require("crypto");

const createRoom = async (req, res, next) => {
  try {
    const { name, private } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "User not found!"));

    const existingRoom = await StudyRoom.findOne({ name });
    if (existingRoom) {
      return next(createError(400, "Room name already exists"));
    }

    let roomCode = null;
    if (private) {
      roomCode = crypto.randomBytes(3).toString("hex").toUpperCase();
    }

    const newRoom = new StudyRoom({
      name,
      owner: user._id,
      users: [user._id],
      private,
      code: roomCode,
    });

    await newRoom.save();

    const joinLink = `${req.protocol}://${req.get(
      "host"
    )}/room/join-link?roomId=${newRoom._id}&code=${roomCode}`;

    res
      .status(201)
      .json({ message: "Room created successfully", room: newRoom, joinLink });
  } catch (err) {
    next(err);
  }
};

const joinRoom = async (req, res, next) => {
  try {
    const { roomId, code } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "User not found!"));

    const room = await StudyRoom.findById(roomId);
    if (!room) return next(createError(404, "Room not found!"));

    if (room.private && room.code !== code) {
      return next(createError(403, "Invalid code!"));
    }

    if (room.users.includes(user._id)) {
      return next(createError(400, "You are already in the room"));
    }

    room.users.push(user._id);
    await room.save();

    res.status(200).json({ message: "Joined room successfully", room });
  } catch (err) {
    next(err);
  }
};

const joinRoomByLink = async (req, res, next) => {
  try {
    const { roomId, code } = req.query;
    const { id } = req.body;

    const user = await User.findById(id);
    if (!user) return next(createError(404, "User not found!"));

    const room = await StudyRoom.findById(roomId);
    if (!room) return next(createError(404, "Room not found!"));

    if (room.private && room.code !== code) {
      return next(createError(403, "Invalid code!"));
    }

    if (room.users.includes(user._id)) {
      return next(createError(400, "You are already in the room"));
    }

    room.users.push(user._id);
    await room.save();

    res.status(200).json({ message: "Joined room successfully", room });
  } catch (err) {
    next(err);
  }
};

const leaveRoom = async (req, res, next) => {
  try {
    const { roomId } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "User not found!"));

    const room = await StudyRoom.findById(roomId);
    if (!room) return next(createError(404, "Room not found!"));

    if (!room.users.includes(user._id)) {
      return next(createError(400, "You are not in this room"));
    }

    room.users = room.users.filter(
      (roomUser) => roomUser.toString() !== user._id.toString()
    );
    await room.save();

    res
      .status(200)
      .json({ message: "You have successfully left the room", room });
  } catch (err) {
    next(err);
  }
};

const deleteRoom = async (req, res, next) => {
  try {
    const { roomId } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "User not found!"));

    const room = await StudyRoom.findById(roomId);
    if (!room) return next(createError(404, "Room not found!"));

    if (room.owner.toString() !== user._id.toString()) {
      return next(
        createError(403, "You do not have permission to delete this room")
      );
    }

    await Message.deleteMany({ room: roomId });
    await room.deleteOne();

    res.status(200).json({ message: "Room successfully deleted" });
  } catch (err) {
    next(err);
  }
};

const editRoom = async (req, res, next) => {
  try {
    const { roomId, name, addUser, removeUser, private, code } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "User not found!"));

    const room = await StudyRoom.findById(roomId);
    if (!room) return next(createError(404, "Room not found!"));

    if (room.owner.toString() !== user._id.toString()) {
      return next(
        createError(403, "You do not have permission to edit this room")
      );
    }

    if (name && name !== room.name) {
      const existingRoom = await StudyRoom.findOne({ name });
      if (existingRoom) {
        return next(createError(400, "Room name already exists."));
      }
      room.name = name;
    }

    if (private !== undefined) {
      room.private = private;
    }

    if (private && code) {
      room.code = code;
    }

    if (addUser) {
      if (!room.users.includes(addUser)) {
        room.users.push(addUser);
      }
    }

    if (removeUser) {
      if (removeUser.toString() === room.owner.toString()) {
        return next(createError(400, "You cannot remove the room owner"));
      }
      room.users = room.users.filter((user) => !user.equals(removeUser));
    }

    await room.save();

    res.status(200).json({ message: "Room successfully updated" });
  } catch (err) {
    next(err);
  }
};

const getRoom = async (req, res, next) => {
  try {
    const room = await StudyRoom.findById(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};

const getAllRooms = async (req, res, next) => {
  try {
    const { search, private, sortBy, orderBy } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (private !== undefined) {
      query.private = private === "true";
    }

    let sort = {};
    if (sortBy) {
      sort[sortBy] = orderBy === "desc" ? -1 : 1;
    }

    const rooms = await StudyRoom.find(query).sort(sort);
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createRoom,
  joinRoom,
  leaveRoom,
  deleteRoom,
  editRoom,
  joinRoomByLink,
  getRoom,
  getAllRooms,
};
