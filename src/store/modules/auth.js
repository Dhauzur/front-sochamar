import { api } from '@/config/index.js';
import Axios from 'axios';

const state = {
	errorMessage: '',
};

const getters = {
	errorMessage: state => state.errorMessage,
};

const actions = {};

const mutations = {};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
