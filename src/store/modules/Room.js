import { api } from '@/config/index.js';
import Axios from 'axios';
import router from '@/router/index.js';

const state = {
	message: '',
	roomSelected: null,
	rooms: [],
	filterRoomWord: '',
};

const getters = {
	message: state => state.message,
	roomSelected: state => state.roomSelected,
	rooms: state => {
		if (state.filterRoomWord)
			return state.rooms.filter(
				c => c.name.includes(state.filterRoomWord) || c.rut.includes(state.filterRoomWord)
			);
		else return state.rooms;
	},
};

const actions = {
	async deleteRoom({ commit, dispatch }, id) {
		try {
			await Axios.delete(api + '/rooms/one/' + id).then(response => {
				commit('setMessage', {
					type: 'success',
					text: 'Habitación ' + response.data.delete + ' eliminada ',
				});
				if (response.data.lodgins)
					commit('setMessage', {
						type: 'info',
						text: response.data.lodgins + ' hospedajes asociados eliminados ',
					});
			});
			dispatch('fetchRooms');
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
			await Axios.post(api + '/rooms', room);
			commit('setMessage', {
				type: 'success',
				text: 'Empresa creada ',
			});
			dispatch('fetchRooms');
		} catch (e) {
			commit('setMessage', {
				type: 'error',
				text: 'Error al crear habitacion',
			});
			if (e.message == 'Request failed with status code 401') router.push('/login');
		}
	},
	async fetchRooms({ commit }) {
		commit('setRooms', null);
		try {
			await Axios.get(api + '/rooms').then(response => {
				commit('setRooms', response.data.rooms);
				commit('setMessage', {
					type: 'success',
					text: 'Habitaciones descargadas',
				});
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
		console.log(value);
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
