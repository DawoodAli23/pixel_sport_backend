const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const paymentRoutes = require("./payment.routes");
router.use("/auth", authRoutes).use("/payment", paymentRoutes);
module.exports = router;
