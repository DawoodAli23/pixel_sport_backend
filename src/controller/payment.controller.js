const { default: axios } = require("axios");

const {
  generateHmacSha512,
  generateConcatenatedString,
  concatenateWithEndpoint,
} = require("../helper/generateHmac512");
const { PaymentModel, PaymentPackages, UserModel } = require("../model");
const { default: mongoose } = require("mongoose");
const moment = require("moment");

const generatePaymentUrl = async (req, res) => {
  try {
    const {
      user,
      body: { package_id },
    } = req;

    if (user.expiryDate) {
      if (+new Date() < +new Date(user.expiryDate)) {
        throw new Error(
          "You already have an active subscription, you cannot subscribe again!"
        );
      }
    }
    const timestamp = new Date().toISOString();
    const package = await PaymentPackages.findById(package_id).lean();
    const body = {
      amount: package.amount,
      cancelUrl: "http://pixelsport.tv/membership_plan",
      currencyCode: "USD",
      item_0_name: package_id,
      merchantName: process.env.MERCHANT_USERNAME,
      merchantReferenceCode: timestamp,
      merchantSecretKey: process.env.PAYMENT_SECRET_KEY,
      merchantToken: timestamp,
      returnUrl: "http://pixelsport.tv/membership_plan",
    };
    const concatenatedString = generateConcatenatedString(body);
    const fullURL = concatenateWithEndpoint(
      process.env.LIVE_MODE,
      concatenatedString
    );
    body["sig"] = generateHmacSha512(fullURL, process.env.PAYMENT_SECRET_KEY);
    const token = await axios.post(process.env.LIVE_MODE, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    await PaymentModel.create({
      userId: user._id,
      sig: body["sig"],
      token: token.data.token,
      packageId: package_id,
    });

    res.status(200).send({
      message: "Token Generated!",
      data: `https://secure.paycec.com/redirect-service/webscreen?token=${token.data.token}`,
    });
  } catch (error) {
    res.send({ error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      user,
      params: { token },
    } = req;

    const payment = await PaymentModel.findOne({
      status: "pending",
      token,
    }).lean();
    const package = await PaymentPackages.findOne({
      _id: payment.packageId,
    }).lean();
    if (!payment) {
      throw new Error("Payment does not exist");
    }
    const body = {
      merchantName: process.env.MERCHANT_USERNAME,
      merchantSecretKey: process.env.PAYMENT_SECRET_KEY,
      token: payment.token,
    };
    const concatenatedString = generateConcatenatedString(body);
    const fullURL = concatenateWithEndpoint(
      process.env.LIVE_MODE_DETAILS,
      concatenatedString
    );
    body["sig"] = generateHmacSha512(fullURL, process.env.PAYMENT_SECRET_KEY);
    const paymentDetails = await axios.post(
      process.env.LIVE_MODE_DETAILS,
      body,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const statusUpdate = {};
    if (
      paymentDetails.data.isSuccessful == "true" ||
      paymentDetails.data.isSuccessful == "false"
    ) {
      statusUpdate["status"] =
        paymentDetails.data.isSuccessful == "true" ? "successfull" : "failed";
    }
    if (paymentDetails.data.isSuccessful === "true") {
      let currentDate = moment();

      if (user.expiryDate && moment().isAfter(moment(user.expiryDate))) {
        currentDate = moment();
      }
      if (user.expiryDate && moment().isBefore(moment(user.expiryDate))) {
        currentDate = moment(user.expiryDate);
      }
      let nextDay = moment(currentDate).add(package.days, "days");

      await UserModel.findOneAndUpdate(
        {
          _id: user._id,
        },
        {
          expiryDate: nextDay.toDate(), // convert back to native Date object if needed
          packageId: package._id,
        }
      );
    }

    const updatePayment = await PaymentModel.findOneAndUpdate(
      {
        token,
      },
      {
        data: paymentDetails.data,
        ...statusUpdate,
      }
    );
    res.status(200).send({
      message: "Token Verified!",
      data: updatePayment,
    });
  } catch (error) {
    res.send("Unable to verify the payment!");
  }
};

const freeTier = async (req, res) => {
  try {
    const { user } = req;
    if (!user.freeTierAvailable) {
      throw new Error("You have availed the free tier already!");
    }
    let currentDate = new Date();
    if (user.expiryDate) {
      currentDate = new Date(user.expiryDate);
    }
    let nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);

    await UserModel.findOneAndUpdate(
      { _id: user._id },
      {
        freeTierAvailable: false,
        expiryDate: nextDay,
      }
    );
    await PaymentModel.create({
      userId: user._id,
      packageId: new mongoose.Types.ObjectId("656a28b0dd38c3eebf3454af"),
      status: "successfull",
    });
    res.status(200).send({
      message: "Free tier availed!",
    });
  } catch (error) {
    res.send({ message: error.message });
  }
};

const getPaymentsOfUser = async (req, res) => {
  try {
    const {
      user: { _id },
    } = req;
    const payments = await PaymentModel.find({
      userId: _id,
      status: "successfull",
    })
      .sort({ createdAt: -1 })
      .populate("packageId")
      .populate("userId")
      .lean();
    res.status(200).send({
      message: "Payments Fetched!",
      data: payments,
    });
  } catch (error) {
    res.send({ message: error.message });
  }
};

const canView = async (req, res) => {
  try {
    const {
      user: { expiryDate },
    } = req;
    if (!expiryDate) {
      return res.send({
        flag: false,
      });
    }
    res.send({
      flag: +new Date() < +new Date(expiryDate),
    });
  } catch (error) {
    res.send({ message: error.message });
  }
};

// const getPayments = async (req, res) => {
//   try {
//     const {
//       params: { skip },
//       query: { searchString },
//     } = req;

//     if (!searchString) {
//       return res.status(400).send({
//         error: "parameter is required.",
//       });
//     }
//     const userPayments = await PaymentModel.aggregate([
//       {
//         $lookup: {
//           from: "users",
//           localField: "userId",
//           foreignField: "_id",
//           as: "userdata",
//         },
//       },

//       // {
//       //   $match: {
//       //     "userdata.email": { $regex: new RegExp(searchString, "i") },
//       //   },
//       // },
//       {
//         $project: {
//           _id: 1,
//           userdata: {
//             $filter: {
//               input: "$userdata",
//               as: "userItem",
//               cond: {
//                 $or: [
//                   {
//                     $regexMatch: {
//                       input: "$$userItem.email",
//                       regex: new RegExp(searchString, "i"),
//                     },
//                   },
//                 ],
//               },
//             },
//           },
//           userId: 1,
//           packageId: 1,
//           status: 1,
//           createdAt: 1,
//           updatedAt: 1,
//           __v: 1,
//         },
//       },

//       {
//         $skip: parseInt(skip),
//       },
//       {
//         $limit: 10,
//       },
//     ]);
//     res.status(200).send({
//       data: { userPayments },
//     });
//   } catch (error) {
//     res.status(500).send({ error: error.message });
//   }
// };
const getPayments = async (req, res) => {
  try {
    const {
      params: { skip },
      query: { searchString },
    } = req;

    // if (!searchString) {
    //   return res.status(400).send({
    //     error: "Parameter is required.",
    //   });
    // }

    const userPayments = await PaymentModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userdata",
        },
      },
      {
        $lookup: {
          from: "paymentpackages",
          localField: "packageId",
          foreignField: "_id",
          as: "packagedata",
        },
      },
      {
        $unwind: "$userdata",
      },
      { $unwind: "$packagedata" },
      {
        $match: {
          "userdata.email": { $regex: new RegExp(searchString, "i") },
        },
      },
      {
        $match: {
          userdata: { $ne: [] },
        },
      },
      {
        $group: {
          _id: "$_id",
          userId: { $first: "$userId" },
          packageId: { $first: "$packageId" },
          status: { $first: "$status" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          token: { $first: "$token" },
          __v: { $first: "$__v" },
          userdata: { $push: "$userdata" },
          packagedata: { $push: "$packagedata" },
        },
      },
      {
        $project: {
          _id: 1,
          packagedata: 1,
          userdata: {
            $filter: {
              input: "$userdata",
              as: "userItem",
              cond: {
                $or: [
                  {
                    $regexMatch: {
                      input: "$$userItem.email",
                      regex: new RegExp(searchString, "i"),
                    },
                  },
                ],
              },
            },
          },
          userId: 1,
          packageId: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          token: 1,
          __v: 1,
        },
      },
      {
        $skip: parseInt(skip),
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).send({
      data: { userPayments },
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
module.exports = {
  generatePaymentUrl,
  canView,
  verifyPayment,
  freeTier,
  getPaymentsOfUser,
  getPayments,
};
