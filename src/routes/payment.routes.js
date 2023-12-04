const express = require("express");
const {
  generatePaymentUrl,
  verifyPayment,
  freeTier,
  getPaymentsOfUser,
} = require("../controller/payment.controller");

const router = express.Router();

router
  .post("/", generatePaymentUrl)
  .get("/free", freeTier)
  .get("/user", getPaymentsOfUser)
  .get("/:token", verifyPayment);
module.exports = router;
