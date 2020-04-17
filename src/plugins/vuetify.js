import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		themes: {
			light: {
				primary: '#0C09C4',
				secondary: '#FFFFFF',
				accent: '#6A31FF',
				error: '#F44336',
				warning: '#FF9800',
				info: '#C06240',
				success: '#4CAF50',
				textColor: '#000000',
				textColorInv: '#FFFFFF',
			},
			dark: {
				primary: '#FF2E80',
				secondary: '#121212',
				accent: '#7986CB',
				error: '#f44336',
				warning: '#ff9800',
				info: '#c06240',
				success: '#4CAF50',
				textColor: '#FFFFFF',
				textColorInv: '#000000',
			},
		},
	},
});
