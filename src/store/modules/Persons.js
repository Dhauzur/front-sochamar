import { api } from '@/config/index.js';
import axios from 'axios';

const state = {
	message: '',
	persons: [],
	search: [],
	loading: false,
};

const getters = {
	message: state => state.message,
	persons: state => state.persons,
	personsResultSearch: state => state.search,
	loading: state => state.loading,
};

const actions = {
	async fetchAllPersons({ commit }) {
		try {
			const response = await axios.get(api + '/persons');
			commit('setPersons', response.data.persons);
		} catch (error) {
			commit('setPersons', null);
			commit('setMessage', {
				type: 'error',
				text: error.message,
			});
		}
	},
	async savePerson({ commit }, payload) {
		try {
			commit('setLoading', true);
			const config = { headers: { 'Content-Type': 'multipart/form-data' } };
			await axios.post(`${api}/persons/create`, payload, config);
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
		commit('setLoading', false);
	},
	async editPerson({ commit }, { payload, id }) {
		try {
			commit('setLoading', true);
			const config = { headers: { 'Content-Type': 'multipart/form-data' } };
			await axios.put(`${api}/persons/${id}`, payload, config);
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
		commit('setLoading', false);
	},
	async deleteAllPersons({ commit }) {
		try {
			await axios.delete(`${api}/persons/delete/all`);
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
	async deleteOnePerson({ commit }, id) {
		try {
			await axios.delete(`${api}/persons/${id}`);
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
	setPersons(state, value) {
		state.persons = value;
	},
	setSearchPersons(state, value) {
		state.search = value;
	},
	setMessage(state, value) {
		state.message = value;
		setTimeout(() => {
			state.message = '';
		}, 300);
	},
	setLoading(state, value) {
		state.loading = value;
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
