const { PaymentPackages, PaymentModel } = require("../model");

const getTransaction = async (req, res) => {
  try {
    const packages = await PaymentModel.find({})
      .populate({
        path: "userId",
        // options: { strictPopulate: false },
      })
      .populate({
        path: "packageId",
        // options: { strictPopulate: false },
      })
      .lean();

    res.status(200).send({
      message: "Payment Packages found!",
      data: packages,
    });
  } catch (error) {
    res.send({ error: error.message });
  }
};

module.exports = {
  getTransaction,
};
