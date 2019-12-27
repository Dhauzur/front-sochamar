import { api  } from '@/config/index.js';
import Axios from 'axios';
import moment from 'moment'
import { DataSet }  from 'vue2vis';

const state = {
  lodgings: new DataSet([]),
  rooms: new DataSet([]),
  rangeDate: {
    start: null,
    end: null
  },
  listLodgings: []
}

const getters = {
  lodgings: state => state.lodgings,
  rangeDate: state => state.rangeDate,
  rooms: state => state.rooms,
  listLodgings: state => state.listLodgings,

}

const actions = {
  async fetchRooms({ commit }, value) {
    commit('setRooms', null)
    return Axios.get(api + "/rooms")
    .then(response => {
      commit('setRooms', response.data.rooms)
      console.log("Habitaciones obtenidas: " + response.data.length);
      console.log(response.data.rooms);
    })
    .catch(error => {
      commit('setRooms', null)
      console.log(error)
    })
  },

  async fetchLodgings({ commit }, value) {
    commit('setLodgings', null)
    return Axios.get(api + "/lodgings")
    .then(response => {
      commit('setLodgings', response.data.lodgings)
      console.log("Hospedajes obtenidos: " + response.data.length);
      console.log(response.data.lodgings);
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
  setRooms(state, value) {
    if(value) value.forEach((v) => {
      state.rooms.add({
        id: v.id,
        content: v.name,
        numberPassangerMax: v.numberPassangerMax
      })
    })
    else state.rooms = new DataSet([])
  },
  setRangeDate(state, value) {
    state.rangeDate = value
  },
  setLodgings(state, value) {
    if(value) {
      state.listLodgings = value
      value.forEach((v) => state.lodgings.add({
        id: v.id,
        group: v.idGroup,
        start: moment(v.start).format('YYYY-MM-DD'),
        end: moment(v.end).format('YYYY-MM-DD'),
        content: v.content,
        numberPassanger: v.numberPassanger,
        typePension: v.typePension
      }))
    }
    else state.lodgings = new DataSet([])
  },
  updateLodgings(state, value) {
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
