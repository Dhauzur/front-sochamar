import Vue from 'vue';
import '@babel/polyfill';
import 'mutationobserver-shim';
import './plugins/bootstrap-vue';
import App from './App.vue';
import router from './router';
import store from './store';
import BootstrapVue from 'bootstrap-vue';
import Toasted from 'vue-toasted';
import Layout from '@/layout/Layout.vue';
import Default from '@/layout/Default.vue';

// dynamic layout
Vue.component('layout', Layout);
Vue.component('default', Default);

// This imports all the layout components such as <b-container>, <b-row>, <b-col>:
import { LayoutPlugin } from 'bootstrap-vue';
import { ModalPlugin } from 'bootstrap-vue';
import { CardPlugin } from 'bootstrap-vue';
import { VBScrollspyPlugin } from 'bootstrap-vue';
import { DropdownPlugin, TablePlugin } from 'bootstrap-vue';
import vuetify from './plugins/vuetify';

Vue.use(CardPlugin);
Vue.use(LayoutPlugin);
Vue.use(ModalPlugin);
Vue.use(VBScrollspyPlugin);
Vue.use(DropdownPlugin);
Vue.use(TablePlugin);
Vue.use(Toasted, {
	duration: 3000,
});

Vue.use(BootstrapVue);
Vue.config.productionTip = false;

new Vue({
	router,
	store,
	vuetify,
	render: h => h(App),
}).$mount('#app');
