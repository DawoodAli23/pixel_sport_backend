const express = require("express");
const { generatePaymentUrl } = require("../controller/payment.controller");

const router = express.Router();

router.post("/", generatePaymentUrl);
module.exports = router;
