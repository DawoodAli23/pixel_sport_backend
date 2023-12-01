const express = require("express");
const {
  generatePaymentUrl,
  verifyPayment,
  freeTier,
} = require("../controller/payment.controller");

const router = express.Router();

router
  .post("/", generatePaymentUrl)
  .get("/free", freeTier)
  .get("/:token", verifyPayment);
module.exports = router;
