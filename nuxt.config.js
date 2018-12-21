const pkg = require('./package')
require('dotenv').config()

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: 'E-Channel EOSのエアドロ質問箱',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '質問、回答をするだけでEOSトークンが手に入る質問箱サービス' },
      { hid: 'author', name: 'author', content: pkg.auther },
      { hid: 'twitter:card', name: 'desctwitter:cardription', content: "summary" },
      { hid: 'twitter:title"', name: 'twitter:title"', content: 'EOSのエアドロ質問箱' },
      { hid: 'twitter:description', name: 'twitter:description', content: '質問、回答をするだけでEOSトークンが手に入る質問箱サービス' },
      { hid: 'twitter:image', name: 'twitter:image', content: 'https://raw.githubusercontent.com/block-base/e-channel/master/assets/img/screen.png' }
    ],
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js' },
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.5/marked.js' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#2196F3', height: '3px' },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/style/app.styl',
    '~/assets/style/main.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vuetify',
    { src: '@/plugins/init', ssr: false }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    ['@nuxtjs/google-analytics', {
      id: 'UA-130401695-3'
    }],
    '@nuxtjs/dotenv'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      
    }
  },
  vue: {
    config: {
    //  productionTip: true,
     devtools: true,
    }
  },

}


