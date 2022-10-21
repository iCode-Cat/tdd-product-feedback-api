const mongoose = require("mongoose");

const votingSchema = new mongoose.Schema(
  {
    feedback: mongoose.Schema.Types.ObjectId,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    upvoted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = Voting = mongoose.model("voting", votingSchema);
