const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  text: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  replies: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Message' }]
});

module.exports = mongoose.model("Message", messageSchema);
