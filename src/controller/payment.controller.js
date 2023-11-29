const { default: axios } = require("axios");

const {
  generateHmacSha512,
  generateConcatenatedString,
  concatenateWithEndpoint,
} = require("../helper/generateHmac512");
const { PaymentModel } = require("../model");

const generatePaymentUrl = async (req, res) => {
  try {
    const {
      user,
      body: { package_id },
    } = req;
    const timestamp = new Date().toISOString();
    const body = {
      amount: 1,
      cancelUrl: "https://google.com",
      currencyCode: "USD",
      item_0_name: package_id,
      merchantName: process.env.MERCHANT_USERNAME,
      merchantReferenceCode: timestamp,
      merchantSecretKey: process.env.PAYMENT_SECRET_KEY,
      merchantToken: timestamp,
      returnUrl: "https://facebook.com",
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
    });

    res.status(200).send({
      message: "Token Generated!",
      data: `https://secure.paycec.com/redirect-service/webscreen?token=${token.data.token}`,
    });
  } catch (error) {
    res.send({ error: error.message });
  }
};

module.exports = {
  generatePaymentUrl,
};
