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

const deletePackage = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    await PaymentPackages.deleteOne({
      _id: id,
    });
    res.status(200).send({
      message: "Payment Packages deleted!",
    });
  } catch (error) {
    res.send({ error: error.message });
  }
};

const getPackagesAdmin = async (req, res) => {
  try {
    const packages = await PaymentPackages.find({}).lean();

    res.status(200).send({
      message: "Payment Packages found!",
      data: packages,
    });
  } catch (error) {
    res.send({ error: error.message });
  }
};
const getSpecific = async (req, res) => {
  try {
    const packages = await PaymentPackages.findOne({
      _id: req.params.id,
    }).lean();

    res.status(200).send({
      message: "Payment Packages found!",
      data: packages,
    });
  } catch (error) {
    res.send({ error: error.message });
  }
};

const updatePackage = async (req, res) => {
  try {
    const {
      body: { name, days, amount, status, _id },
    } = req;
    const nameToBeUpdated = name ? { name } : {};
    const daysToBeUpdated = days ? { days } : {};
    const amountToBeUpdated = amount ? { amount } : {};
    const statusToBeUpdated = status ? { status } : {};
    await PaymentPackages.findOneAndUpdate(
      {
        _id,
      },
      {
        ...nameToBeUpdated,
        ...daysToBeUpdated,
        ...amountToBeUpdated,
        ...statusToBeUpdated,
      }
    );
    res.status(200).send({
      message: "Payment Packages updated!",
    });
  } catch (error) {
    res.send({ error: error.message });
  }
};
module.exports = {
  getPackages,
  getSpecific,
  createPackage,
  deletePackage,
  getPackagesAdmin,
  updatePackage,
};
