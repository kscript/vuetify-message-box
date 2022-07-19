import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'

import zhHans from 'vuetify/lib/locale/zh-Hans'
import en from 'vuetify/lib/locale/en'
Vue.use(Vuetify)

const opts = {
  icons: {
    iconfont: 'mdi'
  },
  lang: {
    current: 'zhHans',
    locales: {
      zhHans, en
    }
  }
}

export default new Vuetify(opts)
