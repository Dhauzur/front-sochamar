import Vue from 'vue';
import Vuex from 'vuex';
import Maintenance from './modules/Maintenance';
import Lodging from './modules/Lodging';
import Entity from './modules/Entity';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Lodging,
    Maintenance,
    Entity
  },
});
