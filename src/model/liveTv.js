const mongoose = require("mongoose");

const liveTVSchema = new mongoose.Schema({
  TVName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  TVAccess: {
    type: String,
    enum: ["paid", "free"],
    default: "free",
    required: true,
  },
  TVCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  streamType: {
    type: String,
    enum: ["hls/m3u8/http", "mpeg-dash", "embedcode", "youtube"],
  },
  server1URL: {
    type: String,
    required: true,
  },
  server2URL: {
    type: String,
  },
  server3URL: {
    type: String,
  },
  TVLogo: {
    type: String,
    required: true,
  },
});
const LiveTV = mongoose.model("LiveTV", liveTVSchema);
module.exports = LiveTV;
