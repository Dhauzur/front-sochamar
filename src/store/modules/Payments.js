import fetch from '@/service/fetch';

const state = {
	message: '',
	payments: [],
	loading: false,
	loadingSave: false,
	paymentsForMonth: [],
};

const getters = {
	message: state => state.message,
	payments: state => state.payments,
	loading: state => state.loading,
	loadingSave: state => state.loadingSave,
	paymentsType: state => {
		const typePayment = state.payments;
		for (const element of typePayment) {
			if (element.paymentType == 'lodging') element.paymentType = 'Pago por alojamiento';
			if (element.paymentType == 'byDates') element.paymentType = 'Pago por fecha';
		}
		return typePayment;
	},
	paymentsForMonth: state => {
		const arrayMonth = [];
		const paymentsMonth = state.payments;
		for (const element of paymentsMonth) {
			const sliceMonth = element.startDate.slice(0, 7);
			arrayMonth.push(sliceMonth);
		}
		const removeDuplicates = [...new Set(arrayMonth)];
		return removeDuplicates;
	},
	groupPayments: state => {
		//const initialValue = {};
		//const prueba = ['2020-04', '2020-05-11', '2020-06'];
		const paymentsMonth = state.payments;
		//const arrayMonth = [];
		// const group = state.payments.reduce((accumulator, item) => {
		// 	accumulator[item.startDate] = [...(accumulator[item.startDate] || []), item];
		// 	return accumulator;
		// }, initialValue);

		// const groupBy = (OurArray, property) => {
		// 	return OurArray.reduce((accumulator, object) => {
		// 		const key = object[property];
		// 		// using ternary operator to make it shorter but in this case it is not necessary as it might look complicated
		// 		!accumulator[key] ? (accumulator[key] = []) : accumulator[key].push(object);
		// 		return accumulator;
		// 	}, initialValue);
		// };
		// let groupedPeople;
		// for (const iterator of prueba) {
		// 	groupedPeople = groupBy(paymentsMonth, iterator);
		// 	//arrayMonth.push(groupedPeople);
		// }
		const dateArrg = myArray => {
			return Object.values(
				myArray.reduce((result, value) => {
					// Create new group
					if (!result[value.startDate]) {
						result[value.startDate] = [];
					}
					// Append to group
					result[value.startDate].push(value);
					return result;
				}, {})
			);
		};
		return dateArrg(paymentsMonth);
		// var dateArr = Object.values(
		// 	paymentsMonth.reduce((result, value) => {
		// 		// Create new group
		// 		if (!result[value.startDate]) {
		// 			result[value.startDate] = [];
		// 		}
		// 		// Append to group
		// 		result[value.startDate].push(value);
		// 		return result;
		// 	}, {})
		// );
		// return dateArr;
	},
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
			await fetch(`/payments/${id}`, { method: 'put', data: { comments } });
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
			commit('setLoading', true);
			await fetch(`/payments/${id}`, { method: 'delete' });
			commit('deletePayment', id);
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
		commit('setLoading', false);
	},
};

const mutations = {
	setPayments(state, value) {
		state.payments = value;
	},
	deletePayment(state, value) {
		let index = state.payments.findIndex(payment => payment._id == value);
		state.payments.splice(index, 1);
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
