import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		themes: {
			light: {
				primary: '#00c9d0',
				secondary: '#ffb22b',
				accent: '#e91e63',
				error: '#f44336',
				warning: '#ff9800',
				info: '#c06240',
				success: '#4caf50',
			},
			dark: {
				primary: '#ffb22b',
				secondary: '#15202b',
				info: '#c06240',
			},
		},
	},
});
