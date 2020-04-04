import axios from 'axios';
import { api as baseURL } from '@/config/index.js';
import { isAuthenticated, getToken } from '@/service/auth';
import router from '@/router/index.js';

export const api = axios.create({
	baseURL,
});

// interceptor status (401, 403) access denied to api
api.interceptors.response.use(
	response => response,
	error => {
		if (error.response.status === 403) {
			router.replace({ name: 'profile' });
		}
		if (error.response.status === 401) {
			router.replace({ name: 'auth' });
		}
		return error;
	}
);

/**
 * Performs api calls sending the required authentication headers
 * @param {String} url
 * @param {Object} options
 */
const fetch = async (url, options) => {
	const headers = {};

	// Setting Authorization header
	// authorization: xxxxxxx.xxxxxxxx.xxxxxx
	if (isAuthenticated()) {
		headers['Authorization'] = `Bearer ${getToken()}`;
	}

	const response = await api(url, {
		headers,
		...options,
	});
	const res = await _checkStatus(response);
	return res.data;
};

/**
 * checkstatus of the api response
 * @param {Object} response
 * @return {Object} response || error
 * @private
 */
const _checkStatus = response => {
	// raises an error in case response status is not a success
	if (response.status >= 200 && response.status < 300) {
		// Success status lies between 200 to 300
		return response;
	} else {
		throw response;
	}
};

export default fetch;
