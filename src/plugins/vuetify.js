import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		themes: {
			light: {
				primary: '#6A31FF',
				secondary: '#7D4AFF',
				accent: '#FF2E80',
			},
			dark: {
				primary: '#6A31FF',
				secondary: '#7D4AFF',
				accent: '#FF2E80',
			},
		},
	},
});
