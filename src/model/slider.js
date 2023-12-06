const mongoose = require("mongoose");
const sliderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
  liveTV: {
    type: mongoose.Types.ObjectId,
    ref: "LiveTV",
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
});
const Slider = mongoose.model("Slider", sliderSchema);
module.exports = Slider;
