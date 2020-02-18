import Vue from 'vue';
import Vuex from 'vuex';
import Auth from './modules/auth';
import Company from './modules/Company';
import Lodging from './modules/Lodging';
import Maintenance from './modules/Maintenance';
import Passengers from './modules/Passengers';
import Payments from './modules/Payments';
import Room from './modules/Room';
import User from './modules/user';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		Auth,
		Company,
		Lodging,
		Maintenance,
		Passengers,
		Payments,
		Room,
		User,
	},
});
