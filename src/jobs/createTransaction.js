const mongoPlan = require("../json/test.paymentpackages.json");
const mongoUser = require("../json/test.users.json");
const pixelPlan = require("../json/subscription_plan.json");
const transactionPixel = require("../json/transaction.json");
var fs = require("fs");
function convertTimestampToDate(timestampInSeconds) {
  const timestampInMillis = timestampInSeconds * 1000; // Convert seconds to milliseconds
  const date = new Date(timestampInMillis);
  console.log(date);

  return date;
}
const populatePayments = () => {
  try {
    let userArray = [];
    let planArray = [];
    let payments = [];
    transactionPixel.map((item) => {
      let email = item.email;
      let index = mongoUser.findIndex((user) => {
        return user.email === email;
      });
      if (index != -1) {
        let userIndex = userArray.findIndex((user) => {
          return user.email === email;
        });
        if (userIndex == -1) {
          userArray.push(mongoUser[index]);
        }
      }
    });
    transactionPixel.map((item) => {
      let email = item.email;
      let planId = item.plan_id;
      let pixelPlanIndex = pixelPlan.findIndex((plan) => {
        return plan.id == planId;
      });
      if (pixelPlanIndex != -1) {
        let planName = pixelPlan[pixelPlanIndex].plan_name;
        let planIndex = mongoPlan.findIndex((plan) => {
          return plan.name == planName;
        });
        let userIndex = userArray.findIndex((user) => {
          return user.email == email;
        });
        // console.log("planName" + planName, planIndex, userIndex);
        if (userIndex != -1 && planIndex != -1) {
          payments.push({
            userId: userArray[userIndex]._id,
            packageId: mongoPlan[planIndex]._id,
            createdAt: convertTimestampToDate(item.date),
          });
        }
      }
    });
    let data = JSON.stringify(payments);
    fs.writeFile("myjsonfile.json", data, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log("File written successfully.");
      }
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  populatePayments,
};
