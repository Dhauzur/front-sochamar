import { api } from '@/config/index.js';
import Axios from 'axios';
import router from '@/router/index.js';
import { DataSet } from 'vue2vis';

const state = {
	message: '',
	roomSelected: null,
	rooms: [],
	timelineRooms: new DataSet([]),
	filterRoomWord: '',
	idCompany: '',
};

const getters = {
	idCompany: state => state.idCompany,
	message: state => state.message,
	roomSelected: state => state.roomSelected,
	rooms: state => {
		if (state.filterRoomWord)
			return state.rooms.filter(
				c => c.name.includes(state.filterRoomWord) || c.rut.includes(state.filterRoomWord)
			);
		else return state.rooms;
	},
	timelineRooms: state => {
		const dataSet = new DataSet([]);
		const fillDataSet = rooms => {
			rooms.forEach(room => {
				dataSet.add({
					id: room._id,
					content: room.name,
					numberPassangerMax: room.numberPassangerMax,
				});
			});
		};
		fillDataSet(state.rooms);
		return dataSet;
	},
};

const actions = {
	async deleteRoom({ commit, dispatch }, { id, companyId }) {
		try {
			const response = await Axios.delete(api + '/rooms/one/' + id, { data: { companyId } });
			const { name } = response.data;
			commit('setMessage', {
				type: 'success',
				text: 'Habitación ' + name + ' eliminada ',
			});
			dispatch('fetchRooms', companyId);
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
			dispatch('fetchRooms', room.companyId);
		} catch (e) {
			commit('setMessage', {
				type: 'error',
				text: 'Error al crear habitacion',
			});
			if (e.message == 'Request failed with status code 401') router.push('/login');
		}
	},
	async fetchRooms({ commit }, companyId) {
		commit('setRooms', null);
		try {
			const response = await Axios.get(api + '/rooms/' + companyId);
			const { rooms } = response.data;
			commit('setRooms', rooms);
			commit('setTimelineRooms', rooms);
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
	setIdCompanyRoom(state, value) {
		state.idCompany = value;
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
	setTimelineRooms(state, values) {
		const dataSet = new DataSet([]);
		const mappedValues = values.map(room => {
			return {
				id: room._id,
				content: room.name,
				numberPassangerMax: room.numberPassangerMax,
			};
		});
		dataSet.add(mappedValues);
		state.timelineRooms = dataSet;
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
