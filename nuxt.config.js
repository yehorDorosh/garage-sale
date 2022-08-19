export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Garage sale',
    htmlAttrs: {
      lang: 'en',
      prefix: 'og: https://ogp.me/ns#',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Garage sale. Sale and buy.' },
      { name: 'format-detection', content: 'telephone=no' },
      { property: 'og:title', content: 'Garage sale' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: `${process.env.FULL_HOST_NAME}/opengraph.jpeg` },
      { property: 'og:url', content: `${process.env.FULL_HOST_NAME}` },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap' },
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/main.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~plugins/core-components.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map';
      }
    }
  },

  serverMiddleware: [
    // '~/server'
  ],

  router: {
    middleware: 'check-auth'
  },

  env: {
    fullHostName: process.env.FULL_HOST_NAME || 'http://localhost:3000',
    maxUploadImgSize: process.env.MAX_UPLOAD_IMG_SIZE || 4000000,
    supportedImageFormats: process.env.SUPPORTED_IMAGE_FORMATS?.split(',') || 'jpg,jpeg,png',
    siteEmail: process.env.SITE_EMAIL,
    siteFBEmail: process.env.SITE_FB_EMAIL,
  },

  telemetry: false,
};
