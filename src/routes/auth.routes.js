const express = require("express");
const { register, login, update } = require("../controller/auth.controller");
const { configureMulterStorage } = require("../helper/multerConfig");
const multer = require("multer");
const router = express.Router();
const profile = multer({ storage: configureMulterStorage("profile") });
router.post("/signup", register).post("/login", login);
router.post("/updateProfile", profile.single("image"), update);
module.exports = router;
