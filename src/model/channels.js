const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  date: {
    type: Date,
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LiveTV",
  },
  data: {
    type: Object,
  },
});

const channel = mongoose.model("Channel", channelSchema);

module.exports = channel;
