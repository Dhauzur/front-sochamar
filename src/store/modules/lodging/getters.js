const getters = {
	periodAllPlace: state => place => {
		return state.periods.get({
			filter: item => item.place == place,
		});
	},
	lodgingsAllPlace: state => place => {
		return state.lodgings.get({
			filter: item => item.place == place,
		});
	},
	bottomSheet: state => state.bottomSheet,
	message: state => state.message,
	lodgingPersons: state => state.lodgingPersons,
	updatingService: state => state.updatingService,
	mirrorLodging: state => state.mirrorLodging,
	lodgingSelect: state => state.lodgingSelect,
	loading: state => state.loading,
	editMode: state => state.editMode,
	lodgings: state => state.lodgings,
	rangeDatePayments: state => state.rangeDatePayments,
	lodgingsPlace: state => state.lodgingsPlace,
	countLogingsPlace: state => state.countLogingsPlace,
	rangeDate: state => state.rangeDate,
	periods: state => state.periods,
	places: state => state.Places,
	place: state => state.place,
	selectedPlace: state => state.selectedPlace,
	servicesComboBox: state => state.servicesComboBox,
};

export default getters;
