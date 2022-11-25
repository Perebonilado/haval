const multer = require("multer");
const path = require("path");

const uploadImage = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("Unsupported file type!"), false);
      return;
    }
    cb(null, true);
  },
});

const uploadBookDetails = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
  
    if (file.fieldname === "book") {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new Error("Unsupported file type!"), false);
        return;
      }
    } else if (file.fieldname == "book_cover") {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(new Error("Unsupported file type!"), false);
        return;
      }
    } else {
      cb(new Error("Unsupported file type!"), false);
      return;
    }
  },
});

module.exports = { uploadImage, uploadBookDetails };
