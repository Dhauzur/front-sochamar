import fetch from '@/service/fetch';

const state = {
	message: '',
	persons: [],
	person: null,
	search: [],
	loading: false,
};

const getters = {
	message: state => state.message,
	persons: state => state.persons,
	person: state => state.person,
	personsResultSearch: state => state.search,
	loading: state => state.loading,
};

const actions = {
	async fetchAllPersons({ commit }) {
		try {
			const response = await fetch('/persons');
			commit('setPersons', response.persons);
		} catch (error) {
			commit('setPersons', null);
			commit('setMessage', {
				type: 'error',
				text: error.message,
			});
		}
	},
	async fetchOnePerson({ commit }, id) {
		try {
			const response = await fetch(`/person/${id}`);
			commit('setPerson', response.person);
			return response.person;
		} catch (error) {
			commit('setPerson', null);
			commit('setMessage', {
				type: 'error',
				text: error.message,
			});
		}
	},
	async savePerson({ commit }, payload) {
		try {
			commit('setLoading', true);
			const response = await fetch(`/persons/create`, {
				method: 'post',
				data: payload,
			});
			commit('setMessage', {
				type: 'success',
				text: 'Guardado exitosamente',
			});
			commit('setLoading', false);
			return response.person;
		} catch (error) {
			commit('setMessage', {
				type: 'error',
				text: error.message,
			});
			commit('setLoading', false);
		}
	},
	async editPerson({ commit }, { payload, id }) {
		try {
			commit('setLoading', true);
			const response = await fetch(`/persons/${id}`, { method: 'put', data: payload });
			commit('setMessage', {
				type: 'success',
				text: 'Actualizado exitosamente',
			});
			commit('setLoading', false);
			return response.person;
		} catch (error) {
			commit('setMessage', {
				type: 'error',
				text: error.message,
			});
			commit('setLoading', false);
		}
	},
	async deleteAllPersons({ commit }) {
		try {
			await fetch(`/persons/delete/all`, { method: 'delete' });
			commit('setMessage', {
				type: 'success',
				text: 'Eliminado todo los pagos',
			});
		} catch (error) {
			commit('setMessage', {
				type: 'error',
				text: error.message,
			});
		}
	},
	async deleteOnePerson({ commit }, id) {
		try {
			await fetch(`/persons/${id}`, { method: 'delete' });
			commit('setMessage', {
				type: 'success',
				text: 'Pasajero eliminado',
			});
		} catch (error) {
			commit('setMessage', {
				type: 'error',
				text: error.message,
			});
		}
	},
};

const mutations = {
	setPersons(state, value) {
		state.persons = value;
	},
	setPerson(state, value) {
		state.person = value;
	},
	setSearchPersons(state, value) {
		state.search = value;
	},
	setMessage(state, value) {
		state.message = value;
		setTimeout(() => {
			state.message = '';
		}, 300);
	},
	setLoading(state, value) {
		state.loading = value;
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
