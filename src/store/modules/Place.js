import { api } from '@/config/index.js';
import axios from 'axios';
import router from '@/router/index.js';

const state = {
	message: '',
	placeSelected: null,
	places: [],
	filterPlaceWord: '',
	place: {},
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
	async fetchPlace({ commit }) {
		commit('setPlaces', null);
		return axios
			.get(`${api}/place`)
			.then(response => {
				commit('setMessage', {
					type: 'success',
					text: 'Lugars descargadas',
				});
				commit('setPlaces', response.data.place);
			})
			.catch(e => {
				commit('setPlaces', null);
				commit('setMessage', {
					type: 'error',
					text: 'Error al descargar lugares',
				});
				if (e.message == 'Request failed with status code 401') router.push('/login');
			});
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
	filterPlace(state, value) {
		state.filterPlaceWord = value;
	},
	selectPlace(state, value) {
		state.placeSelected = state.places.find(c => c.id == value);
	},
	setPlace(state, value) {
		state.place = value;
	},
	setPlaces(state, value) {
		var places = [];
		if (value)
			value.forEach(v => {
				places.push({
					id: v._id,
					name: v.name,
					prices: v.prices,
					rut: v.rut,
				});
			});
		state.places = places;
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
