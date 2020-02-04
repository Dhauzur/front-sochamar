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
			console.log(response.data);
			commit('setPassengers', response.data.passengers);
		} catch (error) {
			commit('setPassengers', null);
			commit('setErrorMessage', 'Fetch passengers ' + error);
		}
	},
	async savePassenger({ commit }, payload) {
		try {
			const config = { headers: { 'Content-Type': 'multipart/form-data' } };
			await Axios.post(`${api}/passengers/create`, payload, config);
		} catch (error) {
			commit('setErrorMessage', 'save passengers ' + error);
		}
	},
	async editPassenger({ commit }, { payload, id }) {
		try {
			const config = { headers: { 'Content-Type': 'multipart/form-data' } };
			await Axios.put(`${api}/passengers/${id}`, payload, config);
		} catch (error) {
			commit('setErrorMessage', 'save passengers ' + error);
		}
	},
	async deleteAllPassengers({ commit }) {
		try {
			const config = { headers: { 'Content-Type': 'multipart/form-data' } };
			await Axios.delete(`${api}/passengers/delete/all`, config);
		} catch (error) {
			commit('setErrorMessage', 'delete passengers ' + error);
		}
	},
	async deleteOnePassenger({ commit }, id) {
		try {
			const config = { headers: { 'Content-Type': 'multipart/form-data' } };
			await Axios.delete(`${api}/passengers/${id}`, config);
		} catch (error) {
			commit('setErrorMessage', 'delete passengers ' + error);
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
