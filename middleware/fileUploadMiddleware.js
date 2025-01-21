// middleware/fileUploadMiddleware.js
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Emulate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure the file upload destination
const upload = multer({
  dest: path.join(__dirname, "../uploads/"),
});

export { upload };
