const express = require("express");
const cron = require("node-cron");
const app = express();
require("dotenv").config();
require("./src/config/connection")();
const routes = require("./src/routes");
const { verifyPayments } = require("./src/jobs/verifyPayment");
app.use(express.json());
app.use(require("./src/routes"));
app.listen(process.env.PORT, () => {
  console.log(`Server is running at PORT ${process.env.PORT}`);
});

//jobs

// cron.schedule("1 * * * * *", () => {
//   verifyPayments();
// });
