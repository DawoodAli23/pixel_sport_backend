const mongoose = require("mongoose");
const { UserModel } = require("../model");
require("dotenv").config();

const seedDatabase = async () => {
  try {
    // Connect to the database
    await mongoose.connect(String(process.env.DB_CONNECTION_STRING));
    console.log("Connected to the database in development environment");

    // Create an array of PaymentPackages
    const admin = [
      new UserModel({
        usertype: "admin",
        name: "Pixel Sport",
        email: "main@admin.com",
        password:
          "$2a$10$PkK2R5dzLF6SO2l0t9.ZuOhQf8LXRgp8Nxsxm77kBBpINj1ee8ckq", //Rezan@112233
      }),
    ];

    // Use Promise.all to save all admin
    await Promise.all(admin.map((p) => p.save()));

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
