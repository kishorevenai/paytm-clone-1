const express = require("express");
const router = express.Router();
const accountController = require("../controller/accountController");
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router
  .route("/account")
  .get(accountController.getBalance)
  .post(accountController.transferAmount);
module.exports = router;
