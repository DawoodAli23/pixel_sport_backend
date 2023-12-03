const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    userType: {
      type: String,
      enum: ["user", "admin", "subadmin"],
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
    phone: {
      type: Number,
    },
    password: {
      type: String,
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
    status: {
      type: String,
      enum: ["active", "inactive"],
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "paymentpackages",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
