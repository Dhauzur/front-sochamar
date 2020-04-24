const getters = {
	message: state => state.message,
	persons: state => state.persons,
	personsResultSearch: state => state.search,
	loading: state => state.loading,
	personsAutoComplete: (rootGetters, state) => {
		return state.persons.map(p => {
			return {
				value: p._id,
				text: p.firstName + ' ' + (p.lastName ? p.lastName : ''),
			};
		});
	},
};

export default getters;
