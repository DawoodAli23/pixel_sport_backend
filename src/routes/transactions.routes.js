const express = require("express");
const { adminMiddleware } = require("../middleware/jwt");
const { getTransaction } = require("../controller/transactions.controller");

const router = express.Router();

router.get("/", adminMiddleware, getTransaction);
module.exports = router;
