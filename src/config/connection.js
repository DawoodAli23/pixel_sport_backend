const mongoose = require("mongoose");

let client; // Declare client outside the function to maintain the connection state

module.exports = createConnection = async () => {
  const url = process.env.DB_CONNECTION_STRING;

  try {
    if (!client) {
      client = await mongoose.connect(url);
      console.log("Connection established with MongoDB");
    }
  } catch (error) {
    console.error("Cannot establish connection with MongoDB:", error);
    throw error; // Rethrow the error to indicate connection failure
  }

  return client;
};
