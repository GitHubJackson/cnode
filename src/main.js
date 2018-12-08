import Vue from 'vue';
import FastClick from 'fastclick';
import router from './router';
import App from './App';
import store from './store';
import request from './Ajax';

Vue.prototype.$http = request;

FastClick.attach(document.body);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
