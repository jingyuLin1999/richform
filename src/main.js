import Vue from 'vue'
import i18n from '@/i18n'
import App from './App.vue'
import 'babel-polyfill'
import Es6Promise from 'es6-promise'
require('es6-promise').polyfill()
Es6Promise.polyfill()

Vue.config.productionTip = false
import router from './router'

new Vue({
  router,
  i18n,
  render: h => h(App),
}).$mount('#app')
