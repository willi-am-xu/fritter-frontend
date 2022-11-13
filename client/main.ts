import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { BootstrapVue} from 'bootstrap-vue'

// Import Bootstrap and BootstrapVue CSS files (order is important)


// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
