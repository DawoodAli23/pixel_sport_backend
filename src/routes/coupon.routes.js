const express = require("express");
const {
  createCoupon,
  getCoupons,
  editCoupon,
  deleteCoupon,
  availCoupon,
} = require("../controller/coupon.controller");
const { adminMiddleware } = require("../middleware/jwt");
const router = express.Router();
router
  .post("/", adminMiddleware, createCoupon)
  .get("/", adminMiddleware, getCoupons)
  .put("/", adminMiddleware, editCoupon)
  .delete("/:_id", adminMiddleware, deleteCoupon)
  .post("/:code", availCoupon);
module.exports = router;
