const Feedback = require("../models/feedbackSchema");
const Voting = require("../models/votingSchema");
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
    res.status(400).json({
      error: error.message
    });
  }
};

module.exports.feedback_all = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
};

module.exports.feedback_one = async (req, res) => {
  const id = req.params.id;
  try {
    const feedback = await Feedback.findById(id);
    res.status(200).json(feedback);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
};

module.exports.feedback_update = async (req, res) => {
  const {id, title, category, details, status} = req.body;
  if (!id) {
    return res.status(400).json({
      error: "Id required"
    });
  }
  let update = {title, category, details, status};
  // If undefined, remove property from object.
  Object.keys(update).forEach(key => update[key] === undefined && delete update[key]);
  try {
    const feedback = await Feedback.findOneAndUpdate({_id: id}, update, {new: true});
    res.status(200).json(feedback);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
};

module.exports.feedback_vote = async (req, res) => {
  const {id} = req.body;
  let vote = +1;
  let lock = false;
  try {
    if (!(await checkVoter(req)).exists) {
      await Voting.create({user: req.user._id, feedback: id});
    }
    if ((await checkVoter(req)).exists && (await checkVoter(req)).upvoted) {
      await Voting.updateOne({user: req.user._id, feedback: id}, {upvoted: false});

      vote = -1;
    }
    if ((await checkVoter(req)).exists && !(await checkVoter(req)).upvoted && vote !== -1) {
      await Voting.updateOne({user: req.user._id, feedback: id}, {upvoted: true});
    }
    const feedback = await Feedback.findOneAndUpdate({_id: id}, {$inc: {vote}}, {new: true});
    res.status(200).json(feedback);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
};

module.exports.feedback_deleteOne = async (req, res) => {
  const {id} = req.body;
  try {
    await Feedback.deleteOne({
      _id: id
    });
    res.status(200).json({message: `feedback ${id} has been deleted.`});
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
};

const checkVoter = async req => {
  try {
    const voter = await Voting.findOne({user: req.user._id});
    if (!voter) {
      return {
        exists: false,
        upvoted: false
      };
    }
    if (voter.upvoted) {
      return {
        exists: true,
        upvoted: true
      };
    }
    if (!voter.upvoted) {
      return {
        exists: true,
        upvoted: false
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
