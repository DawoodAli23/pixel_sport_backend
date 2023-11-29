const express = require("express");
const app = express();
require("dotenv").config();
require("./src/config/connection")();
const routes = require("./src/routes");
app.use(express.json());
app.use(require("./src/routes"));
app.listen(process.env.PORT, () => {
  console.log(`Server is running at PORT ${process.env.PORT}`);
});
