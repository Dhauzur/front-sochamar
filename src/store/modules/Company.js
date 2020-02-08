import { api } from '@/config/index.js';
import Axios from 'axios';

const state = {
	companySelected: null,
	companies: [],
	filterCompanyWord: '',
};

const getters = {
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
	async createCompany({ commit }, company) {
		try {
			await Axios.post(api + '/company/create', company);
			commit('setMessage', {
				type: 'success',
				text: 'Empresa creada ',
			});
		} catch (e) {
			console.log('error de axios: ' + e);
		}
	},
	async fetchCompany({ commit }) {
		commit('setCompanies', null);
		return Axios.get(api + '/company')
			.then(response => {
				console.log(response.data.company);
				commit('setCompanies', response.data.company);
			})
			.catch(() => {
				commit('setCompanies', null);
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
