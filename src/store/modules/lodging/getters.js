const getters = {
	bottomSheet: state => state.bottomSheet,
	message: state => state.message,
	lodgingPersons: state => state.lodgingPersons,
	updatingService: state => state.updatingService,
	mirrorLodging: state => state.mirrorLodging,
	lodgingSelect: state => state.lodgingSelect,
	loading: state => (state.loading ? true : false),
	editMode: state => state.editMode,
	lodgings: state => state.lodgings,
	rangeDatePayments: state => state.rangeDatePayments,
	lodgingsPlace: state => state.lodgingsPlace,
	countLogingsPlace: state => state.countLogingsPlace,
	rangeDate: state => state.rangeDate,
	periods: state => state.periods,
	periodsTable: state => {
		var periods = [];
		if (state.periods)
			state.periods.forEach(v => {
				periods.push({
					id: v._id,
					name: v.content,
					numberPassangerMax: v.numberPassangerMax,
				});
			});
		return periods;
	},
	namePlace: state => state.Places.find(c => c.value == state.place).text,
	places: state => state.Places,
	place: state => state.place,
};

export default getters;
