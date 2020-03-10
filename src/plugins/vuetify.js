import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		dark: true,
		primary: '#1209c6',
		accent: '#e91e63',
		error: '#f44336',
		warning: '#ff9800',
		info: '#03a9f4',
		success: '#8bc34a',
	},
});
