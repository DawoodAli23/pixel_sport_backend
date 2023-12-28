const express = require("express");

const createChannels = require("../jobs/createChannels");
const router = express.Router();
router.post("/", (req, res) => {
  createChannels();
  res.send("CRON IS RUNNING");
});

module.exports = router;
