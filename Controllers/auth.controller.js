const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require ("../Models/user.model")
const createError = require ("../error")

const signupUser = async (req, res, next) => {
    try {
      const userExists = await User.findOne({ username: req.body.username });
      if (userExists) {
        return next(createError(400, "Username already exists!"));
    }
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      const newUser = new User({ ...req.body, password: hash })
       
      await newUser.save();
      res.status(200).send("User has been created!");
    } catch (err) {
      next(err);
    }
  };


const signinUser = async (req, res, next) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) return next(createError(404, "User not found!"));
  
      const isCorrect = await bcrypt.compare(req.body.password, user.password);
  
      if (!isCorrect) return next(createError(400, "Wrong Credentials!"));
  
      const token = jwt.sign({ id: user._id }, process.env.JWT);

      // hides password
      const { password, ...others } = user._doc;
  
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(others);
    } catch (err) {
      next(err);
    }
  };

  module.exports = { signupUser, signinUser }