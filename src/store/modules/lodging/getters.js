const getters = {
	// periodAllPlace: state => {
	// 	return state.periods.filter(period => period.place == selectedPlace.value);
	// },
	lodgings: state => {
		if (state.selectedPlace)
			return state.lodgings.filter(lod => lod.place == state.selectedPlace.value);
		else return state.lodgings;
	},
	bottomSheet: state => state.bottomSheet,
	message: state => state.message,
	lodgingPersons: state => state.lodgingPersons,
	updatingService: state => state.updatingService,
	mirrorLodging: state => state.mirrorLodging,
	lodgingSelect: state => state.lodgingSelect,
	loading: state => state.loading,
	editMode: state => state.editMode,
	rangeDatePayments: state => state.rangeDatePayments,
	lodgingsPlace: state => state.lodgingsPlace,
	countLogingsPlace: state => state.countLogingsPlace,
	rangeDate: state => state.rangeDate,
	periods: state => state.periods,
	places: state => state.places,
	periodsTable: state => state.periods,
	selectedPlace: state => state.selectedPlace,
	servicesComboBox: state => state.servicesComboBox,
	seeTimeline: state => state.seeTimeline,
};

export default getters;
