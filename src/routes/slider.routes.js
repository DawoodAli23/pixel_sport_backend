const express = require("express");
const multer = require("multer");
const { configureMulterStorage } = require("../helper/multerConfig");
const {
  createSlider,
  editSlider,
  getSliders,
  getSpecificSlider,
  deleteSlider,
} = require("../controller/slider.controller");
const slider = multer({ storage: configureMulterStorage("slider") });
const router = express.Router();
router.post("/createSlider", slider.single("image", createSlider));
router.post("/editSlider", slider.single("image", editSlider));
router.get("/getSliders", getSliders);
router.get("/getSpecificSlider/:sliderId", getSpecificSlider);
router.delete("/deleteSlider/:sliderId", deleteSlider);
module.exports = router;
