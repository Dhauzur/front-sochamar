import Vue from 'vue';
import Vuex from 'vuex';
import CleanLiness from './modules/cleanLiness';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    CleanLiness
  },
});
