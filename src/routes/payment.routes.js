const express = require("express");
const {
  generatePaymentUrl,
  verifyPayment,
  freeTier,
  getPaymentsOfUser,
  canView,
} = require("../controller/payment.controller");
const { userMiddleware } = require("../middleware/jwt");

const router = express.Router();

router
  .get("/canView", userMiddleware, canView)
  .post("/", generatePaymentUrl)
  .get("/free", freeTier)
  .get("/user", getPaymentsOfUser)
  .get("/:token", verifyPayment);
module.exports = router;
