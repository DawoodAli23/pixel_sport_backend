const crypto = require("crypto");

const generateHmacSha512 = (data, secretKey) => {
  const hmac = crypto.createHmac("sha512", secretKey);
  hmac.update(data);
  return hmac.digest("hex");
};
const generateConcatenatedString = (fields) => {
  const sortedFields = Object.entries(fields)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

  const encodedFields = Object.fromEntries(
    Object.entries(sortedFields).map(([key, value]) => [
      key,
      encodeURIComponent(value),
    ])
  );

  const concatenatedString = Object.entries(encodedFields)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return concatenatedString;
};
const concatenateWithEndpoint = (baseURL, concatenatedString) => {
  return `${baseURL}?${concatenatedString}`;
};
module.exports = {
  generateHmacSha512,
  generateConcatenatedString,
  concatenateWithEndpoint,
};
