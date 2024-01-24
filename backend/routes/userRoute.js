const express = require("express");
const routes = express.Router();

const userController = require("../controller/userController");
const verifyJWT = require('../middleware/verifyJWT')

routes
  .route("/users")
  .post(userController.Signup)
  .get(userController.SignIn)
  .put(verifyJWT,userController.UpdateUser);

module.exports = routes;
