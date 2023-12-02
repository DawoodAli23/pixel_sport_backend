const mongoose = require("mongoose");
const { LiveTvModel } = require("../model");
const data = require("../json/channels_list.json");
require("dotenv").config();

let processedData = data.map(
  (d) =>
    new LiveTvModel({
      ...d,
      TVCategory: new mongoose.Types.ObjectId(d.TVCategory),
    })
);
processedData;
const seedDatabase = async () => {
  try {
    // Connect to the database
    await mongoose.connect(String(process.env.DB_CONNECTION_STRING));
    console.log("Connected to the database in development environment");

    await Promise.all(processedData.map((p) => p.save()));

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
