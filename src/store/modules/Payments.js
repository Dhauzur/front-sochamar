import fetch from '@/service/fetch';

const state = {
	message: '',
	payments: [],
	loading: false,
	loadingSave: false,
};

const getters = {
	message: state => state.message,
	payments: state => state.payments,
	loading: state => state.loading,
	loadingSave: state => state.loadingSave,
};

const actions = {
	async fetchPaymentsOfThePlace({ commit }, id) {
		try {
			commit('setLoading', true);
			const response = await fetch(`/payments/${id}`);
			commit('setPayments', response.payments);
			if (response.payments.length) {
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
		commit('setLoading', false);
	},
	async savePayment({ commit }, payload) {
		try {
			commit('setLoadingSave', true);
			await fetch(`/payments/create`, { method: 'post', data: payload });
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
		commit('setLoadingSave', false);
	},
	async editPayment({ commit }, { comments, id }) {
		try {
			await fetch(`/payments/${id}`, { method: 'put', data: comments });
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
			await fetch(`/payments/${id}`, { method: 'delete' });
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
	setLoading(state, value) {
		state.loading = value;
	},
	setLoadingSave(state, value) {
		state.loadingSave = value;
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
