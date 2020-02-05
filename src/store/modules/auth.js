import { api } from '@/config/index.js';
import Axios from 'axios';

const state = {
	message: '',
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
			this.$toasted.show('Ingreso exitoso, ya puedes usar la app :)');
		} catch (e) {
			/*AÑADIR TOAST DESPUES DE QUE SE APRUEBE EL PR*/
			this.$toasted.show('Usuario o contraseñas Incorrectos');
			console.log('error de axios: ' + e);
		}
	},
	async register({ commit }, registerData) {
		console.log(commit);
		console.log(registerData);
		try {
			await Axios.post(api + '/auth/register', registerData);
		} catch (e) {
			console.log(e);
		}
	},
};

const mutations = {
	setToken: (state, token) => {
		localStorage.setItem('token', token);
		Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	},
	logout: state => {
		/*AQUI TIENE QUE IR LA REQUEST A AUTH/LOGOUT*/
		localStorage.removeItem('token');
		delete Axios.defaults.headers.common['Authorization'];
		state.isLogged = false;
	},
	setUser: (state, user) => (state.user = user),
	setIsLogged: (state, change) => (state.isLogged = change),
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
