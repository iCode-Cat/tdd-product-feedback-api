const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

module.exports.authRequired = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({error: "Unauthorized"});
  }
  try {
    const {_id} = jwt.verify(token, "secret");
    // except the password
    req.user = await User.findOne({_id}).select("-password");
    next();
  } catch (error) {
    res.status(401).json({error: "Unauthorized"});
  }
};
