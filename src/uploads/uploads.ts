import multer, { memoryStorage } from "multer";
import apiError from "../utils/api/apiError";

const upload = multer({
    storage: memoryStorage(),
    limits: { fileSize: 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == "image/png" || file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(
          new apiError(400, "Only .png, .jpg and .jpeg formats are allowed"),
        );
      }
    },
  });
  export default upload;