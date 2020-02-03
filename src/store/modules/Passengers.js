import { api } from '@/config/index.js';
import Axios from 'axios';

const state = {
	errorMessage: '',
	passengers: [],
};

const getters = {
	errorMessage: state => state.errorMessage,
	passengers: state => state.passengers,
};

const actions = {
	async fetchAllPassengers({ commit }) {
		try {
			const response = await Axios.get(api + '/passengers');
			commit('setPassengers', response.data.passengers);
		} catch (error) {
			commit('setPassengers', null);
			commit('setErrorMessage', 'Fetch passengers ' + error);
		}
	},
	async savePassenger({ commit }, payload) {
		try {
			// const config = { headers: { 'Content-Type': 'undefined' } };
			const config = { headers: { 'Content-Type': 'undefined' } };
			await Axios.post(`${api}/passengers/create`, payload, config);
		} catch (error) {
			commit('setErrorMessage', 'save passengers ' + error);
		}
	},
};

const mutations = {
	setPassengers(state, value) {
		state.passengers = value;
	},
	setErrorMessage(state, value) {
		state.errorMessage = value;
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
