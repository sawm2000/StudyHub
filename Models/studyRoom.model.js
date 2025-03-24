const mongoose = require("mongoose");

const studyRoomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
  },
  roomUsers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
}],
messages: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Message' }],
createdAt: { 
    type: Date, 
    default: Date.now }
});

module.exports = mongoose.model("StudyRoom", studyRoomSchema);
