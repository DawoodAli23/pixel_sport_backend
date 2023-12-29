const express = require("express");
const cron = require("node-cron");
const path = require("path");
const app = express();
require("dotenv").config();
require("./src/config/connection")();
const cors = require("cors");
const createChannels = require("./src/jobs/createChannels");
// const { populatePayments } = require("./src/jobs/createTransaction");
const { sendMail } = require("./src/jobs/sendExpiredMails");
app.use("/backend", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(express.json());
app.use(require("./src/routes"));
app.listen(process.env.PORT, () => {
  console.log(`Server is running at PORT ${process.env.PORT}`);
});
process.env.TZ = "GMT";

cron.schedule(
  "0 14 * * *",
  () => {
    createChannels();
  },
  {
    timezone: "Asia/Karachi",
  }
);
cron.schedule(
  "0 14 * * *",
  () => {
    sendMail();
  },
  {
    timezone: "Asia/Karachi",
  }
);
// populatePayments();
