const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const { UserModel } = require("../model");

const register = async (req, res) => {
  try {
    const {
      body: { name, password, email },
    } = req;
    const userExist = await UserModel.findOne({ email }).lean();
    if (userExist) {
      throw new Error("Email is already taken");
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      name,
      email,
      password: encryptedPassword,
    });
    delete user._doc["password"];
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(200).send({
      message: "Signed up successfully!",
      data: { user, token },
    });
  } catch (error) {
    res.send({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const {
      body: { password, email },
    } = req;
    const userExist = await UserModel.findOne({ email }).lean();
    if (!userExist) {
      throw new Error("Email does not exist!");
    }
    const match = await bcrypt.compare(password, userExist.password);
    if (!match) {
      throw new Error("Email or password mismatch!");
    }
    delete userExist["password"];
    const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET);

    res.status(200).send({
      message: "Logged in successfully!",
      data: { user: userExist, token },
    });
  } catch (error) {
    res.send({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const {
      body: { name, email, password, phone, address },
      user,
    } = req;
  } catch (error) {
    res.send({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  update,
};
