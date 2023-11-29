const express = require("express");
const {
  getPackages,
  createPackage,
} = require("../controller/paymentPackages.controller");
const { adminMiddleware } = require("../middleware/jwt");

const router = express.Router();

router.get("/", getPackages).post("/", adminMiddleware, createPackage);
module.exports = router;
