import fetch from '@/service/fetch';
import { toastMessage } from '@/utils/toast/messages';

const state = {
	message: '',
	placeSelected: null,
	places: [],
	filterPlaceWord: '',
	loading: false,
	placeForService: {},
};

const getters = {
	message: state => state.message,
	placeSelected: state => state.placeSelected,
	places: state => {
		if (state.filterPlaceWord)
			return state.places.filter(place => {
				return (
					place.name.toLowerCase().indexOf(state.filterPlaceWord.toLowerCase()) > -1 ||
					place.rut.toLowerCase().indexOf(state.filterPlaceWord.toLowerCase()) > -1
				);
			});
		else return state.places;
	},
	loading: state => state.loading,
	placeForService: state => state.placeForService,
};

const actions = {
	async deletePlace({ commit, dispatch }, id) {
		try {
			await fetch(`/place/one/${id}`, { method: 'delete' }).then(response => {
				commit('setMessage', {
					type: 'success',
					text: 'Lugar ' + response.delete + ' eliminada ',
				});
				if (response.lodgins)
					commit('setMessage', {
						type: 'info',
						text: response.lodgins + ' hospedajes asociados eliminados ',
					});
			});
			dispatch('fetchPlace');
		} catch (error) {
			commit('setMessage', {
				type: 'error',
				text: 'Error al eliminar lugar',
			});
		}
	},
	async createPlace({ commit, dispatch }, place) {
		try {
			await fetch(`/place`, { method: 'post', data: place });
			commit('setMessage', {
				type: 'success',
				text: 'Empresa creada ',
			});
			dispatch('fetchPlace');
		} catch (error) {
			commit('setMessage', {
				type: 'error',
				text: 'Error al crear lugar',
			});
		}
	},
	async createService({ commit, dispatch }, { payload, placeId }) {
		commit('setLoading', true);
		try {
			const response = await fetch(`/place/${placeId}/service`, {
				method: 'post',
				data: payload,
			});
			const { service } = response;
			commit('setMessage', toastMessage('success', 'Servicio creado'));
			commit('addServiceToPlaceForService', service);
			dispatch('fetchPlace');
		} catch (e) {
			commit('setMessage', toastMessage('error', 'no se permiten nombres repetidos'));
		} finally {
			commit('setLoading', false);
		}
	},
	async updateService({ commit, dispatch }, { payload, placeId }) {
		commit('setLoading', true);
		try {
			const serviceId = payload._id;
			await fetch(`/place/${placeId}/service/${serviceId}`, {
				method: 'put',
				data: payload,
			});
			commit('setMessage', toastMessage('success', 'Servicio Actualizado'));
			dispatch('fetchPlace');
		} catch (error) {
			commit('setMessage', toastMessage('error', 'error al actulizar servicio'));
		} finally {
			commit('setLoading', false);
		}
	},
	async deleteService({ commit, dispatch }, { serviceId, placeId }) {
		commit('setLoading', true);
		try {
			await fetch(`/place/${placeId}/service/${serviceId}`, { method: 'delete' });
			commit('setMessage', toastMessage('success', 'Servicio Borrado con exito'));
			dispatch('fetchPlace');
		} catch (error) {
			commit('setMessage', toastMessage('error', 'error al borrar Servicio'));
		} finally {
			commit('setLoading', false);
		}
	},
	async fetchPlace({ commit }) {
		commit('setPlaces', null);
		try {
			const response = await fetch(`/place`);
			const { place } = response;
			commit('setPlaces', place);
		} catch (e) {
			commit('setPlaces', null);
			commit('setMessage', {
				type: 'error',
				text: 'Error al descargar lugares',
			});
		}
	},
};

const mutations = {
	setMessage(state, value) {
		state.message = value;
	},
	addServiceToPlaceForService: (state, value) => state.placeForService.services.push(value),
	filterPlace(state, value) {
		state.filterPlaceWord = value;
	},
	selectPlace(state, value) {
		state.placeSelected = state.places.find(c => c.id == value);
	},
	setPlaceForServices(state, value) {
		state.placeForService = value;
	},
	setPlaces(state, value) {
		var places = [];
		if (value)
			value.forEach(v => {
				places.push({
					id: v._id,
					name: v.name,
					services: v.services,
					rut: v.rut,
				});
			});
		state.places = places;
	},
	setLoading: (state, loading) => (state.loading = loading),
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
