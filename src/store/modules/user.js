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
			const response = await Axios.get(api + '/user/profile');
			const profile = response.data;
			commit('setProfile', profile);
		} catch (e) {
			const message = { type: 'error', text: 'Error de servidor' };
			commit('setMessage', message);
		}
	},
	async updateProfile({ commit }, profileData) {
		const config = { headers: { 'Content-Type': 'multipart/form-data' } };
		try {
			const response = await Axios.put(api + '/user/profile', profileData, config);
			const profile = response.data;
			commit('setProfile', profile);
			const message = { type: 'success', text: 'Perfil modificado con exito' };
			commit('setMessage', message);
		} catch (e) {
			const message = { type: 'error', text: 'Parametros invalidos' };
			commit('setMessage', message);
		}
	},
};

const mutations = {
	setProfile: (state, profile) => (state.profile = profile),
	setMessage: (state, message) => (state.message = message),
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
