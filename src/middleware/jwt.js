const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const { UserModel } = require("../model");

const userMiddleware = async (req, res, next) => {
  try {
    const {
      headers: { token },
    } = req;
    const decodedToken = jwt.decode(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decodedToken.id).lean();
    req.user = user;
    return next();
  } catch (error) {
    res.status(401).send("Unauthorized!");
  }
};

const adminMiddleware = async (req, res, next) => {
  try {
    const {
      user: { usertype },
    } = req;
    if (usertype == "admin") {
      return next();
    }
    throw new Error("");
  } catch (error) {
    res.status(401).send("Unauthorized!");
  }
};

module.exports = {
  userMiddleware,
  adminMiddleware,
};
