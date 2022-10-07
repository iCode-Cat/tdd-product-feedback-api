const mongoose = require("mongoose");

const votingSchema = new mongoose.Schema(
  {
    feedback: mongoose.Schema.Types.ObjectId,
    user: mongoose.Schema.Types.ObjectId
  },
  {
    timestamps: true
  }
);

module.exports = Voting = mongoose.model("voting", votingSchema);
