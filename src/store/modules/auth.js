import { api } from '@/config/index.js';
import Axios from 'axios';
import router from '@/router/index.js';

const state = {
	message: {},
	isLogged: false,
	user: {},
};

const getters = {
	message: state => state.message,
	isLogged: state => state.isLogged,
	user: state => state.user,
};

const actions = {
	async login({ commit }, loginData) {
		try {
			const response = await Axios.post(api + '/auth/login', loginData);
			/*AÑADIR TOAST DESPUES DE QUE SE APRUEBE EL PR*/
			const { token, user } = response.data;
			commit('setUser', user);
			commit('setToken', token);
			commit('setIsLogged', true);
			router.push('/');
		} catch (e) {
			const message = {
				type: 'error',
				text: 'Usuario o contraseña incorrectos',
			};
			commit('setMessage', message);
		}
	},
	async register({ commit }, registerData) {
		try {
			await Axios.post(api + '/auth/register', registerData);
			router.push('/login');
		} catch (e) {
			const message = { type: 'error', text: 'El correo ya existe' };
			commit('setMessage', message);
		}
	},
};

const mutations = {
	setToken: (state, token) => {
		localStorage.setItem('token', token);
		Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	},
	logout: state => {
		localStorage.removeItem('token');
		delete Axios.defaults.headers.common['Authorization'];
		state.isLogged = false;
		router.push('/login');
	},
	setUser: (state, user) => (state.user = user),
	setIsLogged: (state, change) => (state.isLogged = change),
	setMessage: (state, message) => (state.message = message),
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
