const express = require("express");
const cron = require("node-cron");
const path = require("path");
const app = express();
require("dotenv").config();
require("./src/config/connection")();
const cors = require("cors");
const createChannels = require("./src/jobs/createChannels");
app.use(express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(express.json());
app.use(require("./src/routes"));
app.listen(process.env.PORT, () => {
  console.log(`Server is running at PORT ${process.env.PORT}`);
});

cron.schedule("0 0 * * *", () => {
  createChannels();
});
