import { api } from '@/config/index.js';
import Axios from 'axios';
import router from '@/router/index.js';

const state = {
	message: '',
	companySelected: null,
	companies: [],
	filterCompanyWord: '',
};

const getters = {
	message: state => state.message,
	companySelected: state => state.companySelected,
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
	async createCompany({ commit, dispatch }, company) {
		try {
			await Axios.post(api + '/company/create', company);
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
