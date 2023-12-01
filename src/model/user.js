const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    userType: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    googleId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    image: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    expDate: {
      type: Date,
    },
    verifyCode: {
      type: String,
    },
    freeTierAvailable: {
      type: Boolean,
      default: true,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
