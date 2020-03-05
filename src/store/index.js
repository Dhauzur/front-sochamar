import Vue from 'vue';
import Vuex from 'vuex';
import Auth from './modules/auth';
import Lodging from './modules/Lodging';
import Maintenance from './modules/Maintenance';
import Passengers from './modules/Passengers';
import Payments from './modules/Payments';
import Place from './modules/Place';
import Room from './modules/Room';
import User from './modules/user';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		Auth,
		Lodging,
		Maintenance,
		Passengers,
		Payments,
		Place,
		Room,
		User,
	},
});
