const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { UserModel } = require("../model");
const crypto = require("crypto");

const register = async (req, res) => {
  try {
    const {
      body: { name, password, email },
    } = req;
    const userExist = await UserModel.findOne({ email }).lean();
    if (userExist) {
      throw new Error("Email is already taken");
    }
    const encryptedPassword = await bcrypt.hash(password, 11);
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
const createUser = async (req, res) => {
  try {
    const {
      body: {
        name,
        password,
        email,
        phone,
        address,
        expDate,
        packageId,
        status,
      },
    } = req;
    const userExist = await UserModel.findOne({ email }).lean();

    if (userExist) {
      throw new Error("Email is already taken");
    }
    const encryptedPassword = await bcrypt.hash(password, 11);
    const user = await UserModel.create({
      name,
      email,
      password: encryptedPassword,
      phone,
      address,
      expDate,
      packageId,
      status,
      image: req.file.path,
    });
    res.status(200).send({
      message: "Signed up successfully!",
      data: { user },
    });
  } catch (error) {
    res.send({ error: error.message });
  }
};
const loginWithGoogle = async (req, res) => {
  try {
    const {
      body: { name, email, googleId, imageUrl },
    } = req;
    console.log(req.body);
    const userExist = await UserModel.findOne({ googleId: googleId });
    if (userExist) {
      const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET);
      res.status(200).send({
        message: "Logged in successfully!",
        data: { user: userExist, token },
      });
    } else {
      const user = await UserModel.create({
        name,
        email,
        googleId,
        image: imageUrl,
      });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.status(200).send({
        message: "Signed up successfully!",
        data: { user, token },
      });
    }
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
      body: { userId, name, email, password, phone, address },
    } = req;
    const userExist = await UserModel.findOne({ _id: userId }).lean();
    if (!userExist) {
      throw new Error("Email does not exist!");
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const updateUser = await UserModel.updateOne(
      { _id: userId },
      {
        $set: {
          name: name,
          email: email,
          password: encryptedPassword,
          phone: phone,
          address: address,
          image: req.file.path,
        },
      }
    );
    res.status(200).json({ updateUser });
  } catch (error) {
    res.send({ error: error.message });
  }
};
const sendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email: email });
    // const email = user.email;

    let verificationCode = generateVerificationCode();
    const output = `<!DOCTYPE html>
  <html>
  <head>
    <title>Verification Code</title>
  </head>
  <body>
    <h1>Verification Code</h1>
    <p>Your verification code is: <strong id="verificationCode">${verificationCode}</strong></p>
  </body>
  </html>`;
    await emailSent(email, output);
    await UserModel.updateOne(
      { email },
      { $set: { verifyCode: verificationCode } }
    );
    res.status(200).json({ message: "email sent succesfully" });
  } catch (err) {
    res.status(400).json({ err });
  }
};
const codeverification = async (req, res) => {
  try {
    const { email, code, password } = req.body;
    console.log(email, code);
    const user = await UserModel.findOne({ email: email });
    const encryptedPassword = await bcrypt.hash(password, 11);
    if (user.verifyCode == code) {
      const result = await UserModel.findOneAndUpdate(
        { email: email },
        { $set: { password: encryptedPassword, verifyCode: "" } },
        { new: true }
      );

      if (result) {
        res.status(200).json({
          message: "User verified",
        });
      }
    } else {
      res.status(401).json({
        isverified: false,
      });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ err });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const user = await UserModel.find({ userType: "user" });
    res.status(200).send({
      data: { user },
    });
  } catch (error) {
    res.send({ error: error.message });
  }
};
module.exports = {
  register,
  login,
  update,
  loginWithGoogle,
  sendVerificationCode,
  codeverification,
  createUser,
  getAllUsers,
};
