// use this route to upload file
const express = require("express");
const {user_register} = require("../controllers/userController");
const app = express();

function userRouter({config, services}) {
  const Router = express.Router();
  Router.post("/user/register", user_register);
  return Router;
}

module.exports = userRouter;
