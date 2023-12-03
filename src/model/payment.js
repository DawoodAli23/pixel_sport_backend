const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentPackages",
    },
    token: {
      type: String,
    },
    sig: {
      type: String,
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
