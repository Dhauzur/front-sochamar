import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		themes: {
			light: {
				primary: '#0c09c4',
				secondary: '#ffffff',
				accent: '#6a31ff',
				error: '#f44336',
				warning: '#ff9800',
				info: '#c06240',
				success: '#4caf50',
				textColor: '#000000',
				textColorInv: '#FFFFFF',
			},
			dark: {
				primary: '#ffb22b',
				secondary: '#121212',
				accent: '#ff2e80',
				error: '#f44336',
				warning: '#ff9800',
				info: '#c06240',
				success: '#4caf50',
				textColor: '#FFFFFF',
				textColorInv: '#000000',
			},
		},
	},
});
