const Slider = require("../model/slider");
const createSlider = async (req, res) => {
  try {
    const { title, liveTV, status } = req.body;
    if (req.file) {
      const slider = await Slider.create({
        title,
        liveTV,
        status,
        image: req.file.path,
      });
      res.status(200).json({ data: slider });
    } else {
      res.status(400).json({ message: "please provide image" });
    }
  } catch (error) {
    res.send({ error: error.message });
  }
};
const getSliders = async (req, res) => {
  try {
    const slider = await Slider.find();
    res.status(200).json({ data: slider });
  } catch (error) {
    res.send({ error: error.message });
  }
};
const editSlider = async (req, res) => {
  try {
    const { id, title, liveTV, status } = req.body;
    const filePath = req.file.path;
    const titleToEdit = title ? { title } : {};
    const liveTVtoEdit = liveTV ? { liveTV } : {};
    const statusToEdit = status ? { status } : {};
    const filePathToEdit = filePath ? { filePath } : {};
    const existingSlider = await Slider.updateOne(
      { _id: id },
      {
        $set: {
          ...titleToEdit,
          ...liveTVtoEdit,
          ...statusToEdit,
          ...filePathToEdit,
        },
      }
    );
    res.status(200).json({
      data: existingSlider,
      message: "done",
    });
  } catch (error) {
    res.send({ error: error.message });
  }
};
const getSpecificSlider = async (req, res) => {
  try {
    const { sliderId } = req.params;
    const slider = await Slider.findById(sliderId);
    res.status(200).json({ data: slider });
  } catch (error) {
    res.send({ error: error.message });
  }
};
const deleteSlider = async (req, res) => {
  try {
    const { sliderId } = req.params;
    const slider = await Slider.deleteOne({ _id: sliderId });
    res.status(200).json({ data: slider });
  } catch (error) {
    res.send({ error: error.message });
  }
};
module.exports = {
  createSlider,
  getSliders,
  editSlider,
  getSpecificSlider,
  deleteSlider,
};
