import { api  } from '@/config/index.js';
import Axios from 'axios';
import moments from 'moment'

const state = {
  companySelected: null,
  companies: []
}

const getters = {
  companySelected: state => state.companySelected,
  companies: state => state.companies,
}

const actions = {
  async fetchCompany({ commit, dispatch }, value) {
    commit('setCompanies', null)
    return Axios.get(api + "/company")
    .then(response => {
      console.log(response.data.company);
      commit('setCompanies', response.data.company)
    })
    .catch(error => {
      commit('setCompanies', null)
    })
  }
}

const mutations = {
  selectCompany(state, value) {
    state.companySelected = state.companies.find((c) => c.id == value)
  },
  setCompanies(state, value) {
    var companies = []
    if(value) value.forEach((v) => {
      companies.push({
        id: v._id,
        name: v.name,
        prices: v.prices,
        rut: v.rut
      })
    })
    state.companies = companies
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
