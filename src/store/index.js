import Vue from 'vue';
import Vuex from 'vuex';
import Auth from './modules/auth';
import Lodging from './modules/Lodging';
import Maintenance from './modules/Maintenance';
import Payments from './modules/Payments';
import Period from './modules/Period';
import Persons from './modules/Persons';
import Place from './modules/Place';
import Room from './modules/rooms';
import User from './modules/user';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		Auth,
		Lodging,
		Maintenance,
		Payments,
		Period,
		Persons,
		Place,
		Room,
		User,
	},
});
