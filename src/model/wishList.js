const mongoose = require("mongoose");
const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  eventId: { type: mongoose.Types.ObjectId, ref: "Channel", required: true },
});
const WishList = mongoose.model("WishList", wishlistSchema);
module.exports = WishList;
