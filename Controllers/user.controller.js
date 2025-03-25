const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require ("../Models/user.model")
const createError = require ("../error")

const getUser = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };
  
  const getAllUsers = async (req, res, next) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  };

const update = async (req, res, next) => {
    try {
      const userExists = await User.findOne({ username: req.body.username });
      if (userExists) {
        return next(createError(400, "Username already exists!"));
    }
      const { password, ...otherInfo } = req.body;
  
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: otherInfo,
        },
        { new: true }
      );
  
      if (password) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
  
        updatedUser.password = hash;
        await updatedUser.save();
      }
      
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  };
  
  const deleteUser = async (req, res, next) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted.");
    } catch (err) {
      next(err);
    }
  };

  module.exports = { getUser, deleteUser, update, getAllUsers };