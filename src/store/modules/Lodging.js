import { api  } from '@/config/index.js';
import Axios from 'axios';
import moment from 'moment'
import { DataSet }  from 'vue2vis';

const state = {
  lodgings: new DataSet([])
}

const getters = {
  lodgings: state => state.lodgings,
}

const actions = {
  async fetchLodgings({ commit }, value) {
    return Axios.get(api + "/lodgings")
    .then(response => {
      commit('setLodgings', response.data.lodgings)
      console.log("Hospedajes obtenidos: " + response.data.length);
      console.log(response.data.lodging);
    })
    .catch(error => {
      commit('setLodgings', null)
      console.log(error)
    })
  },

  async createLodging({ commit }, value) {
    return Axios.post(api + "/lodging/create", value)
    .then(response => {
      console.log("Hospedaje creada (Sin validaciones)");
      console.log(response.data.lodgings);
    })
    .catch(error => {
      console.log(error)
    })
  }
}

const mutations = {
  setLodgings(state, value) {
    if(value) value.forEach((v) => {
      state.lodgings.add({
        id: v.id,
        group: v.idGroup,
        start: moment(v.start).format('YYYY-MM-DD'),
        end: moment(v.end).format('YYYY-MM-DD'),
        content: v.content
      })
    })
    else state.lodgings = new DataSet([])
  },
  updateLodgings(state, value) {
    console.log("upd2");

    state.lodgings[value.id] = value.payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
