const mongoose = require("mongoose");

const couponSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentPackages",
    },
    numberOfUses: {
      type: Number,
      required: true,
    },
    totalNumberOfUses: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
    },
    expiryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Coupon", couponSchema);
