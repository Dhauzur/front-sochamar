import { api  } from '@/config/index.js';
import Axios from 'axios';
import moments from 'moment'

const state = {
  activity: null,
  activities: []
}

const getters = {
  activity: state => state.activity,
  activities: state => {
    const dates = new Set();
    if(state.activities.activities) state.activities.activities.forEach((act) => {
      act.date = moments(act.date).format("YYYY-MM-DD")
      dates.add(moments(moments(act.date).format("YYYY-MM-DD")).format("WW"))
    })
    dates.forEach((date) => {
      var numberTotal = 0
      var lastRow = null
      var payOK = false
      console.log(state.activities.activities);
      state.activities.activities.forEach((act, index) => {
        if(date == moments(moments(act.date).format("YYYY-MM-DD")).format("WW")) {
          lastRow = index
          if(act.state) payOK = true
          numberTotal = numberTotal + act.ncamas
        }
      })
      state.activities.activities.forEach((act, index) => {
        if(index == lastRow) act.result = true
        if(date == moments(moments(act.date).format("YYYY-MM-DD")).format("WW")) {
          act.state = payOK
          act.numbersOfBeds = numberTotal
          act.valueOfBeds = '$ ' + (numberTotal * 1500)
        }
      })
    })
    return state.activities.activities
  }
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
