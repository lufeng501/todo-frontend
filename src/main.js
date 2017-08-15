// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'
import router from './router'

import Mint from 'mint-ui';

import './assets/css/layout.css';

import 'mint-ui/lib/style.css';

import './plugins/font-awesome/css/font-awesome.css';

Vue.config.productionTip = false

Vue.use(Mint);

Vue.use(VueResource)

// Vue.use(iView)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
