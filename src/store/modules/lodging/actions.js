import axios from 'axios';
import { api } from '@/config/index.js';
import router from '@/router/index.js';

const actions = {
	async createPeriod({ state, commit, dispatch }, period) {
		try {
			period.placeId = state.place;
			await axios.post(api + '/periods', period);
			commit('setMessage', {
				type: 'success',
				text: 'Turno creado ',
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
	/**
	 * delete a lodging
	 */
	async deleteLodging({ commit }, value) {
		try {
			commit('setLoading', 'Eliminando hospedaje...');
			await axios.delete(`${api}/lodging/delete/place/${value.id}`);
			commit('setLoading', false);
			commit('setDeletLodging', value);
			commit('setMessage', {
				type: 'default',
				text: 'Hospedaje eliminado ',
			});
		} catch (error) {
			commit('setMessage', {
				type: 'error',
				text: 'Delete lodging ' + error,
			});
			if (error.message == 'Request failed with status code 401') router.push('/login');
		}
	},
	/**
	 * get all places
	 */
	async fetchPlace({ commit }) {
		try {
			commit('setModeEdit', false);
			commit('setPlaces', null);
			commit('setLoading', 'Cargando lugares...');
			const response = await axios.get(`${api}/place`);
			commit('setLoading', false);
			commit('setPlaces', response.data.place);
			commit('setMessage', {
				type: 'success',
				text: 'lugares descargados',
			});
		} catch (error) {
			commit('setPlaces', null);
			commit('setMessage', {
				type: 'error',
				text: 'Fetch place ' + error,
			});
			if (error.message == 'Request failed with status code 401') router.push('/login');
		}
	},
	/**
	 * get all lodgings
	 */
	async fetchLodgings({ commit }) {
		try {
			commit('setLoading', 'Cargando hospedajes...');
			commit('setModeEdit', false);
			commit('setLodgings', null);
			const response = await axios.get(api + '/lodgings');
			commit('setLoading', false);
			commit('setLodgings', response.data.lodgings);
			commit('setMessage', {
				type: 'success',
				text: 'Hospedajes descargados ',
			});
		} catch (error) {
			commit('setLodgings', null);
			commit('setMessage', {
				type: 'error',
				text: 'Fetch lodgings ' + error,
			});
			if (error.message == 'Request failed with status code 401') router.push('/login');
		}
	},
	/**
	 * get all periods
	 */
	async fetchPeriods({ commit }, placeId) {
		// commit('setLoading', true);

		try {
			const response = await axios.get(`${api}/periods/${placeId ? placeId : null}`);
			const { periods } = response.data;
			commit('setPeriods', periods);
			commit('setMessage', {
				type: 'success',
				text: 'Habitaciones descargadas',
			});
			commit('setLoading', false);
		} catch (e) {
			commit('setPeriods', null);
			commit('setMessage', {
				type: 'error',
				text: 'Error al descargar habitaciones',
			});
			commit('setLoading', false);
			if (e.message == 'Request failed with status code 401') router.push('/login');
		}
	},
	/**
	 * get lodgings for place
	 */
	async fetchLodgingsForPlace({ commit }, id) {
		try {
			const response = await axios.get(`${api}/lodgings/place/${id}`);
			commit('setLodgingsPlace', response.data.lodgings);
			commit('setRangeDatePayments', response.data.lodgings);
			commit('setcountLogingsPlace', response.data.count);
		} catch (error) {
			commit('setLodgingsPlace', null);
			commit('setMessage', {
				type: 'error',
				text: 'Fetch lodgings ' + error,
			});
			if (error.message == 'Request failed with status code 401') router.push('/login');
		}
	},
	/**
	 * Guarda un hospedaje que no este almacenado o que es diferente
	 * A lo que existe en la base de datos.
	 */
	async saveLodgings({ state, commit }) {
		try {
			commit('setModeEdit', false);
			commit('setLoading', 'Creando hospedajes...');
			let mirrorLodging = JSON.parse(state.mirrorLodging);
			state.lodgings.forEach((l, id) => {
				//Si es diferente o si no existe
				if (mirrorLodging._data[id] != l || !mirrorLodging[id]) {
					axios
						.post(api + '/lodging', {
							id: l.id,
							group: l.group,
							start: l.start,
							end: l.end,
							service: l.service[0],
							persons: l.persons,
							place: state.place,
						})
						.then(() => (state.mirrorLodging = JSON.stringify(state.lodgings)));
				}
			});
			commit('setLoading', false);
		} catch (error) {
			commit('setMessage', {
				type: 'error',
				text: 'Create lodging ' + error,
			});
			if (error.message == 'Request failed with status code 401') router.push('/login');
		}
	},
};

export default actions;
