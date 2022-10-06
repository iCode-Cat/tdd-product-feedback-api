// use this route to upload file
const express = require("express");
const {user_register, user_login, user_me} = require("../controllers/userController");
const {authRequired} = require("../middlewares/authRequired");
const app = express();

function userRouter({config, services}) {
  const Router = express.Router();
  Router.post("/user/register", user_register);
  Router.post("/user/login", user_login);
  Router.get("/user/me", authRequired, user_me);

  return Router;
}

module.exports = userRouter;
