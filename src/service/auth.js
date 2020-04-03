import fetch from '@/service/fetch';

/**
 * Login user
 * @param {Object} data
 */
const login = async data => {
	const url = '/auth/login';
	const response = await fetch(url, {
		method: 'post',
		data,
	});
	setToken(response.token);
	return response;
};

/**
 * register user
 * @param {Object} data
 */
const register = async data => {
	const url = '/auth/register';
	const response = await fetch(url, {
		method: 'post',
		data,
	});
	setToken(response.token);
	return response;
};

/**
 * Update password
 * @param {Object} data
 */
const updatePassword = async (token, password) => {
	const url = '/auth/user/password';
	setToken(token);
	const response = await fetch(url, {
		method: 'put',
		data: password,
	});
	logout();
	return response;
};

/**
 * Recovery password
 * @param {Object} data
 */
const requestPasswordRecoverEmail = async data => {
	const url = '/auth/send/passwordRecover';
	const response = await fetch(url, {
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
	login,
	register,
	updatePassword,
	requestPasswordRecoverEmail,
	isAuthenticated,
	getToken,
	setToken,
	logout,
};
