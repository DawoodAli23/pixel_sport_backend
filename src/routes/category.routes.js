const express = require("express");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
} = require("../controller/category.controller");
const { userMiddleware, adminMiddleware } = require("../middleware/jwt");
const router = express.Router();
router.post("/createCategory", userMiddleware, adminMiddleware, createCategory);
router.post("/updateCategory", userMiddleware, adminMiddleware, updateCategory);
router.delete(
  "/deleteCategory/:categoryId",
  userMiddleware,
  adminMiddleware,
  deleteCategory
);
router.get("/getAllCategories", getAllCategories);
router.get("/getCategoryById/:categoryId", getCategoryById);
module.exports = router;
