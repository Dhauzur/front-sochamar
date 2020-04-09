import { api } from '@/config/index.js';
import axios from 'axios';
import router from '@/router/index.js';
import { toastMessage } from '@/utils/toast/messages';

const state = {
	message: '',
	placeSelected: null,
	places: [],
	filterPlaceWord: '',
	place: {},
	loading: false,
	placeForService: {},
};

const getters = {
	message: state => state.message,
	placeSelected: state => state.placeSelected,
	place: state => state.place,
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
			await axios.delete(`${api}/place/one/${id}`).then(response => {
				commit('setMessage', {
					type: 'success',
					text: 'Lugar ' + response.data.delete + ' eliminada ',
				});
				if (response.data.lodgins)
					commit('setMessage', {
						type: 'info',
						text: response.data.lodgins + ' hospedajes asociados eliminados ',
					});
			});
			dispatch('fetchPlace');
		} catch (e) {
			commit('setMessage', {
				type: 'error',
				text: 'Error al eliminar lugar',
			});
			if (e.message == 'Request failed with status code 401') router.push('/login');
		}
	},
	async createPlace({ commit, dispatch }, place) {
		try {
			await axios.post(`${api}/place`, place);
			commit('setMessage', {
				type: 'success',
				text: 'Empresa creada ',
			});
			dispatch('fetchPlace');
		} catch (e) {
			commit('setMessage', {
				type: 'error',
				text: 'Error al crear lugar',
			});
			if (e.message == 'Request failed with status code 401') router.push('/login');
		}
	},
	async createService({ commit, dispatch }, { payload, placeId }) {
		commit('setLoading', true);
		try {
			const response = await axios.post(`${api}/place/${placeId}/service`, payload);
			const { service } = response.data;
			commit('setMessage', toastMessage('success', 'Servicio creado'));
			commit('addServiceToPlaceForService', service);
			dispatch('fetchPlace');
		} catch (e) {
			commit('setMessage', toastMessage('error', 'no se permiten nombres repetidos'));
			if (e.message == 'Request failed with status code 401') router.push('/login');
		} finally {
			commit('setLoading', false);
		}
	},
	async updateService({ commit, dispatch }, { payload, placeId }) {
		commit('setLoading', true);
		try {
			const serviceId = payload._id;
			await axios.put(`${api}/place/${placeId}/service/${serviceId}`, payload);
			commit('setMessage', toastMessage('success', 'Servicio Actualizado'));
			dispatch('fetchPlace');
		} catch (e) {
			commit('setMessage', toastMessage('error', 'error al actulizar servicio'));
			if (e.message == 'Request failed with status code 401') router.push('/login');
		} finally {
			commit('setLoading', false);
		}
	},
	async deleteService({ commit, dispatch }, { serviceId, placeId }) {
		commit('setLoading', true);
		try {
			await axios.delete(`${api}/place/${placeId}/service/${serviceId}`);
			commit('setMessage', toastMessage('success', 'Servicio Borrado con exito'));
			dispatch('fetchPlace');
		} catch (e) {
			commit('setMessage', toastMessage('error', 'error al borrar Servicio'));
			if (e.message == 'Request failed with status code 401') router.push('/login');
		} finally {
			commit('setLoading', false);
		}
	},
	async fetchPlace({ commit }) {
		commit('setPlaces', null);
		try {
			const response = await axios.get(`${api}/place`);
			const { place } = response.data;
			commit('setMessage', {
				type: 'success',
				text: 'Lugares descargados',
			});
			commit('setPlaces', place);
		} catch (e) {
			commit('setPlaces', null);
			commit('setMessage', {
				type: 'error',
				text: 'Error al descargar lugares',
			});
			if (e.message == 'Request failed with status code 401') router.push('/login');
		}
	},
	async fetchOnePlace({ commit }, id) {
		try {
			const response = await axios.get(`${api}/place/${id}`);
			commit('setPlace', response.data.place);
		} catch (error) {
			commit('setPlace', null);
			commit('setMessage', {
				type: 'error',
				text: 'Error al descargar lugar',
			});
			if (error.message == 'Request failed with status code 401') router.push('/login');
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
	setPlace(state, value) {
		state.place = value;
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
