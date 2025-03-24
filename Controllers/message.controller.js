const StudyRoom = require("../Models/studyRoom.model");
const User = require("../Models/user.model");
const Message = require("../Models/message.model");
const createError = require("../error");

const sendMessage = async (req, res, next) => {
  try {
    const { roomId, text } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "User not found!"));

    const room = await StudyRoom.findById(roomId);
    if (!room) return next(createError(404, "Room not found!"));

    const newMessage = new Message({
      sender: user._id,
      text,
    });

    await newMessage.save();

    room.messages.push(newMessage._id);
    await room.save();

    res
      .status(201)
      .json({ message: "Message sent successfully", message: newMessage });
  } catch (err) {
    next(err);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { roomId } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "User not found!"));

    const room = await StudyRoom.findById(roomId);
    if (!room) return next(createError(404, "Room not found!"));

    const message = await Message.findById(messageId);
    if (!message) return next(createError(404, "Message not found!"));

    if (message.sender.toString() !== user._id.toString()) {
      return next(createError(403, "You can only delete your own messages"));
      s;
    }

    room.messages = room.messages.filter((msg) => msg.toString() !== messageId);
    await room.save();

    await Message.findByIdAndDelete(req.params.messageId);

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const replyToMessage = async (req, res, next) => {
  try {
    const { roomId, messageId, text } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "User not found!"));

    const room = await StudyRoom.findById(roomId);
    if (!room) return next(createError(404, "Room not found!"));

    const message = await Message.findById(messageId);
    if (!message) return next(createError(404, "Message not found!"));

    const newReply = new Message({
      sender: user._id,
      text: text,
    });

    await newReply.save();

    message.replies.push(newReply._id);
    await message.save();

    room.messages.push(newReply._id);
    await room.save();

    res
      .status(201)
      .json({ message: "Reply added successfully", reply: newReply });
  } catch (err) {
    next(err);
  }
};

module.exports = { sendMessage, deleteMessage, replyToMessage };
