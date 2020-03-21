import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import { DataSet } from 'vue2vis';

const state = {
	message: '',
	updatingService: null,
	mirrorLodging: null,
	lodgingSelect: null,
	loading: false,
	editMode: false,
	lodgings: new DataSet([]),
	periods: new DataSet([]),
	Places: [],
	lodgingPersons: [],
	place: null,
	rangeDatePayments: {},
	lodgingsPlace: [],
	countLogingsPlace: 0,
	rangeDate: {
		start: null,
		end: null,
	},
	bottomSheet: false,
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
