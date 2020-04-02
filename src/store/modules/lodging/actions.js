import fetch from '@/service/fetch';
import router from '@/router/index.js';

const actions = {
	async createPeriod({ state, commit, dispatch }, period) {
		try {
			period.placeId = state.place;
			await fetch('/periods', { method: 'post', data: period });
			commit('setMessage', {
				type: 'success',
				text: 'Turno creado ',
			});
			dispatch('fetchPeriods', period.placeId);
		} catch (error) {
			commit('setMessage', {
				type: 'error',
				text: 'Error al crear Turno',
			});
			if (error.response.status === 401) router.push('/login');
		}
	},
	/**
	 * delete a lodging
	 */
	async deleteLodging({ commit }, value) {
		try {
			commit('setLoading', 'Eliminando hospedaje...');
			await fetch(`/lodging/delete/place/${value.id}`, { method: 'delete' });
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
			const response = await fetch(`/place`);
			commit('setLoading', false);
			commit('setPlaces', response.place);
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
			const res = await fetch('/lodgings');
			commit('setLoading', false);
			commit('setLodgings', res.lodgings);
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
			if (error.response.status === 401) router.push('/login');
		}
	},
	/**
	 * get all periods
	 */
	async fetchPeriods({ commit }, placeId) {
		// commit('setLoading', true);

		try {
			const response = await fetch(`/periods/${placeId ? placeId : null}`);
			const { periods } = response;
			commit('setPeriods', periods);
			commit('setMessage', {
				type: 'success',
				text: 'Habitaciones descargadas',
			});
			commit('setLoading', false);
		} catch (error) {
			commit('setPeriods', null);
			commit('setMessage', {
				type: 'error',
				text: 'Error al descargar habitaciones',
			});
			commit('setLoading', false);
			if (error.response.status === 401) router.push('/login');
		}
	},
	/**
	 * get lodgings for place
	 */
	async fetchLodgingsForPlace({ commit }, id) {
		try {
			const response = await fetch(`/lodgings/place/${id}`);
			commit('setLodgingsPlace', response.lodgings);
			commit('setRangeDatePayments', response.lodgings);
			commit('setcountLogingsPlace', response.count);
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
					fetch('/lodging', {
						method: 'post',
						data: {
							id: l.id,
							group: l.group,
							start: l.start,
							end: l.end,
							service: l.service[0],
							persons: l.persons,
							place: state.place,
						},
					}).then(() => (state.mirrorLodging = JSON.stringify(state.lodgings)));
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
