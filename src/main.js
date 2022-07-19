import Vue from 'vue'
import App from './App.vue'
import vuetify from './vuetify'
import messageBox from '@/components/message-box'
Vue.use(messageBox, {
  vuetify
})
Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
