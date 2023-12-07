const { default: axios } = require("axios");
const { UserModel } = require("../model");
const { emailSent } = require("../mail/mail");
const WishList = require("../model/wishList");
const sendMail = async () => {
  await WishList.deleteMany({});
  const currDate = new Date();
  currDate.setUTCHours(0, 0, 0, 0);
  const output = `<!DOCTYPE html>
  <html>
  <head>
    <title>Subscription Expired</title>
  </head>
  <body>
    <p>Your subscription for PixelSports has been expired</p>
  </body>
  </html>`;
  const users = await UserModel.find({ expiryDate: { $gt: currDate } });
  users.forEach(async (user) => {
    await emailSent(user.email, output, "Subscription Expired");
  });
};
module.exports = {
  sendMail,
};
