const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ["UI", "UX", "feature", "bug", "enhancement"],
      required: true
    },
    details: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["planned", "in-progress", "live"],
      default: "planned"
    },
    user: mongoose.Schema.Types.ObjectId,
    vote: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = Feedback = mongoose.model("feedback", feedbackSchema);
