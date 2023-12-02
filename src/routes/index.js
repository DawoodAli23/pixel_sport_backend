const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const paymentRoutes = require("./payment.routes");
const categoryRoutes = require("./category.routes");
const paymentPackagesRoutes = require("./paymentPackages.routes");
const liveTvRoutes = require("./liveTv.routes");
const couponRoutes = require("./coupon.routes");
const { userMiddleware, adminMiddleware } = require("../middleware/jwt");
router
  .use("/auth", authRoutes)
  .use("/payment", userMiddleware, paymentRoutes)
  .use("/packages", userMiddleware, paymentPackagesRoutes)
  .use("/category", categoryRoutes)
  .use("/liveTV", liveTvRoutes)
  .use("/coupon", userMiddleware, couponRoutes);
module.exports = router;
