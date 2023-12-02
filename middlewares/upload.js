const multer = require("multer");

const path = require("node:path");

const pathTmpDirectory = path.join(__dirname, "../", "tmp");

const storage = multer.diskStorage({
  destination: pathTmpDirectory,
  filename: (req, file, cb) => {
    req.body = { [file.fieldname]: `${file.originalname}` };
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

module.exports = upload;
