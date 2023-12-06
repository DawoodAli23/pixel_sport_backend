const WishList = require("../model/wishList");

const createWishList = async (req, res) => {
  try {
    const id = req.user._id;
    const { eventId } = req.body;
    const wishList = await WishList.create({
      userId: id,
      eventId: eventId,
    });
    res.status(200).json({ data: wishList });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
const getwishListByUserID = async (req, res) => {
  try {
    const id = req.user._id;
    const wishlist = await WishList.find({ userId: id }).populate({
      path: "eventId",
      populate: {
        path: "channel",
        populate: {
          path: "TVCategory",
        },
      },
    });
    console.log(wishlist);
    res.status(200).json({ data: wishlist });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  createWishList,
  getwishListByUserID,
};
