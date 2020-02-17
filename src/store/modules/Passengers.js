import { api } from '@/config/index.js';
import Axios from 'axios';

const state = {
	errorMessage: '',
	passengers: [],
	search: [],
};

const getters = {
	errorMessage: state => state.errorMessage,
	passengers: state => state.passengers,
	passengersResultSearch: state => state.search,
};

const actions = {
	async fetchAllPassengers({ commit }) {
		try {
			const response = await Axios.get(api + '/passengers');
			commit('setPassengers', response.data.passengers);
		} catch (error) {
			commit('setPassengers', null);
			commit('setErrorMessage', error.message);
		}
	},
	async savePassenger({ commit }, payload) {
		try {
			const config = { headers: { 'Content-Type': 'multipart/form-data' } };
			await Axios.post(`${api}/passengers/create`, payload, config);
		} catch (error) {
			commit('setErrorMessage', error.message);
		}
	},
	async editPassenger({ commit }, { payload, id }) {
		try {
			const config = { headers: { 'Content-Type': 'multipart/form-data' } };
			await Axios.put(`${api}/passengers/${id}`, payload, config);
		} catch (error) {
			commit('setErrorMessage', error.message);
		}
	},
	async deleteAllPassengers({ commit }) {
		try {
			await Axios.delete(`${api}/passengers/delete/all`);
		} catch (error) {
			commit('setErrorMessage', error.message);
		}
	},
	async deleteOnePassenger({ commit }, id) {
		try {
			await Axios.delete(`${api}/passengers/${id}`);
		} catch (error) {
			commit('setErrorMessage', error.message);
		}
	},
};

const mutations = {
	setPassengers(state, value) {
		state.passengers = value;
	},
	setSearchPassengers(state, value) {
		state.search = value;
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
