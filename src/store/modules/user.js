const state = {
	message: '',
	profile: {},
};

const getters = {
	errorMessage: state => state.message,
	user: state => state.user,
};

const actions = {
	fetchProfile: ({ commit }) => {
		console.log(commit);
		const profile = { name: 'hola mundo' };
		commit('setProfile', profile);
	},
};

const mutations = {
	setProfile: (state, profile) => (state.profile = profile),
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
