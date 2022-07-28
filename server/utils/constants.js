module.exports = Object.freeze({
  IMAGE_DIR_PATH: './server/images',
  IMAGE_PREVIEW_DIR: 'preview',
  MAX_IMG_SIZE: process.env.MAX_UPLOAD_IMG_SIZE || 4000000,
  IMG_WIDTH: 512,
  IMG_HEIGHT: 512,
  ROOT_DIR_ARR: [__dirname, '..', '..'],
});
