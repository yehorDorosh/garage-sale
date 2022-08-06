module.exports = Object.freeze({
  IMAGE_DIR_PATH: './server/images',
  IMAGE_PREVIEW_DIR: 'preview',
  MAX_IMG_SIZE: process.env.MAX_UPLOAD_IMG_SIZE || 4000000,
  SUPPORTED_IMAGE_FORMATS: process.env.SUPPORTED_IMAGE_FORMATS?.split(',') || ['jpg', 'jpeg', 'png'],
  IMG_WIDTH: 512,
  IMG_HEIGHT: 512,
  ROOT_DIR_ARR: [__dirname, '..', '..'],
  SITE_EMAIL: process.env.SITE_EMAIL || 'egor.dorosh.v@gmail.com',
});
