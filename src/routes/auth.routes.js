const express = require("express");
const {
  register,
  login,
  update,
  loginWithGoogle,
  getAllUsers,
  createUser,
  getSpecificUser,
  deleteUser,
  getSubAdmins,
  addSubAdmin,
  editSubAdmin,
  sendVerificationCode,
  codeverification,
  getPaymentsByDateRange,
  getDetails,
  getUserDetail,
  verifyEmail,
} = require("../controller/auth.controller");
const { userMiddleware, adminMiddleware } = require("../middleware/jwt");

const { configureMulterStorage } = require("../helper/multerConfig");
const multer = require("multer");
const router = express.Router();
const profile = multer({ storage: configureMulterStorage("profile") });
const { sendMail } = require("../jobs/sendExpiredMails");
router.post("/signup", register).post("/login", login);
router.post("/updateProfile", profile.single("image"), update);
router.post("/get", userMiddleware, getDetails);
router.post("/loginWithGoogle", loginWithGoogle);
router.get("/getAllUsers/:skip", userMiddleware, adminMiddleware, getAllUsers);
router.post("/createUser", profile.single("image"), createUser);
router.get("/getSpecificUser/:userId", getSpecificUser);
router.delete("/deleteUser/:userId", deleteUser);
router.get("/getSubAdmins", getSubAdmins);
router.post("/addSubAdmin", profile.single("image"), addSubAdmin);
router.post("/editSubAdmin", profile.single("image"), editSubAdmin);
router.post("/sendVerificationCode", sendVerificationCode);
router.post("/codeverification", codeverification);
router.get(
  "/getPaymentsByDateRange",
  userMiddleware,
  adminMiddleware,
  getPaymentsByDateRange
);
router.get("/test", sendMail);
router.get("/getuserdetails/:id", userMiddleware, getUserDetail);
router.post("/verifyEmail", verifyEmail);
module.exports = router;
