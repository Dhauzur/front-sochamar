const state = {
	message: '',
	updatingService: null,
	mirrorLodging: null,
	lodgingSelect: null,
	loading: false,
	editMode: false,
	lodgings: [],
	periods: [],
	places: [],
	lodgingPersons: [],
	rangeDatePayments: {},
	lodgingsPlace: [],
	countLogingsPlace: 0,
	rangeDate: {
		start: null,
		end: null,
	},
	seeTimeline: false,
	selectedPlace: null,
	servicesComboBox: [],
	bottomSheet: false,
};

export default state;
