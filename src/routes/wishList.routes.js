const express = require("express");
const {
  createWishList,
  getwishListByUserID,
} = require("../controller/wishListController");
const router = express.Router();
router.post("/createWishList", createWishList);
router.get("/getAllWishListById", getwishListByUserID);
module.exports = router;
