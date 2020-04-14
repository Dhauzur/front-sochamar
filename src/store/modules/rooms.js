import fetch from '@/service/fetch';

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
	rooms: state => state.rooms,
};

const actions = {
	async deleteRoom({ commit, dispatch }, { id, placeId }) {
		try {
			const { name } = await fetch(`/rooms/one/${id}`, {
				method: 'delete',
				data: { placeId },
			});
			commit('setMessage', {
				type: 'success',
				text: `Turno ${name} eliminado`,
			});
			dispatch('fetchRooms', placeId);
		} catch (error) {
			commit('setMessage', {
				type: 'error',
				text: 'Error al eliminar Turno',
			});
		}
	},
	async createRoom({ commit, dispatch }, room) {
		try {
			commit('setLoading', true);
			room.placeId = state.idPlace;
			await fetch('/rooms', { method: 'post', data: room });
			commit('setMessage', {
				type: 'success',
				text: 'Habitacion creada ',
			});
			dispatch('fetchRooms', room.placeId);
		} catch (error) {
			commit('setMessage', {
				type: 'error',
				text: 'Error al crear Turno',
			});
		}
		commit('setLoading', false);
	},
	async fetchRooms({ commit }, placeId) {
		try {
			commit('setLoading', true);
			commit('setRooms', null);
			const response = await fetch(`/rooms/${placeId}`);
			const { rooms } = response;
			commit('setRooms', rooms);
		} catch (error) {
			commit('setRooms', null);
			commit('setMessage', {
				type: 'error',
				text: 'Error al descargar turnos',
			});
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
