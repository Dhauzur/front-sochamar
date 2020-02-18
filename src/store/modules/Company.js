import { api } from '@/config/index.js';
import Axios from 'axios';
import router from '@/router/index.js';

const state = {
	message: '',
	companySelected: null,
	companies: [],
	filterCompanyWord: '',
	company: {},
};

const getters = {
	message: state => state.message,
	companySelected: state => state.companySelected,
	company: state => state.company,
	companies: state => {
		if (state.filterCompanyWord)
			return state.companies.filter(
				c =>
					c.name.includes(state.filterCompanyWord) ||
					c.rut.includes(state.filterCompanyWord)
			);
		else return state.companies;
	},
};

const actions = {
	async deleteCompany({ commit, dispatch }, id) {
		try {
			await Axios.delete(api + '/company/one/' + id).then(response => {
				commit('setMessage', {
					type: 'success',
					text: 'Compañia ' + response.data.delete + ' eliminada ',
				});
				if (response.data.lodgins)
					commit('setMessage', {
						type: 'info',
						text: response.data.lodgins + ' hospedajes asociados eliminados ',
					});
			});
			dispatch('fetchCompany');
		} catch (e) {
			commit('setMessage', {
				type: 'error',
				text: 'Error al eliminar compañia',
			});
			if (e.message == 'Request failed with status code 401') router.push('/login');
		}
	},
	async createCompany({ commit, dispatch }, company) {
		try {
			await Axios.post(api + '/company', company);
			commit('setMessage', {
				type: 'success',
				text: 'Empresa creada ',
			});
			dispatch('fetchCompany');
		} catch (e) {
			commit('setMessage', {
				type: 'error',
				text: 'Error al crear compañia',
			});
			if (e.message == 'Request failed with status code 401') router.push('/login');
		}
	},
	async fetchCompany({ commit }) {
		commit('setCompanies', null);
		return Axios.get(api + '/company')
			.then(response => {
				commit('setMessage', {
					type: 'success',
					text: 'Compañias descargadas',
				});
				commit('setCompanies', response.data.company);
			})
			.catch(e => {
				commit('setCompanies', null);
				commit('setMessage', {
					type: 'error',
					text: 'Error al descargar compañias',
				});
				if (e.message == 'Request failed with status code 401') router.push('/login');
			});
	},
	async fetchOneCompany({ commit }, id) {
		try {
			const response = await Axios.get(`${api}/company/params?id=${id}`);
			commit('setCompany', response.data.company);
		} catch (error) {
			commit('setCompany', null);
			commit('setMessage', {
				type: 'error',
				text: 'Error al descargar company',
			});
			if (error.message == 'Request failed with status code 401') router.push('/login');
		}
	},
};

const mutations = {
	setMessage(state, value) {
		state.message = value;
	},
	filterCompany(state, value) {
		state.filterCompanyWord = value;
	},
	selectCompany(state, value) {
		state.companySelected = state.companies.find(c => c.id == value);
	},
	setCompany(state, value) {
		state.company = value;
	},
	setCompanies(state, value) {
		var companies = [];
		if (value)
			value.forEach(v => {
				companies.push({
					id: v._id,
					name: v.name,
					prices: v.prices,
					rut: v.rut,
				});
			});
		state.companies = companies;
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
