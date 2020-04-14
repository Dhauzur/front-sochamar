import fetch from '@/service/fetch';

/**
 * Login user
 * @param {Object} data
 * @returns {Object}
 */
const login = async data => {
	const response = await fetch('/auth/login', {
		method: 'post',
		data,
	});
	setToken(response.token);
	return response;
};

/**
 * register user
 * @param {Object} data
 * @returns {Object}
 */
const register = async data => {
	const response = await fetch('/auth/register', {
		method: 'post',
		data,
	});
	setToken(response.token);
	return response;
};

/**
 * Update password
 * @param {Object} data
 * @returns {Object}
 */
const updatePassword = async (token, password) => {
	setToken(token);
	const response = await fetch('/auth/user/password', {
		method: 'put',
		data: password,
	});
	logout();
	return response;
};

/**
 * Recovery password
 * @param {Object} data
 * @returns {Object}
 */
const requestPasswordRecoverEmail = async data => {
	const response = await fetch('/auth/send/passwordRecover', {
		method: 'put',
		data,
	});

	return response;
};

/**
 * Save token user at localStorage
 * @param {String} idToken
 */
const setToken = token => {
	localStorage.setItem('token', token);
};

/**
 * Retrieves the user token from localStorage
 * @return {Object} all data of the token
 */
const getToken = () => {
	return localStorage.getItem('token');
};

/**
 * Checks if there is a saved token and it's still valid
 * @return {Boolean} isAuthenticated
 */
const isAuthenticated = () => {
	const token = getToken(); // Getting token from localstorage
	return !!token; // handwaiving here
};

/**
 * Clear user token and profile data from localStorage
 */
const logout = () => {
	localStorage.removeItem('token');
};

export {
	getToken,
	isAuthenticated,
	login,
	logout,
	register,
	requestPasswordRecoverEmail,
	setToken,
	updatePassword,
};
