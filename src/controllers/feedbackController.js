const Feedback = require("../models/feedbackSchema");
module.exports.feedback_create = async (req, res) => {
  const {title, category, details} = req.body;

  const item = new Feedback({
    title,
    category,
    details,
    user: req.user._id
  });

  try {
    const feedback = await item.save({validateBeforeSave: true});
    res.status(200).json(feedback);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      error: error.message
    });
  }
};
