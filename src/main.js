import Vue from 'vue';
import '@babel/polyfill';
import 'mutationobserver-shim';
import App from './App.vue';
import router from './router';
import store from './store';
import Toasted from 'vue-toasted';
import Layout from '@/layout/Layout.vue';
import Default from '@/layout/Default.vue';
import vuetify from './plugins/vuetify';

Vue.component('layout', Layout);
Vue.component('default', Default);

Vue.use(Toasted, {
	duration: 3000,
});

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	vuetify,
	render: h => h(App),
}).$mount('#app');
