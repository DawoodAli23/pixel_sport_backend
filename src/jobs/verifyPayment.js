// const { PaymentModel } = require("../model");

// const verifyPayments = async () => {
//   try {
//     var previousDate = new Date();
//     previousDate.setHours(0, 0, 0, 0);
//     previousDate.setDate(previousDate.getDate() - 1);

//     const payments = await PaymentModel.find({
//       status: "pending",
//       createdAt: { $gt: previousDate.toISOString() },
//     }).lean();

//     if (payments.length) {
//     }
//   } catch (error) {
//     console.log({ error });
//   }
// };

// module.exports = {
//   verifyPayments,
// };
