const express = require("express");
const {
  getPackages,
  createPackage,
} = require("../controller/paymentPackages.controller");
const { adminMiddleware, userMiddleware } = require("../middleware/jwt");

const router = express.Router();

router
  .get("/", getPackages)
  .post("/", userMiddleware, adminMiddleware, createPackage);
module.exports = router;
