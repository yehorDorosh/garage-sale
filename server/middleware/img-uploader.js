const fs = require('fs');

const { v4: uuid } = require('uuid');
const multer = require('multer');

const constants = require('../utils/constants.js');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(`${constants.IMAGE_DIR_PATH}/${req.userId}`, { recursive: true });
    cb(null, `${constants.IMAGE_DIR_PATH}/${req.userId}`);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuid()}-${file.originalname}`);
  }
});

const fileFilterSetup = (req, file, cb) => {
  const imagesData = JSON.parse(req.body.imagesData);
  const nameMatches = imagesData.filter(img => img.name === file.originalname);
  const fileSize = parseInt(req.headers['content-length']);

  if (nameMatches.length > 1) {
    const error = new Error('Detected image files with same name.');
    error.data = file.originalname;
    error.statusCode = 422;
    cb(error, false);
    return;
  }

  if (fileSize > constants.MAX_IMG_SIZE) {
    const error = new Error('File too large');
    error.data = fileSize;
    error.statusCode = 422;
    cb(error, false);
    return;
  }

  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const imgUploader = multer({
  storage: fileStorage,
  fileFilter: fileFilterSetup,
  limits: { fileSize: constants.MAX_IMG_SIZE }
}).array('images', 10);

module.exports = imgUploader;
