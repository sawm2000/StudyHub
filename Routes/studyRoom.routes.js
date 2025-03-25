const express = require("express");
const {
  createRoom,
  joinRoom,
  leaveRoom,
  deleteRoom,
  editRoom,
  joinRoomByLink,
  getRoom,
  getAllRooms,
} = require("../Controllers/studyRoom.controller");

const router = express.Router();

//Create a study room
router.post("/:id/create", createRoom);

//Join a study room
router.post("/:id/join", joinRoom);

//Join by link
router.get("/join-link", joinRoomByLink);

//Leave a study room
router.post("/:id/leave", leaveRoom);

//Delete a study room
router.delete("/:id", deleteRoom);

//Edit a study room
router.put("/:id/edit", editRoom);

// Get a room
router.get("/:id", getRoom);

// Get all rooms
router.get("/", getAllRooms);

module.exports = router;
