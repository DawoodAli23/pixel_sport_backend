const express = require("express");
const {
  createCoupon,
  getCoupons,
  editCoupon,
  deleteCoupon,
  availCoupon,
  getCouponDetails,
} = require("../controller/coupon.controller");
const { adminMiddleware } = require("../middleware/jwt");
const router = express.Router();
router
  .post("/", adminMiddleware, createCoupon)
  .get("/", adminMiddleware, getCoupons)
  .get("/:id", adminMiddleware, getCouponDetails)
  .put("/", adminMiddleware, editCoupon)
  .delete("/:_id", adminMiddleware, deleteCoupon)
  .post("/:code", availCoupon);
module.exports = router;
