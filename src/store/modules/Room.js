import { api } from '@/config/index.js';
import Axios from 'axios';
import router from '@/router/index.js';

const state = {
	message: '',
	roomSelected: null,
	rooms: [],
	filterRoomWord: '',
	idPlace: '',
};

const getters = {
	idPlace: state => state.idPlace,
	message: state => state.message,
	roomSelected: state => state.roomSelected,
	rooms: state => {
		if (state.filterRoomWord)
			return state.rooms.filter(c => c.name.includes(state.filterRoomWord));
		else return state.rooms;
	},
};

const actions = {
	async deleteRoom({ commit, dispatch }, { id, placeId }) {
		try {
			const response = await Axios.delete(`${api}/rooms/one/${id}`, { data: { placeId } });
			const { name } = response.data;
			commit('setMessage', {
				type: 'success',
				text: 'Habitación ' + name + ' eliminada ',
			});
			dispatch('fetchRooms', placeId);
		} catch (e) {
			commit('setMessage', {
				type: 'error',
				text: 'Error al eliminar habitación',
			});
			if (e.message == 'Request failed with status code 401') router.push('/login');
		}
	},
	async createRoom({ commit, dispatch }, room) {
		try {
			room.placeId = state.idPlace;
			await Axios.post(api + '/rooms', room);
			commit('setMessage', {
				type: 'success',
				text: 'Empresa creada ',
			});
			dispatch('fetchRooms', room.placeId);
		} catch (e) {
			commit('setMessage', {
				type: 'error',
				text: 'Error al crear habitacion',
			});
			if (e.message == 'Request failed with status code 401') router.push('/login');
		}
	},
	async fetchRooms({ commit }, placeId) {
		try {
			commit('setRooms', null);
			const response = await Axios.get(`${api}/rooms/${placeId}`);
			const { rooms } = response.data;
			commit('setRooms', rooms);
			commit('setMessage', {
				type: 'success',
				text: 'Habitaciones descargadas',
			});
		} catch (e) {
			commit('setRooms', null);
			commit('setMessage', {
				type: 'error',
				text: 'Error al descargar habitaciones',
			});
			if (e.message == 'Request failed with status code 401') router.push('/login');
		}
	},
};

const mutations = {
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
