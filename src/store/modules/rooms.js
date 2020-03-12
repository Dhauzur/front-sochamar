import { api } from '@/config/index.js';
import axios from 'axios';
import router from '@/router/index.js';

const state = {
	filterRoomWord: '',
	idPlace: '',
	loading: false,
	message: '',
	rooms: null,
	roomSelected: null,
};

const getters = {
	idPlace: state => state.idPlace,
	loading: state => state.loading,
	message: state => state.message,
	roomSelected: state => state.roomSelected,
	rooms: state => {
		if (state.filterRoomWord)
			return state.rooms.filter(
				room => room.name.toLowerCase().indexOf(state.filterRoomWord.toLowerCase()) > -1
			);
		else return state.rooms;
	},
};

const actions = {
	async deleteRoom({ commit, dispatch }, { id, placeId }) {
		try {
			const response = await axios.delete(`${api}/rooms/one/${id}`, { data: { placeId } });
			const { name } = response.data;
			commit('setMessage', {
				type: 'success',
				text: `Turno ${name} eliminado`,
			});
			dispatch('fetchRooms', placeId);
		} catch (e) {
			commit('setMessage', {
				type: 'error',
				text: 'Error al eliminar Turno',
			});
			if (e.message == 'Request failed with status code 401') router.push('/login');
		}
	},
	async createRoom({ commit, dispatch }, room) {
		try {
			commit('setLoading', true);
			room.placeId = state.idPlace;
			await axios.post(api + '/rooms', room);
			commit('setMessage', {
				type: 'success',
				text: 'Habitacion creada ',
			});
			dispatch('fetchRooms', room.placeId);
		} catch (e) {
			commit('setMessage', {
				type: 'error',
				text: 'Error al crear Turno',
			});
			if (e.message == 'Request failed with status code 401') router.push('/login');
		}
		commit('setLoading', false);
	},
	async fetchRooms({ commit }, placeId) {
		try {
			commit('setLoading', true);
			commit('setRooms', null);
			const response = await axios.get(`${api}/rooms/${placeId}`);
			const { rooms } = response.data;
			commit('setRooms', rooms);
		} catch (e) {
			commit('setRooms', null);
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
	setIdPlaceRoom(state, value) {
		state.idPlace = value;
	},
	setMessage(state, value) {
		state.message = value;
	},
	filterRoom(state, value) {
		state.filterRoomWord = value;
	},
	selectRoom(state, value) {
		state.roomSelected = state.rooms.find(c => c.id == value);
	},
	setRooms(state, value) {
		var rooms = [];
		if (value)
			value.forEach(v => {
				rooms.push({
					id: v._id,
					name: v.name,
					numberPassangerMax: v.numberPassangerMax,
				});
			});
		state.rooms = rooms;
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
