const multer = require('multer');
const path = require('path');

// Configure storage (store file in memory for AI processing)
const storage = multer.memoryStorage();

// File filter to allow only image formats
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;

  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: fileFilter
});

module.exports = upload;