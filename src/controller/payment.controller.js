const { default: axios } = require("axios");
const bcrypt = require("bcrypt");
const {
  generateHmacSha512,
  generateConcatenatedString,
  concatenateWithEndpoint,
} = require("../helper/generateHmac512");

const generateToken = async (req, res) => {
  try {
    const timestamp = new Date().toISOString();
    const body = {
      amount: 100,
      cancelUrl: "https://google.com",
      currencyCode: "USD",
      merchantName: process.env.MERCHANT_USERNAME,
      merchantReferenceCode: timestamp,
      merchantSecretKey: process.env.PAYMENT_SECRET_KEY,
      merchantToken: timestamp,
      returnUrl: "https://facebook.com",
      shippingTotal: 110,
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
    res.status(200).send({
      message: "Token Generated!",
      data: token.data,
    });
  } catch (error) {
    res.send({ error: error.message });
  }
};

module.exports = {
  generateToken,
};
