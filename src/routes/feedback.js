// use this route to upload file
const express = require("express");
const {
  feedback_create,
  feedback_all,
  feedback_one,
  feedback_update,
  feedback_vote,
  feedback_deleteOne
} = require("../controllers/feedbackController");
const {authRequired} = require("../middlewares/authRequired");
const {idRequired} = require("../middlewares/idRequired");
const app = express();

function feedbackRouter({config, services}) {
  const Router = express.Router();
  Router.post("/feedback", authRequired, feedback_create);
  Router.get("/feedback", authRequired, feedback_all);
  Router.get("/feedback/:id", authRequired, feedback_one);
  Router.put("/feedback", [authRequired, idRequired], feedback_update);
  Router.post("/feedback/vote", [authRequired, idRequired], feedback_vote);
  Router.delete("/feedback", [authRequired, idRequired], feedback_deleteOne);

  return Router;
}

module.exports = feedbackRouter;
