import { api } from '@/config/index.js';
import Axios from 'axios';

const state = {
	message: '',
	payments: [],
};

const getters = {
	message: state => state.message,
	payments: state => state.payments,
};

const actions = {
	async fetchPaymentsOfTheCompany({ commit }, id) {
		try {
			const response = await Axios.get(`${api}/payments/${id}`);
			commit('setPayments', response.data.payments);
			if (response.data.payments.length > 0) {
				commit('setMessage', {
					type: 'success',
					text: 'Lista de Pagos ok',
				});
			}
		} catch (error) {
			commit('setPayments', null);
			commit('setMessage', {
				type: 'error',
				text: error.message,
			});
		}
	},
	async savePayment({ commit }, payload) {
		try {
			const config = { headers: { 'Content-Type': 'multipart/form-data' } };
			await Axios.post(`${api}/payments/create`, payload, config);
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
	async editPayment({ commit }, { payload, id }) {
		try {
			const config = { headers: { 'Content-Type': 'multipart/form-data' } };
			await Axios.put(`${api}/payments/${id}`, payload, config);
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
	async deleteOnePayment({ commit }, id) {
		try {
			await Axios.delete(`${api}/payments/${id}`);
			commit('setMessage', {
				type: 'success',
				text: 'Eliminado datos de pago',
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
	setPayments(state, value) {
		state.payments = value;
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
