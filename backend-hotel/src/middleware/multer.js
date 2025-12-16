import path from "path";
import multer from "multer";
import fs from "fs";

// ✅ Ensure folders exist
const ensureFolderExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};   

// ✅ Image storage (for avatar/coverImage)
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join("./public/rooms");
    ensureFolderExists(uploadPath);
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});             
// ✅ File filters for security
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed!"), false);
};

// Initialize multer with storage engine and file filter
const upload = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB file size limit
}); 