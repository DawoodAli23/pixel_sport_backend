const createChannels = require("../jobs/createChannels");
const { ChannelModel } = require("../model");
const LiveTV = require("../model/liveTv");
const createLiveTV = async (req, res) => {
  try {
    const {
      TVName,
      description,
      TVAccess,
      TVCategory,
      status,
      streamType,
      server1URL,
      server2URL,
      server3URL,
    } = req.body;
    if (
      !TVName ||
      !TVAccess ||
      !TVCategory ||
      !status ||
      !streamType ||
      !server1URL
    ) {
      return res.status(400).json({ message: "Required fields are missing." });
    }
    const newLiveTV = new LiveTV({
      TVName,
      description,
      TVAccess: TVAccess.toLowerCase(),
      TVCategory,
      status: status.toLowerCase(),
      streamType: streamType.toLowerCase(),
      server1URL,
      server2URL,
      server3URL,
      TVLogo: req.file.path,
    });
    createChannels();
    await newLiveTV.save();
    res
      .status(201)
      .json({ message: "LiveTV created successfully", liveTV: newLiveTV });
  } catch (error) {
    console.error("Error creating LiveTV:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updateLiveTV = async (req, res) => {
  try {
    const {
      TVName,
      description,
      TVAccess,
      TVCategory,
      status,
      streamType,
      server1URL,
      server2URL,
      server3URL,
      liveTVId,
    } = req.body;
    const filePath = req?.file?.path;
    const nameToEdit = TVName ? { TVName } : {};
    const statustoEdit = status ? { status } : {};
    const descriptionToEdit = description ? { description } : {};
    const tVAccessToEdit = TVAccess ? { TVAccess } : {};
    const tVCategoryToEdit = TVCategory ? { TVCategory } : {};
    const streamTypeToEdit = streamType ? { streamType } : {};
    const server1URLToEdit = server1URL ? { server1URL } : {};
    const server2URLToEdit = server2URL ? { server2URL } : {};
    const server3URLToEdit = server3URL ? { server3URL } : {};
    const filePathToEdit = filePath ? { filePath } : {};
    const existingLiveTV = await LiveTV.updateOne(
      { _id: liveTVId },
      {
        $set: {
          ...nameToEdit,
          ...descriptionToEdit,
          ...tVAccessToEdit,
          ...tVCategoryToEdit,
          ...statustoEdit,
          ...streamTypeToEdit,
          ...server1URLToEdit,
          ...server2URLToEdit,
          ...server3URLToEdit,
          ...filePathToEdit,
        },
      }
    );
    // const existingLiveTV = await LiveTV.findById(liveTVId);
    // if (!existingLiveTV) {
    //   return res.status(404).json({ message: "LiveTV not found." });
    // }
    // existingLiveTV.TVName = TVName;
    // existingLiveTV.description = description;
    // existingLiveTV.TVAccess = TVAccess.toLowerCase();
    // existingLiveTV.TVCategory = TVCategory;
    // existingLiveTV.status = status.toLowerCase();
    // existingLiveTV.streamType = streamType.toLowerCase();
    // existingLiveTV.server1URL = server1URL;
    // existingLiveTV.server2URL = server2URL;
    // existingLiveTV.server3URL = server3URL;
    // existingLiveTV.TVLogo = req.file.path;
    // await existingLiveTV.save();
    res.json({
      message: "LiveTV updated successfully",
      liveTV: existingLiveTV,
    });
  } catch (error) {
    console.error("Error updating LiveTV:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const deleteLiveTV = async (req, res) => {
  try {
    const { liveTVId } = req.params;
    if (!liveTVId) {
      return res.status(400).json({ message: "LiveTV ID is required." });
    }
    const result = await LiveTV.deleteOne({ _id: liveTVId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "LiveTV not found." });
    }
    res.json({ message: "LiveTV deleted successfully" });
  } catch (error) {
    console.error("Error deleting LiveTV:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getLiveTVById = async (req, res) => {
  try {
    const { liveTVId } = req.params;
    if (!liveTVId) {
      return res.status(400).json({ message: "LiveTV ID is required." });
    }
    const liveTV = await LiveTV.findById(liveTVId).populate("TVCategory");
    if (!liveTV) {
      return res.status(404).json({ message: "LiveTV not found." });
    }
    res.json({ liveTV });
  } catch (error) {
    console.error("Error fetching LiveTV by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getAllLiveTVs = async (req, res) => {
  try {
    const liveTVs = await LiveTV.find().populate("TVCategory");
    res.json({ liveTVs });
    console.log("ere");
  } catch (error) {
    console.error("Error fetching all LiveTVs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await ChannelModel.find({})
      .populate({
        path: "channel",
        populate: {
          path: "TVCategory",
        },
      })
      .lean();
    res.json({
      events,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
const getEventById = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    const events = await ChannelModel.findOne({ _id: id })
      .populate({
        path: "channel",
        populate: {
          path: "TVCategory",
        },
      })
      .lean();
    res.json({
      events,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getEventByType = async (req, res) => {
  try {
    const {
      params: { type },
    } = req;
    const events = await ChannelModel.find()
      .populate({
        path: "channel",
        populate: {
          path: "TVCategory",
        },
      })
      .lean();
    res.json({
      events: events.filter((event) => {
        return event.channel.TVCategory.name == type;
      }),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    const events = await ChannelModel.deleteOne({ _id: id });

    res.json({
      message: "Event Deleted",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const editEvent = async (req, res) => {
  try {
    const {
      params: { id },
      body: { liveTv },
    } = req;
    await ChannelModel.findOneAndUpdate({ _id: id }, { channel: liveTv });

    res.json({
      message: "Event Updated",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
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
};
