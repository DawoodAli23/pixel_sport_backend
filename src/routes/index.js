const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const paymentRoutes = require("./payment.routes");
const categoryRoutes = require("./category.routes");
const paymentPackagesRoutes = require("./paymentPackages.routes");
const liveTvRoutes = require("./liveTv.routes");
const couponRoutes = require("./coupon.routes");
const transactionRoutes = require("./transactions.routes");
const sliderRoutes = require("./slider.routes");
const wishlistRoutes = require("./wishList.routes");
const { userMiddleware, adminMiddleware } = require("../middleware/jwt");
router
  .use("/backend/auth", authRoutes)
  .use("/backend/payment", userMiddleware, paymentRoutes)
  .use("/backend/packages", paymentPackagesRoutes)
  .use("/backend/category", categoryRoutes)
  .use("/backend/liveTV", liveTvRoutes)
  .use("/backend/coupon", userMiddleware, couponRoutes)
  .use("/backend/transactions", userMiddleware, transactionRoutes)
  .use("/backend/slider", sliderRoutes)
  .use("/backend/wishList", userMiddleware, wishlistRoutes);
module.exports = router;
