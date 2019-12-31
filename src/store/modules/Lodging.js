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
  async fetchRooms({ commit, dispatch }, value) {
    commit('setRooms', null)
    return Axios.get(api + "/rooms")
    .then(response => {
      commit('setRooms', response.data.rooms)
      console.log("Habitaciones obtenidas: " + response.data.length);
      console.log(state.rooms);
      dispatch('fetchLodgings');
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
      console.log(state.lodgings);
    })
    .catch(error => {
      commit('setLodgings', null)
      console.log(error)
    })
  },

  async createLodging({ commit, dispatch }) {
    Axios.delete(api + "/lodging/delete/all")
    .then(response => {
      console.log("Hospedajes eliminados")
      state.lodgings.forEach((l) => {
        Axios.post(api + "/lodging/create", {
          id: l.id,
          group: l.group,
          start: l.start,
          end: l.end,
          service: l.service[0]
        })
        .then(response => {
          console.log("Hospedaje creado (Sin validaciones)");
          console.log(response);
          dispatch('fetchLodgings');

        })
        .catch(error => {
          console.log(error)
        })
      })
    })
    .catch(error => {
      console.log(error)
    })
  }
}

const mutations = {
  addLodging(state, v) {
    state.lodgings.add({
      // id: v.id,
      group: v.group,
      start: moment(v.time).hours(0).format('YYYY-MM-DD'),
      end: moment(v.time).hours(23).add(1, 'day').format('YYYY-MM-DD'),
      content: v.group + ' Hab',
      service: {
        breakfast: '0',
        lunch: '0',
        dinner: '0',
        accommodation: '0'
      }
    })

  },
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
      state.lodgings = new DataSet([])
      state.listLodgings = value
      value.forEach((v) => state.lodgings.add({
        id: v.id,
        group: v.group,
        start: moment(v.start).hours(16),
        end: moment(v.end).hours(13),
        content: v.group + ' Hab',
        service: v.service,
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
