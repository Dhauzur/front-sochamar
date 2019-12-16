import { api  } from '@/config/index.js';
import Axios from 'axios';

const state = {
  activities: []
}

const getters = {
  activities: state => state.activities
}

const actions = {
  async fetchActivities ({ commit }) {
    try {
      return Axios.get(api + "/activities")
          .then(response => {
            commit('setActivities', response.data);
            return true
          })
          .catch(error => {
            return "Error al intentar hacer la descarga: " + error
          })
    } catch (error) {
      console.error("Error al intentar hacer la descarga")
    }
  },
}

const mutations = {
  setActivities(state, value) {
    state.activities = value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
