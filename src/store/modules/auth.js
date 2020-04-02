import router from '@/router/index';
import {
	login,
	register,
	setToken,
	getToken,
	updatePassword,
	requestPasswordRecoverEmail,
} from '@/service/auth';

const state = {
	message: {},
	loading: false,
};

const getters = {
	message: state => state.message,
	loading: state => state.loading,
};

const actions = {
	async login({ commit, dispatch }, loginData) {
		try {
			commit('setLoading', true);
			await login(loginData);
			await dispatch('User/fetchProfile', null, { root: true });
		} catch (e) {
			const message = {
				type: 'error',
				text: 'Usuario o contraseña incorrectos',
			};
			commit('setMessage', message);
		}
		commit('setLoading', false);
	},
	async register({ commit, dispatch }, registerData) {
		try {
			commit('setLoading', true);
			await register(registerData);
			await dispatch('User/fetchProfile', null, { root: true });
		} catch (error) {
			const message = { type: 'error', text: error.message };
			commit('setMessage', message);
		}
		commit('setLoading', false);
	},
	async updatePassword({ commit }, recoverData) {
		commit('setLoading', true);
		try {
			const { password, token } = recoverData;
			const loginToken = getToken();
			setToken(token);
			await updatePassword(password);
			setToken(loginToken);
			commit('setLoading', false);
			const message = { type: 'success', text: 'Contraseña cambiada con exito' };
			commit('setMessage', message);
			router.push('/login');
		} catch (e) {
			const message = { type: 'error', text: 'Expiro el tiempo para cambiar la contraseña' };
			commit('setMessage', message);
			commit('setLoading', false);
		}
	},
	async requestPasswordRecoverEmail({ commit }, email) {
		commit('setLoading', true);
		try {
			await requestPasswordRecoverEmail({ email });
			const message = { type: 'success', text: 'Correo de recuperación enviado con exito' };
			commit('setMessage', message);
			commit('setLoading', false);
		} catch (e) {
			const message = { type: 'error', text: 'Ese correo no existe en sistema' };
			commit('setMessage', message);
			commit('setLoading', false);
		}
	},
};

const mutations = {
	setMessage: (state, message) => (state.message = message),
	setLoading: (state, change) => (state.loading = change),
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
