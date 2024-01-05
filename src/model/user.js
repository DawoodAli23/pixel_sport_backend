const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    usertype: {
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
      default: "active",
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "paymentpackages",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    code: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
