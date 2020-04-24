const mutations = {
	setPersons(state, value) {
		state.persons = value;
	},
	setSearchPersons(state, value) {
		state.search = value;
	},
	setMessage(state, value) {
		state.message = value;
		setTimeout(() => {
			state.message = '';
		}, 300);
	},
	setLoading(state, value) {
		state.loading = value;
	},
};

export default mutations;
