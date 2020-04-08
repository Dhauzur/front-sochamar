import fetch from '@/service/fetch';

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
			const profile = await fetch('/user/profile');
			commit('setProfile', profile);
			return profile;
		} catch (e) {
			const message = { type: 'error', text: 'Error de servidor' };
			commit('setMessage', message);
		}
	},
	async updateProfile({ commit }, data) {
		commit('setLoading', true);
		delete data.analyst;
		delete data.img;
		delete data._id;
		try {
			const profile = await fetch('/user/profile', { method: 'put', data });
			commit('setProfile', profile);
			const message = { type: 'success', text: 'Perfil modificado con exito' };
			commit('setMessage', message);
		} catch (error) {
			const message = { type: 'error', text: error.message };
			commit('setMessage', message);
		}
		commit('setLoading', false);
	},
	async updateAvatar({ commit }, avatar) {
		try {
			const response = await fetch('/user/avatar', { method: 'patch', data: avatar });
			commit('setAvatar', response.img);
			const message = { type: 'success', text: 'Avatar actualizado con exito' };
			commit('setMessage', message);
		} catch (error) {
			const message = { type: 'error', text: error.message };
			commit('setMessage', message);
		}
	},
	async updatePassword({ commit }, password) {
		commit('setLoading', true);
		try {
			await fetch('/user/password', { method: 'patch', data: { password } });
			const message = { type: 'success', text: 'Contraseña actualizada con exito' };
			commit('setMessage', message);
		} catch (e) {
			const message = { type: 'error', text: 'No puede ser la misma contraseña' };
			commit('setMessage', message);
		}
		commit('setLoading', false);
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
