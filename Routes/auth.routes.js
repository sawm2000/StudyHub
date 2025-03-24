const express = require('express')
const {signupUser, signinUser} = require ('../Controllers/auth.controller')

const router = express.Router()

//Create a user
router.post("/user/signup", signupUser)

//Sign in as user
router.post("/user/signin", signinUser)

module.exports = router