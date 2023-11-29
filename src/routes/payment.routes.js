const express = require("express");
const { generateToken } = require("../controller/payment.controller");

const router = express.Router();

router.post("/", generateToken);
module.exports = router;
