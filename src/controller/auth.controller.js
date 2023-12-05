const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { UserModel } = require("../model");
const crypto = require("crypto");
const { emailSent } = require("../mail/mail");

const register = async (req, res) => {
  try {
    const {
      body: { name, password, email },
    } = req;
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
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      name,
      email,
      password: encryptedPassword,
      phone,
      address,
      expiryDate: expDate,
      packageId,
      status,
      image: req?.file?.path,
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
      body: {
        userId,
        name,
        email,
        password,
        phone,
        address,
        expiryDate,
        status,
      },
    } = req;
    // console.log(req.body);
    const userExist = await UserModel.findOne({ _id: userId }).lean();
    if (!userExist) {
      throw new Error("Email does not exist!");
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const filePath = req?.file?.path;
    const imageToEdit = filePath ? { image: filePath } : {};
    const nameToEdit = name ? { name } : {};
    const emailtoEdit = email ? { email } : {};
    const passwordToEdit = password ? { password: encryptedPassword } : {};
    const phoneToEdit = phone ? { phone } : {};
    const addressToEdit = address ? { address } : {};
    const statusToEdit = status ? { status } : {};

    const expiryDateToEdit = {};
    if (expiryDate) {
      const inputDateTime = `${expiryDate}T00:00:00.000Z`;

      const formattedDate = new Date(inputDateTime);
      expiryDateToEdit["expiryDate"] = formattedDate;
    }

    const updateUser = await UserModel.updateOne(
      { _id: userId },
      {
        $set: {
          ...imageToEdit,
          ...nameToEdit,
          ...emailtoEdit,
          ...passwordToEdit,
          ...phoneToEdit,
          ...addressToEdit,
          ...expiryDateToEdit,
          ...statusToEdit,
        },
      }
    );
    res.status(200).json({ data: updateUser });
  } catch (error) {
    console.log(error);
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
    await emailSent(email, output, "verification");
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
const getSpecificUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findOne({ _id: userId });
    res.status(200).json({ user });
  } catch (error) {
    res.send({ error: error.message });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.deleteOne({ _id: userId });
    res.status(200).json(user);
  } catch (error) {
    res.send({ error: error.message });
  }
};
const getSubAdmins = async (req, res) => {
  try {
    const user = await UserModel.find({ userType: "subadmin" });
    res.status(200).json({ data: user });
  } catch (error) {
    res.send({ error: error.message });
  }
};
const addSubAdmin = async (req, res) => {
  try {
    const {
      body: { name, password, email, phone, adminType, status },
    } = req;
    const userExist = await UserModel.findOne({ email }).lean();
    if (userExist) {
      throw new Error("Email is already taken");
    }
    const filePath = req.file.path;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      name,
      email,
      userType: adminType,
      phone,
      status,
      password: encryptedPassword,
      image: filePath,
    });
    console.log(user);
    res.status(200).json({ data: user });
  } catch (error) {
    console.log(error);
    res.send({ error: error.message });
  }
};
const editSubAdmin = async (req, res) => {
  try {
    console.log("subadmin");
    const { id, name, email, password, phone, adminType, status } = req.body;
    const userExist = await UserModel.findOne({ email }).lean();
    if (userExist) {
      const encryptedPassword = await bcrypt.hash(password, 10);
      const filePath = req?.file?.path;
      const imageToEdit = filePath ? { image: filePath } : {};
      const nameToEdit = name ? { name } : {};
      const emailtoEdit = email ? { email } : {};
      const passwordToEdit = password ? { password: encryptedPassword } : {};
      const phoneToEdit = phone ? { phone } : {};
      const statusToEdit = status ? { status } : {};
      const adminTypeToEdit = adminType ? { adminType } : {};
      const user = await UserModel.updateOne(
        { _id: id },
        {
          $set: {
            ...imageToEdit,
            ...nameToEdit,
            ...emailtoEdit,
            ...passwordToEdit,
            ...passwordToEdit,
            ...phoneToEdit,
            ...statusToEdit,
            ...adminTypeToEdit,
          },
        }
      );
      res.status(200).json({ data: "succesful" });
    }
  } catch (error) {
    console.log(error);
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
  getSpecificUser,
  deleteUser,
  getSubAdmins,
  addSubAdmin,
  editSubAdmin,
};
