const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");

const createToken = _id => {
  return jwt.sign({_id}, "secret", {expiresIn: "3d"});
};

module.exports.user_register = async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await User.signup(email, password);
    // create a token
    const token = createToken(user._id);
    console.log(token);
    res.status(200).json({email, token, id: user._id});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

module.exports.user_login = async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await User.login(email, password);
    // create a token
    const token = createToken(user._id);
    res.status(200).json({email, token, id: user._id});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

module.exports.user_me = async (req, res) => {
  res.status(200).json({email: req.user.email, id: req.user._id});
};
