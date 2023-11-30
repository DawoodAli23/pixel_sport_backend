const path = require("path");
const multer = require("multer");
function configureMulterStorage(destinationFolder) {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join("uploads", destinationFolder));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileExtension = path.extname(file.originalname); // Get the file extension
      const fileName = `${file.fieldname}-${uniqueSuffix}${fileExtension}`;
      cb(null, fileName);
    },
  });
}
module.exports = {
  configureMulterStorage,
};
