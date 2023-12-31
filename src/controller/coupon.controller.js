const { default: mongoose } = require("mongoose");
const { CouponModel, UserModel, PaymentPackages } = require("../model");

const createCoupon = async (req, res) => {
  try {
    const {
      body: { code, plan, numberOfUses, status, expiryDate },
    } = req;
    const coupon = await CouponModel.create({
      code,
      plan,
      numberOfUses,
      totalNumberOfUses: numberOfUses,
      status,
      expiryDate,
    });
    res.status(200).send({
      message: "Coupon Generated!",
      data: coupon,
    });
  } catch (error) {
    res.send({ error: error.message });
  }
};

const editCoupon = async (req, res) => {
  try {
    const {
      body: { _id, code, plan, numberOfUses, status, expiryDate },
    } = req;
    const codeToEdit = code ? { code } : {};
    const planToEdit = plan ? { plan } : {};
    const usesToEdit = numberOfUses ? { numberOfUses } : {};
    const statusToEdit = status ? { status } : {};
    const expiryDateToEdit = expiryDate ? { expiryDate } : {};
    const coupon = await CouponModel.findOneAndUpdate(
      { _id },
      {
        ...codeToEdit,
        ...planToEdit,
        ...usesToEdit,
        ...statusToEdit,
        ...expiryDateToEdit,
      }
    );
    res.status(200).send({
      message: "Coupon Edited!",
      data: coupon,
    });
  } catch (error) {
    res.send({ error: error.message });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const {
      params: { _id },
    } = req;
    const coupon = await CouponModel.deleteOne({ _id });
    res.status(200).send({
      message: "Coupon Edited!",
      data: coupon,
    });
  } catch (error) {
    res.send({ error: error.message });
  }
};

const availCoupon = async (req, res) => {
  try {
    const {
      user,
      params: { code },
    } = req;
    const date = new Date();

    const coupon = await CouponModel.findOne({
      code,
      status: true,
      numberOfUses: { $gte: 0 },
      expiryDate: { $gte: date },
    }).lean();

    if (!coupon) {
      throw new Error("Coupon is not valid!");
    }
    const package = await PaymentPackages.findOne({
      _id: coupon.plan,
    }).lean();

    let currentDate = new Date();
    if (user.expiryDate) {
      currentDate = new Date(user.expiryDate);
    }
    let nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + package.days);
    await UserModel.findOneAndUpdate(
      { _id: user._id },
      {
        expiryDate: nextDay,
        packageId: coupon.plan,
      }
    );
    await CouponModel.findOneAndUpdate(
      { _id: coupon._id },
      { numberOfUses: coupon.numberOfUses - 1 }
    );
    res.status(200).send({
      message: "Coupon availed!",
    });
  } catch (error) {
    res.send({ error: error.message });
  }
};

const getCoupons = async (req, res) => {
  try {
    const coupons = await CouponModel.find({}).populate("plan").lean();
    res.status(200).send({
      message: "Coupon Found!",
      data: coupons,
    });
  } catch (error) {
    res.send({ error: error.message });
  }
};

const getCouponDetails = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    const coupons = await CouponModel.findOne({ _id: id }).lean();
    res.status(200).send({
      message: "Coupon Found!",
      data: coupons,
    });
  } catch (error) {
    res.send({ error: error.message });
  }
};
module.exports = {
  createCoupon,
  editCoupon,
  deleteCoupon,
  availCoupon,
  getCoupons,
  getCouponDetails,
};
