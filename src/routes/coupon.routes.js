const express = require("express");
const { createCoupon } = require("../controller/coupon.controller");
const router = express.Router();
router.post("/", createCoupon);
module.exports = router;
