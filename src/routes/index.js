const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const paymentRoutes = require("./payment.routes");
const paymentPackagesRoutes = require("./paymentPackages.routes");
const { userMiddleware } = require("../middleware/jwt");
router
  .use("/auth", authRoutes)
  .use("/payment", userMiddleware, paymentRoutes)
  .use("/packages", userMiddleware, paymentPackagesRoutes);
module.exports = router;
