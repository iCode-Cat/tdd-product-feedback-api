const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  feedback: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "feedback"
  },
  comment: "string"
});

module.exports = Comment = mongoose.model("comment", commentSchema);
