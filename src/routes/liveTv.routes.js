const express = require("express");
const multer = require("multer");
const { configureMulterStorage } = require("../helper/multerConfig");
const {
  createLiveTV,
  updateLiveTV,
  deleteLiveTV,
  getLiveTVById,
  getAllLiveTVs,
  getEvents,
  getEventById,
  getEventByType,
  deleteEvent,
  editEvent,
} = require("../controller/liveTV.controller");
const { adminMiddleware, userMiddleware } = require("../middleware/jwt");
const tvlogo = multer({ storage: configureMulterStorage("TVlogo") });
const router = express.Router();
router.post("/createLiveTV", tvlogo.single("logo"), createLiveTV);
router.post("/updateLiveTV", tvlogo.single("logo"), updateLiveTV);
router.delete(
  "/deleteLiveTV/:liveTVId",
  userMiddleware,
  adminMiddleware,
  deleteLiveTV
);
router.get("/getLiveTVById/:liveTVId", getLiveTVById);
router.get("/getAllLiveTVs", getAllLiveTVs);
router.get("/events", getEvents);
router.get("/events/type/:type", getEventByType);
router.get("/events/:id", getEventById);
router.delete("/event/:id", userMiddleware, adminMiddleware, deleteEvent);
router.put("/event/:id", userMiddleware, adminMiddleware, editEvent);
module.exports = router;
