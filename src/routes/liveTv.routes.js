const express = require("express");
const multer = require("multer");
const { configureMulterStorage } = require("../helper/multerConfig");
const {
  createLiveTV,
  updateLiveTV,
  deleteLiveTV,
  getLiveTVById,
  getAllLiveTVs,
} = require("../controller/liveTV.controller");
const tvlogo = multer({ storage: configureMulterStorage("TVlogo") });
const router = express.Router();
router.post("/createLiveTV", tvlogo.single("logo"), createLiveTV);
router.post("/updateLiveTV", tvlogo.single("logo"), updateLiveTV);
router.delete("/deleteLiveTV/:liveTVId", deleteLiveTV);
router.get("/getLiveTVById/:liveTVId", getLiveTVById);
router.get("/getAllLiveTVs", getAllLiveTVs);
module.exports = router;
