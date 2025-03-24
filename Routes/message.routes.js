const express = require('express')
const { sendMessage, deleteMessage , replyToMessage} = require ('../Controllers/message.controller')

const router = express.Router()

//Send message
router.post("/:id/send", sendMessage)

//Delete message
router.delete("/:id/delete/:messageId", deleteMessage)

//Reply to message
router.post("/:id/reply", replyToMessage )

module.exports = router