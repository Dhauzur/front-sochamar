import { api } from '@/config/index.js';
import Axios from 'axios';
import router from '@/router/index.js';

const state = {
	message: {},
	token: localStorage.getItem('token') || '',
	loading: false,
};

const getters = {
	message: state => state.message,
	isLogged: state => {
		return state.token ? true : false;
	},
	loading: state => state.loading,
};
console.log('api');
console.log(api);
const actions = {
	async login({ commit, dispatch }, loginData) {
		try {
			commit('setLoading', true);
			const response = await Axios.post(api + '/auth/login', loginData);
			const { token } = response.data;
			commit('setToken', token);
			commit('setIsLogged', true);
			dispatch('User/fetchProfile', null, { root: true });
			router.push('/lodgings');
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
			const response = await Axios.post(api + '/auth/register', registerData);
			const { token } = response.data;
			commit('setToken', token);
			commit('setIsLogged', true);
			dispatch('User/fetchProfile', null, { root: true });
			router.push('/lodgings');
		} catch (e) {
			const message = { type: 'error', text: 'El correo ya existe' };
			commit('setMessage', message);
		}
		commit('setLoading', false);
	},
	async updatePassword({ commit }, recoverData) {
		commit('setLoading', true);
		try {
			const { password, token } = recoverData;
			Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			await Axios.put(api + '/auth/user/password', { password });
			Axios.defaults.headers.common['Authorization'] = '';
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
			await Axios.post(api + '/auth/send/passwordRecover', { email });
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
	setToken: (state, token) => {
		localStorage.setItem('token', token);
		Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
		state.token = token;
	},
	logout: state => {
		localStorage.removeItem('token');
		delete Axios.defaults.headers.common['Authorization'];
		state.token = '';
		router.push('/login');
	},
	setIsLogged: (state, change) => (state.isLogged = change),
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
