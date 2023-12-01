const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "paymentpackages",
    },
    token: {
      type: String,
      required: true,
    },
    sig: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    data: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
