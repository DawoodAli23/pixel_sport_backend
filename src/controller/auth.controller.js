const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { UserModel } = require("../model");
const LiveTV = require("../model/liveTv");
const crypto = require("crypto");
const { emailSent } = require("../mail/mail");
const { PaymentModel } = require("../model");
const moment = require("moment");
const calculatePayment = (array) => {
  let amount = 0;
  for (let i = 0; i < array.length; i++) {
    amount += array[i]?.packageId?.amount || 0;
  }
  return amount;
};
const getPaymentsByDateRange = async (req, res) => {
  try {
    const today = moment().startOf("day");
    const thisWeek = moment().startOf("week");
    const thisMonth = moment().startOf("month");
    const thisYear = moment().startOf("year");
    const liveTv = await LiveTV.countDocuments({});
    const Users = await UserModel.countDocuments({});
    const Transactions = await PaymentModel.countDocuments({});
    const paymentsToday = await PaymentModel.find({
      createdAt: {
        $gte: today.toDate(),
        $lt: moment(today).endOf("day").toDate(),
      },
    }).populate("packageId");
    const todayAmount = calculatePayment(paymentsToday);
    const paymentsThisWeek = await PaymentModel.find({
      createdAt: {
        $gte: thisWeek.toDate(),
        $lt: moment(thisWeek).endOf("week").toDate(),
      },
    }).populate("packageId");
    const weekAmount = calculatePayment(paymentsThisWeek);

    const paymentsThisMonth = await PaymentModel.find({
      createdAt: {
        $gte: thisMonth.toDate(),
        $lt: moment(thisMonth).endOf("month").toDate(),
      },
    }).populate("packageId");
    const monthAmount = calculatePayment(paymentsThisMonth);

    const paymentsThisYear = await PaymentModel.find({
      createdAt: {
        $gte: thisYear.toDate(),
        $lt: moment(thisYear).endOf("year").toDate(),
      },
    }).populate("packageId");
    const yearAmount = calculatePayment(paymentsThisYear);

    res.status(200).json({
      Users,
      liveTv,
      todayAmount,
      Transactions,
      weekAmount,
      monthAmount,
      yearAmount,
    });
  } catch (error) {
    res.send({ error: error.message });
  }
};

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
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });

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

    const userExist = await UserModel.findOne({ email: email });
    if (userExist) {
      const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET, {
        expiresIn: "365d",
      });
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
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "365d",
      });
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
    const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });

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
    const phoneToEdit = phone != "null" && phone ? { phone } : {};
    const addressToEdit = address ? { address } : {};
    const statusToEdit = status ? { status } : {};

    const expiryDateToEdit = {};
    if (expiryDate) {
      const formattedDate = new Date(expiryDate);
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
function generateRandomNumber() {
  // Generate a random number between 100000 and 999999
  const randomNumber = Math.floor(Math.random() * 900000) + 100000;
  return randomNumber;
}
const sendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email: email });
    // const email = user.email;
    if (user) {
      let verificationCode = generateRandomNumber();
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
    } else {
      res.status(400).json({ message: "user not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
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
    const {
      params: { skip },
      query: { searchString },
    } = req;
    let user;
    if (searchString) {
      user = await UserModel.find({
        usertype: "user",
        $or: [
          { name: { $options: "i", $regex: searchString } },
          { email: { $options: "i", $regex: searchString } },
        ],
      })
        .skip(skip)
        .limit(20)
        .lean();
    } else {
      user = await UserModel.find({
        usertype: "user",
      })
        .skip(skip)
        .limit(20)
        .lean();
    }

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
    res.status(200).json({ data: user });
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
    const user = await UserModel.find({ usertype: "admin" });
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
      usertype: adminType,
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
const getStats = async (req, res) => {
  try {
  } catch (error) {}
};

const getDetails = async (req, res) => {
  try {
    const {
      user: { _id },
    } = req;
    const user = await UserModel.findOne({ _id }).lean();
    delete user["password"];
    res.send({ user });
  } catch (error) {
    res.send({ error: error.message });
  }
};

const getUserDetail = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    const user = await UserModel.findOne({ _id: id }).lean();
    const payments = await PaymentModel.find({ userId: id })
      .sort({ createdAt: -1 })
      .populate("packageId")
      .lean();
    res.send({
      message: "Data fetched!",
      data: {
        user,
        payments,
      },
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
  getSpecificUser,
  deleteUser,
  getSubAdmins,
  addSubAdmin,
  editSubAdmin,
  getPaymentsByDateRange,
  getDetails,
  getUserDetail,
};
