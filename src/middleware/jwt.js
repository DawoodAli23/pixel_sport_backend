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
    next();
  } catch (error) {
    res.status(401).send("Unauthorized!");
  }
};

const adminMiddleware = async (req, res, next) => {
  try {
    const {
      user: { userType },
    } = req;
    if (userType == "admin") {
      next();
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
