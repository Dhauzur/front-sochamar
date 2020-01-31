import Vue from 'vue';
import Vuex from 'vuex';
import Maintenance from './modules/Maintenance';
import Lodging from './modules/Lodging';
import Entity from './modules/Entity';
import User from './modules/user';
import Auth from './modules/auth';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		Lodging,
		Maintenance,
		Entity,
		User,
		Auth,
	},
});
