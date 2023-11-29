const mongoose = require("mongoose");
const { PaymentPackages } = require("../model");
require("dotenv").config();

const seedDatabase = async () => {
  try {
    // Connect to the database
    await mongoose.connect(String(process.env.DB_CONNECTION_STRING));
    console.log("Connected to the database in development environment");

    // Create an array of PaymentPackages
    const paymentPackages = [
      new PaymentPackages({
        name: "Free Service - No Card required",
        amount: 0,
        days: 1,
      }),
      new PaymentPackages({
        name: "Basic Service",
        amount: 7,
        days: 7,
      }),
      new PaymentPackages({
        name: "Premium Service",
        amount: 10,
        days: 30,
      }),
      new PaymentPackages({
        name: "Platinum Service",
        amount: 100,
        days: 365,
      }),
    ];

    // Use Promise.all to save all PaymentPackages
    await Promise.all(paymentPackages.map((p) => p.save()));

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
