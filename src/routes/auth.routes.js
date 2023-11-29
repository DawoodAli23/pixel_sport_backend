const express = require("express");
const { register, login } = require("../controller/auth.controller");
const router = express.Router();

router.post("/signup", register).post("/login", login);
module.exports = router;
