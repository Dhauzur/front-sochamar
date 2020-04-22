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
	place: null,
	rangeDatePayments: {},
	lodgingsPlace: [],
	countLogingsPlace: 0,
	rangeDate: {
		start: null,
		end: null,
	},
	selectedPlace: {},
	servicesComboBox: [],
	bottomSheet: false,
};

export default state;
