const fs = require('fs');

const { v4: uuid } = require('uuid');
const multer = require('multer');

const constants = require('../utils/constants.js');

let customErr;

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

  if (nameMatches.length > 1) {
    customErr = new Error('Detected image files with same name.');
    customErr.data = [{ value: file.originalname, msg: 'Detected image files with same name.', param: 'images', location: 'body' }];
    customErr.statusCode = 422;
    cb(null, false);
  }

  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    customErr = new Error('Invalid image format. Support only jpg and png.');
    customErr.data = [{ value: file.originalname, msg: 'Invalid image format. Support only jpg and png.', param: 'images', location: 'body' }];
    customErr.statusCode = 422;
    cb(null, false);
  }
};

const imgUploader = (req, res, next) => {
  const upload = multer({
    storage: fileStorage,
    fileFilter: fileFilterSetup,
    limits: { fileSize: constants.MAX_IMG_SIZE }
  }).array('images', 10);

  upload(req, res, function(error) {
    if (error) {
      const fileSize = parseInt(req.headers['content-length']);
      if (error.code === 'LIMIT_FILE_SIZE') {
        error.data = [{ value: fileSize, msg: 'File too large', param: 'images', location: 'body' }];
        error.statusCode = 422;
      }
      next(error);
    } else if (customErr) { 
      next(customErr);
      customErr = null;
    } else {
      next();
    }
  });
};

module.exports = imgUploader;
