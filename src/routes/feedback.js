// use this route to upload file
const express = require("express");
const {feedback_create} = require("../controllers/feedbackController");
const {authRequired} = require("../middlewares/authRequired");
const app = express();

function feedbackRouter({config, services}) {
  const Router = express.Router();
  Router.post("/feedback", authRequired, feedback_create);

  return Router;
}

module.exports = feedbackRouter;
