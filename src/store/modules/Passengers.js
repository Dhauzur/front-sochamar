import { api } from '@/config/index.js';
import Axios from 'axios';

const state = {
	message: '',
	passengers: [],
	search: [],
};

const getters = {
	message: state => state.message,
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
			commit('setMessage', {
				type: 'error',
				text: error.message,
			});
		}
	},
	async savePassenger({ commit }, payload) {
		try {
			const config = { headers: { 'Content-Type': 'multipart/form-data' } };
			await Axios.post(`${api}/passengers/create`, payload, config);
			commit('setMessage', {
				type: 'success',
				text: 'Guardado exitosamente',
			});
		} catch (error) {
			commit('setMessage', {
				type: 'error',
				text: error.message,
			});
		}
	},
	async editPassenger({ commit }, { payload, id }) {
		try {
			const config = { headers: { 'Content-Type': 'multipart/form-data' } };
			await Axios.put(`${api}/passengers/${id}`, payload, config);
			commit('setMessage', {
				type: 'success',
				text: 'Actualizado exitosamente',
			});
		} catch (error) {
			commit('setMessage', {
				type: 'error',
				text: error.message,
			});
		}
	},
	async deleteAllPassengers({ commit }) {
		try {
			await Axios.delete(`${api}/passengers/delete/all`);
			commit('setMessage', {
				type: 'success',
				text: 'Eliminado todo los pagos',
			});
		} catch (error) {
			commit('setMessage', {
				type: 'error',
				text: error.message,
			});
		}
	},
	async deleteOnePassenger({ commit }, id) {
		try {
			await Axios.delete(`${api}/passengers/${id}`);
			commit('setMessage', {
				type: 'success',
				text: 'Pasajero eliminado',
			});
		} catch (error) {
			commit('setMessage', {
				type: 'error',
				text: error.message,
			});
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
	setMessage(state, value) {
		state.message = value;
		setTimeout(() => {
			state.message = '';
		}, 300);
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
