import axios from 'axios';
import { api } from '@/config/index.js';

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

export default actions;
