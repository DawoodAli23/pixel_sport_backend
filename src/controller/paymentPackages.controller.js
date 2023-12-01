const { PaymentPackages } = require("../model");

const getPackages = async (req, res) => {
  try {
    const packages = await PaymentPackages.find({ status: true }).lean();

    res.status(200).send({
      message: "Payment Packages found!",
      data: packages,
    });
  } catch (error) {
    res.send({ error: error.message });
  }
};

const createPackage = async (req, res) => {
  try {
    const {
      body: { name, days, amount, status },
    } = req;

    const paymentPackage = await PaymentPackages.create({
      name,
      days,
      amount,
      status,
    });
    res.status(200).send({
      message: "Payment Packages created!",
      data: paymentPackage,
    });
  } catch (error) {
    res.send({ error: error.message });
  }
};
module.exports = {
  getPackages,
  createPackage,
};
