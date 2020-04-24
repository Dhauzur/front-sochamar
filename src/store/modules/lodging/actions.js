import fetch from '@/service/fetch';
import { createLodging } from '@/service/lodgings';

const actions = {
	async createPeriod({ state, commit, dispatch }, period) {
		try {
			period.placeId = state.selectedPlace.value;
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
		} catch (error) {
			commit('setPlaces', null);
			commit('setMessage', {
				type: 'error',
				text: 'Fetch place ' + error,
			});
		}
	},
	/**
	 * get all lodgings
	 */
	async fetchLodgings({ commit }) {
		try {
			commit('setLoading', 'Cargando hospedajes...');
			commit('setModeEdit', false);
			commit('setLodgings', []);
			const res = await fetch('/lodgings');
			commit('setLoading', false);
			commit('setcountLogingsPlace', res.length);
			commit('setLodgings', res.lodgings);
		} catch (error) {
			commit('setLodgings', null);
			commit('setMessage', {
				type: 'error',
				text: 'Fetch lodgings ' + error,
			});
		}
	},
	/**
	 * get all periods
	 */
	async fetchPeriods({ state, commit }) {
		// commit('setLoading', true);

		try {
			const response = await fetch(
				`/periods/${state.selectedPlace ? state.selectedPlace.value : null}`
			);
			const { periods } = response;
			commit('setPeriods', periods);
			commit('setLoading', false);
		} catch (error) {
			commit('setPeriods', null);
			commit('setMessage', {
				type: 'error',
				text: 'Error al descargar habitaciones',
			});
			commit('setLoading', false);
		}
	},
	/**
	 * get lodgings for place
	 */
	// async fetchLodgingsForPlace({ commit }, id) {
	// 	try {
	// 		const response = await fetch(`/lodgings/place/${id}`);
	// 		commit('setLodgingsPlace', response.lodgings);
	// 		commit('setRangeDatePayments', response.lodgings);
	// 		commit('setcountLogingsPlace', response.count);
	// 	} catch (error) {
	// 		commit('setLodgingsPlace', null);
	// 		commit('setMessage', {
	// 			type: 'error',
	// 			text: 'Fetch lodgings ' + error,
	// 		});
	// 	}
	// },
	/**
	 * Create new lodging
	 * @param {Object} data to save
	 */
	async createLodging({ commit }, data) {
		try {
			commit('setModeEdit', false);
			commit('setLoading', 'Creando hospedajes...');
			const response = await createLodging(data);
			commit('setLodging', response);
			commit('setLoading', false);
		} catch (error) {
			commit('setMessage', {
				type: 'error',
				text: 'Create lodging ' + error,
			});
		}
	},
	async deletePeriod({ commit, dispatch }, { id, placeId }) {
		try {
			await fetch(`/periods/one/${id}`, { method: 'delete', data: { placeId } });
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
		}
	},
};

export default actions;
