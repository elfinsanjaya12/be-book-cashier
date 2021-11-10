const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'public/uploads',
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 3000000,
  },
});

module.exports = uploadMiddleware;
