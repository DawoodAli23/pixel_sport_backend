const express = require("express");
const {
  getPackages,
  createPackage,
  deletePackage,
  getPackagesAdmin,
  getSpecific,
  updatePackage,
} = require("../controller/paymentPackages.controller");
const { adminMiddleware, userMiddleware } = require("../middleware/jwt");

const router = express.Router();

router
  .get("/admin", userMiddleware, adminMiddleware, getPackagesAdmin)
  .get("/", getPackages)
  .get("/:id", userMiddleware, adminMiddleware, getSpecific)
  .post("/", userMiddleware, adminMiddleware, createPackage)
  .delete("/:id", userMiddleware, adminMiddleware, deletePackage)
  .put("/", userMiddleware, adminMiddleware, updatePackage);
module.exports = router;
