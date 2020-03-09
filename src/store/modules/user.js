import axios from 'axios';
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
			const response = await axios.get(api + '/user/profile');
			const profile = response.data;
			commit('setProfile', profile);
		} catch (e) {
			const message = { type: 'error', text: 'Error de servidor' };
			commit('setMessage', message);
		}
	},
	async updateProfile({ commit }, profileData) {
		commit('setLoading', true);
		try {
			const response = await axios.put(api + '/user/profile', profileData);
			const profile = response.data;
			commit('setProfile', profile);
			const message = { type: 'success', text: 'Perfil modificado con exito' };
			commit('setMessage', message);
			commit('setLoading', false);
		} catch (e) {
			const message = { type: 'error', text: 'Parametros invalidos' };
			commit('setMessage', message);
			commit('setLoading', false);
		}
	},
	async updateAvatar({ commit }, avatar) {
		commit('setLoading', true);
		const config = { headers: { 'Content-Type': 'multipart/form-data' } };
		try {
			const response = await axios.patch(api + '/user/avatar', avatar, config);
			const { img } = response.data;
			commit('setAvatar', img);
			const message = { type: 'success', text: 'Avatar actualizado con exito' };
			commit('setMessage', message);
			commit('setLoading', false);
		} catch (e) {
			const message = { type: 'error', text: 'Imagen invalida' };
			commit('setMessage', message);
			commit('setLoading', false);
		}
	},
	async updatePassword({ commit }, password) {
		commit('setLoading', true);
		try {
			await axios.patch(api + '/user/password', { password });
			const message = { type: 'success', text: 'Contraseña actualizada con exito' };
			commit('setMessage', message);
			commit('setLoading', false);
		} catch (e) {
			const message = { type: 'error', text: 'No puede ser la misma contraseña' };
			commit('setMessage', message);
			commit('setLoading', false);
		}
	},
};

const mutations = {
	setProfile: (state, profile) => (state.profile = profile),
	setMessage: (state, message) => (state.message = message),
	setLoading: (state, loading) => (state.loading = loading),
	setAvatar: (state, avatar) => (state.profile.img = avatar),
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
