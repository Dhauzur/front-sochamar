import { api } from '@/config/index.js';
import axios from 'axios';
import router from '@/router/index.js';

const state = {
	message: '',
	periodSelected: null,
	periods: null,
	idPlace: '',
	loading: false,
};

const getters = {
	loading: state => state.loading,
	idPlace: state => state.idPlace,
	message: state => state.message,
	periodSelected: state => state.periodSelected,
	periods: state => state.periods,
};

const actions = {
	async deletePeriod({ commit, dispatch }, { id, placeId }) {
		try {
			await axios.delete(`${api}/periods/one/${id}`, { data: { placeId } });
			commit('setMessage', {
				type: 'success',
				text: `Turno eliminado`,
			});
			dispatch('fetchPeriods', placeId);
		} catch (e) {
			commit('setMessage', {
				type: 'error',
				text: 'Error al eliminar Turno',
			});
			if (e.message == 'Request failed with status code 401') router.push('/login');
		}
	},
	async createPeriod({ commit, dispatch }, period) {
		try {
			period.placeId = state.idPlace;
			await axios.post(api + '/periods', period);
			commit('setMessage', {
				type: 'success',
				text: 'Empresa creada ',
			});
			dispatch('fetchPeriods', period.placeId);
		} catch (e) {
			commit('setMessage', {
				type: 'error',
				text: 'Error al crear Turno',
			});
			if (e.message == 'Request failed with status code 401') router.push('/login');
		}
	},
	async fetchPeriods({ commit }, placeId) {
		try {
			commit('setLoading', true);
			const response = await axios.get(`${api}/periods/${placeId}`);
			const { periods } = response.data;
			commit('setPeriods', periods);
		} catch (e) {
			commit('setPeriods', null);
			commit('setMessage', {
				type: 'error',
				text: 'Error al descargar turnos',
			});
			if (e.message == 'Request failed with status code 401') router.push('/login');
		}
		commit('setLoading', false);
	},
};

const mutations = {
	setLoading(state, value) {
		state.loading = value;
	},
	setIdPlacePeriod(state, value) {
		state.idPlace = value;
	},
	setMessage(state, value) {
		state.message = value;
	},
	selectPeriod(state, value) {
		state.periodSelected = state.periods.find(c => c.id == value);
	},
	setPeriods(state, value) {
		var periods = [];
		if (value)
			value.forEach(v => {
				periods.push({
					id: v._id,
					name: v.name,
					numberPassangerMax: v.numberPassangerMax,
				});
			});
		state.periods = periods;
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
