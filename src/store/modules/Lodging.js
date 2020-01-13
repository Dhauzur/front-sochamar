import { api  } from '@/config/index.js';
import Axios from 'axios';
import moment from 'moment'
import { DataSet }  from 'vue2vis';

const state = {
  lodgingSelect: null,
  loading: false,
  editMode: false,
  lodgings: new DataSet([]),
  rooms: new DataSet([]),
  companies: [],
  company: null,
  rangeDate: {
    start: null,
    end: null
  }
}

const getters = {
  lodgingSelect: state => state.lodgingSelect,
  loading: state => state.loading,
  editMode: state => state.editMode,
  lodgings: state => state.lodgings,
  rangeDate: state => state.rangeDate,
  rooms: state => state.rooms,
  companies: state => state.companies,
  company: state => state.company,
}

const actions = {
  async fetchCompany({ commit, dispatch }, value) {
    commit('setModeEdit', false)
    commit('setCompanies', null)
    commit('setLoading', true)
    return Axios.get(api + "/company")
    .then(response => {
      commit('setLoading', false)
      commit('setCompanies', response.data.company)
      console.log("Empresas obtenidas: " + response.data.length);
      console.log(state.companies);
      dispatch('fetchRooms');
    })
    .catch(error => {
      commit('setCompanies', null)
      console.log(error)
    })
  },

  async fetchRooms({ commit, dispatch }, value) {
    commit('setLoading', true)
    commit('setModeEdit', false)
    commit('setRooms', null)
    return Axios.get(api + "/rooms")
    .then(response => {
      commit('setLoading', false)
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
    commit('setLoading', true)
    commit('setModeEdit', false)
    commit('setLodgings', null)
    return Axios.get(api + "/lodgings")
    .then(response => {
      commit('setLoading', false)
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
    commit('setLoading', true)
    commit('setModeEdit', false)
    Axios.delete(api + "/lodging/delete/all")
    .then(response => {
      console.log("Hospedajes eliminados")
      state.lodgings.forEach((l) => {
        Axios.post(api + "/lodging/create", {
          id: l.id,
          group: l.group,
          start: l.start,
          end: l.end,
          service: l.service[0],
          company: state.company
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
      commit('setLoading', false)
    })
    .catch(error => {
      console.log(error)
    })
  }
}

const mutations = {
  subOneService(state, serviceSelected) {
    var tempLodging = state.lodgingSelect
    state.lodgingSelect = null
    var service = JSON.parse(tempLodging.service[0])
    for (var i = 0; i < tempLodging.end.diff(tempLodging.start+1, 'days'); i++)  {
      for (var u = 0; u <= 3; u++) {
        if(service[i][u] == null) service[i][u] = 0
      }
      if(serviceSelected == 'desayuno' || serviceSelected == 'todos los servicios') service[i][0] = service[i][0] - 1
      if(serviceSelected == 'almuerzo' || serviceSelected == 'todos los servicios') service[i][1] = service[i][1] - 1
      if(serviceSelected == 'cena' || serviceSelected == 'todos los servicios') service[i][2] = service[i][2] - 1
      if(serviceSelected == 'alojamiento' || serviceSelected == 'todos los servicios') service[i][3] = service[i][3] - 1
      for (var u = 0; u <= 3; u++) {
        if(service[i][u] < 0) service[i][u] = 0
      }
    }
    tempLodging.service[0] = JSON.stringify(service)
    state.lodgingSelect = tempLodging
  },
  addOneService(state, serviceSelected) {
    var tempLodging = state.lodgingSelect
    state.lodgingSelect = null
    var service = JSON.parse(tempLodging.service[0])
    for (var i = 0; i < tempLodging.end.diff(tempLodging.start+1, 'days'); i++)  {
      for (var u = 0; u <= 3; u++) {
        if(service[i][u] == null) service[i][u] = 0
        if(service[i][u] >= 20) service[i][u] = 0
      }
      if(serviceSelected == 'desayuno' || serviceSelected == 'todos los servicios') service[i][0] = service[i][0] + 1
      if(serviceSelected == 'almuerzo' || serviceSelected == 'todos los servicios') service[i][1] = service[i][1] + 1
      if(serviceSelected == 'cena' || serviceSelected == 'todos los servicios') service[i][2] = service[i][2] + 1
      if(serviceSelected == 'alojamiento' || serviceSelected == 'todos los servicios') service[i][3] = service[i][3] + 1
    }
    tempLodging.service[0] = JSON.stringify(service)
    state.lodgingSelect = tempLodging
  },
  setLodgingSelect(state, value) {
    state.lodgingSelect = value
  },
  setLoading(state, value) {
    state.loading = value
  },
  setModeEdit(state, value) {
    state.editMode = value
    if(!value) state.lodgingSelect = null
  },
  createFirstLodging(state, value) {
    state.editMode = false
    state.lodgings.add({
      group: 1,
      start: moment().hours(16),
      end: moment().hours(13).add(1, 'day'),
      content: 1 + ' Hab',
      service: ["[[1,1,1,1],[1,1,1,1]]"],
      company: state.company
    })
  },
  setCompanyLodging(state, value) {
    state.company = value
  },
  setCompanies(state, value) {
    var companies = []
    companies.push({
      value: null,
      text: 'Todas las empresas',
    })
    if(value) value.forEach((v) => {
      companies.push({
        value: v._id,
        text: v.name,
        prices: v.prices
      })
    })
    state.companies = companies
  },
  updateService(state, value) {
    var tempLodging = state.lodgings
    state.lodgings = new DataSet([])
    if(value) tempLodging.forEach((l, index) => {
      if(value.id.split(',')[0] == l.id) {
        for (var i = 0; i < 7; i++) {
          if(moment(l.start).add(i, 'day').format('YYYY-MM-DD') == value.id.split(',')[1]) {
            var service = JSON.parse(l.service[0])
            if(value.name == 'dinner') service[i][2] = parseInt(value.value)
            if(value.name == 'lunch') service[i][1] = parseInt(value.value)
            if(value.name == 'accommodation') service[i][3] = parseInt(value.value)
            if(value.name == 'breakfast') service[i][0] = parseInt(value.value)
            l.service[0] = JSON.stringify(service)
          }
        }
      }
    })
    state.lodgings = tempLodging
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
    var tempLodging = state.lodgings
    state.editMode = false
    state.lodgings = new DataSet([])
    if(value) {
      tempLodging = new DataSet([])
      tempLodging.on('*', function (event, properties, senderId) {
        if(event == 'remove') tempLodging.remove(properties.items);                                 // triggers an 'remove' event
      });
      value.forEach((v) => {
        if(state.company) {
          if(state.company == v.company) tempLodging.add({
            id: v.id,
            group: v.group,
            start: moment(v.start).hours(16),
            end: moment(v.end).hours(13),
            content: v.group + ' Hab',
            service: v.service,
            company: v.company
          })
        }
        else tempLodging.add({
          id: v.id,
          group: v.group,
          start: moment(v.start).hours(16),
          end: moment(v.end).hours(13),
          content: v.group + ' Hab',
          service: v.service,
          company: v.company
        })
      })
      state.lodgings = tempLodging
    }
    else state.lodgings = new DataSet([])
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
