import { api } from '@/config/index.js';
import Axios from 'axios';

const state = {
	errorMessage: '',
	isLogged: !!localStorage.getItem('token' + ''),
};

const getters = {
	errorMessage: state => state.errorMessage,
};

const actions = {
	async login({ commit }, loginData) {
		try {
			const response = await Axios.post(api + '/auth/login', loginData);
			commit('setToken', response.data);
		} catch (e) {
			console.log(
				'va fallar si el login es incorrecto, entonces levantamos una notificacion aca'
			);
		}
	},
};

const mutations = {
	setToken(state, token) {
		localStorage.setItem('token', token);
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
