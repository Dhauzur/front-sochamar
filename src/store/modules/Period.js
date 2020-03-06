import { api } from '@/config/index.js';
import axios from 'axios';
import router from '@/router/index.js';

const state = {
	message: '',
	periodSelected: null,
	periods: null,
	filterPeriodWord: '',
	idPlace: '',
};

const getters = {
	idPlace: state => state.idPlace,
	message: state => state.message,
	periodSelected: state => state.periodSelected,
	periods: state => {
		if (state.filterPeriodWord)
			return state.periods.filter(c => c.name.includes(state.filterPeriodWord));
		else return state.periods;
	},
};

const actions = {
	async deletePeriod({ commit, dispatch }, { id, placeId }) {
		try {
			const response = await axios.delete(`${api}/periods/one/${id}`, { data: { placeId } });
			const { name } = response.data;
			commit('setMessage', {
				type: 'success',
				text: `Turno ${name} eliminado`,
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
			commit('setPeriods', null);
			const response = await axios.get(`${api}/periods/${placeId}`);
			const { periods } = response.data;
			commit('setPeriods', periods);
			commit('setMessage', {
				type: 'success',
				text: 'Turnos descargados',
			});
		} catch (e) {
			commit('setPeriods', null);
			commit('setMessage', {
				type: 'error',
				text: 'Error al descargar turnos',
			});
			if (e.message == 'Request failed with status code 401') router.push('/login');
		}
	},
};

const mutations = {
	setIdPlacePeriod(state, value) {
		state.idPlace = value;
	},
	setMessage(state, value) {
		state.message = value;
	},
	filterPeriod(state, value) {
		state.filterPeriodWord = value;
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
