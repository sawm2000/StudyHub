const express = require("express");
const router = express.Router();
const {
  getUser,
  getAllUsers,
  update,
  deleteUser,
} = require("../Controllers/user.controller");

// Get a user
router.get("/:id", getUser);

// Get all users
router.get("/", getAllUsers);

// Update user
router.put("/:id", update);

// Delete user
router.delete("/:id", deleteUser);

module.exports = router;
