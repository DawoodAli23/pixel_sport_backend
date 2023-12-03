const express = require("express");
const {
  register,
  login,
  update,
  loginWithGoogle,
  getAllUsers,
  createUser,
} = require("../controller/auth.controller");
const { configureMulterStorage } = require("../helper/multerConfig");
const multer = require("multer");
const router = express.Router();
const profile = multer({ storage: configureMulterStorage("profile") });
router.post("/signup", register).post("/login", login);
router.post("/updateProfile", profile.single("image"), update);
router.post("/loginWithGoogle", loginWithGoogle);
router.get("/getAllUsers", getAllUsers);
router.post("/createUser", profile.single("image"), createUser);
module.exports = router;
