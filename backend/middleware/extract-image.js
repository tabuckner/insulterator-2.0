const multer = require('multer');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
};

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type.');
    if (isValid) {
      error = null;
    }
    cb(error, 'backend/images'); // (error, Relative path)
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    const newFileName = `${name}-${Date.now()}.${ext}`;
    cb(null, `${name}-${Date.now()}.${ext}`);
  }
});

module.exports = multer({
  storage: storageConfig
}).single('image');
