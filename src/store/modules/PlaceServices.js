import { api } from '@/config/index.js';
import axios from 'axios';
import router from '@/router/index.js';
import { toastMessage } from '../../utils/toast/messages';

const state = {
	placeId: '',
	message: '',
	loading: false,
	placeServices: [],
};

const getters = {
	message: state => state.message,
	placeId: state => state.placeId,
	loading: state => state.loading,
	placeServices: state => state.placeServices,
};

const actions = {
	async fetchPlaceServices({ commit }) {
		try {
			const response = await axios.get(`${api}/placeServices/${state.placeId}`);
			const { placeServices } = response.data;
			commit('setPlaceServices', placeServices);
			commit('setMessage', toastMessage('success', 'Servicios descargados'));
		} catch (error) {
			commit('setPlaceServices', []);
			commit('setMessage', toastMessage('error', 'Error al descargar los servicios'));
			if (error.message == 'Request failed with status code 401') router.push('/login');
		}
	},
	async savePlaceService({ commit, dispatch }, { formData }) {
		commit('setLoading', true);
		try {
			commit('setLoading', false);
			formData.placeId = state.placeId;
			delete formData._id;
			await axios.post(`${api}/placeService`, formData);
			commit('setMessage', toastMessage('success', 'Creado exitosamente'));
			dispatch('fetchPlaceServices', state.placeId);
		} catch (error) {
			commit('setLoading', false);
			commit('setMessage', toastMessage('error', 'Error al crear el servicio'));
			if (error.message == 'Request failed with status code 401') router.push('/login');
		}
	},
	async editPlaceService({ commit, dispatch }, { formData }) {
		commit('setLoading', true);
		try {
			const { _id } = formData;
			delete formData._id;
			delete formData.placeId;
			await axios.put(`${api}/placeService/${_id}`, formData);
			commit('setLoading', false);
			commit('setMessage', toastMessage('success', 'Actualizado exitosamente'));
			dispatch('fetchPlaceServices', state.placeId);
		} catch (error) {
			commit('setLoading', false);
			commit('setMessage', toastMessage('error', 'Error al actualizar'));
			if (error.message == 'Request failed with status code 401') router.push('/login');
		}
	},
	async deletePlaceService({ commit, dispatch }, placeServiceId) {
		commit('setLoading', true);
		try {
			await axios.delete(`${api}/placeService/${placeServiceId}`);
			commit('setLoading', false);
			commit('setMessage', toastMessage('success', 'Eliminado exitosamente'));
			dispatch('fetchPlaceServices', state.placeId);
		} catch (error) {
			commit('setLoading', false);
			commit('setMessage', toastMessage('error', 'error al eliminar'));
			if (error.message == 'Request failed with status code 401') router.push('/login');
		}
	},
};

const mutations = {
	setMessage: (state, value) => (state.message = value),
	setPlaceId: (state, value) => (state.placeId = value),
	setLoading: (state, value) => (state.loading = value),
	setPlaceServices: (state, value) => (state.placeServices = value),
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
