import Axios from 'axios';
import { api } from '@/config/index.js';

const state = {
	message: '',
	profile: {},
	loading: false,
};

const getters = {
	message: state => state.message,
	profile: state => state.profile,
	loading: state => state.loading,
};

const actions = {
	async fetchProfile({ commit }) {
		try {
			const response = await Axios.get(api + 'user/profile');
			const profile = response.data;
			commit('setProfile', profile);
		} catch (e) {
			const message = { type: 'error', text: 'Error de servidor' };
			commit('setMessage', message);
		}
	},
	async updateProfile({ commit }, profileData) {
		try {
			const response = await Axios.put(api + 'user/profile', profileData);
			const profile = response.data;
			commit('setProfile', profile);
		} catch (e) {
			const message = { type: 'error', text: 'Parametros invalidos' };
			commit('setMessage', message);
		}
	},
};

const mutations = {
	setProfile: (state, profile) => (state.profile = profile),
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
