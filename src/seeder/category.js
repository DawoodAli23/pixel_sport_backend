const mongoose = require("mongoose");
const { CategoryModel } = require("../model");
require("dotenv").config();

const seedDatabase = async () => {
  try {
    // Connect to the database
    await mongoose.connect(String(process.env.DB_CONNECTION_STRING));
    console.log("Connected to the database in development environment");

    const categoryModel = [
      new CategoryModel({
        name: "MLB",
        status: "active",
      }),
      new CategoryModel({
        name: "NBA",
        status: "active",
      }),
      new CategoryModel({
        name: "NFL",
        status: "active",
      }),
      new CategoryModel({
        name: "NHL",
        status: "active",
      }),
    ];

    await Promise.all(categoryModel.map((p) => p.save()));

    console.log("DONE!");
  } catch (error) {
    console.error(error.stack);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
  }
};

// Call the seedDatabase function
seedDatabase();
