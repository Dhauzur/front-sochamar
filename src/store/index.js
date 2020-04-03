import Vue from 'vue';
import Vuex from 'vuex';
import Lodging from './modules/lodging/';
import Maintenance from './modules/Maintenance';
import Payments from './modules/Payments';
import Persons from './modules/Persons';
import Place from './modules/Place';
import Room from './modules/rooms';
import User from './modules/user';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		Lodging,
		Maintenance,
		Payments,
		Persons,
		Place,
		Room,
		User,
	},
});
