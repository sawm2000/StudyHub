const express = require('express')
const { createRoom, joinRoom} = require ('../Controllers/studyRoom.controller')

const router = express.Router()

//Create a study room
router.post("/:id/create", createRoom)

//Join a study room
router.post("/:id/join", joinRoom)


module.exports = router