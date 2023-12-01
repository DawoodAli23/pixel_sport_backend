const Category = require("../model/category");
const createCategory = async (req, res) => {
  try {
    const { name, status } = req.body;
    if (!name || !status) {
      return res
        .status(400)
        .json({ message: "Name and status are required fields." });
    } else {
      const newCategory = new Category({
        name,
        status,
      });
      await newCategory.save();
      res.status(201).json({
        message: "Category created successfully",
        category: newCategory,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
const updateCategory = async (req, res) => {
  try {
    const { name, status, categoryId } = req.body;

    if (!name || !status || !categoryId) {
      return res.status(400).json({
        message: "Name, status, and category ID are required fields.",
      });
    }
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found." });
    }
    existingCategory.name = name;
    existingCategory.status = status;
    await existingCategory.save();
    res.json({
      message: "Category updated successfully",
      category: existingCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required." });
    }
    const existingCategory = await Category.deleteOne({ _id: categoryId });
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required." });
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }
    res.json({ category });
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ categories });
  } catch (error) {
    console.error("Error fetching all categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getAllCategories,
};
