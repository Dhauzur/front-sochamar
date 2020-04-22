import fetch from '@/service/fetch';

/**
 * Set form data person
 * @private
 * @param {Object} data
 * @return {FormData} payload
 */
const _setFormData = data => {
	let payload = new FormData();
	if (data.idCompany) payload.set('idCompany', data.idCompany);
	if (data.email) payload.set('email', data.email);
	if (data.firstName) payload.set('firstName', data.firstName);
	if (data.rut) payload.set('rut', data.rut);
	if (data.lastName) payload.set('lastName', data.lastName);
	if (data.age) payload.set('age', data.age.toString());
	if (data.birthdate) payload.set('birthdate', data.birthdate.toLowerCase());
	if (data.appointment) payload.set('appointment', data.appointment.toLowerCase());
	if (data.function) payload.set('function', data.function.toLowerCase());
	if (data.state) payload.set('state', data.state.toLowerCase());
	if (data.phone) payload.set('phone', data.phone.toLowerCase());
	if (data.region) payload.set('region', data.region);
	if (data.comuna) payload.set('comuna', data.comuna);
	if (data.avatar) payload.append('avatar', data.avatar);
	if (data.documents) {
		for (const index in data.documents) {
			if (!data.documents[index].url) payload.append('documents', data.documents[index]);
		}
	}
	return payload;
};

/**
 * Create a new person
 * @param {Object} data
 * @returns {Object} person
 */
const createPerson = async data => {
	const payload = _setFormData(data);
	const response = await fetch(`/persons/create`, {
		method: 'post',
		data: payload,
	});
	return response.person;
};

/**
 * Get person by id company
 * idcompany == a id user type admin
 * @param {string} idCompany
 * @returns {Object} person
 */
const getPersonsByCompany = async idCompany => {
	const response = await fetch(`/persons/${idCompany}`);
	return response.persons;
};

/**
 * Get person person by id
 * @param {string} id
 * @returns {Object} person
 */
const getPerson = async id => {
	const response = await fetch(`/person/${id}`);
	return response.person;
};

/**
 * Update person by id
 * @param {Object} data
 * @param {string} id
 * @returns {Object} person
 */
const putPerson = async (data, id) => {
	const payload = _setFormData(data);
	const response = await fetch(`/persons/${id}`, { method: 'put', data: payload });
	return response.person;
};

/**
 * Update person request
 * endpoint request handler
 * @param {Object} data
 * @returns {Object} response
 */
const pathRequest = async data => {
	const response = await fetch('/person/patchRequest', {
		method: 'patch',
		data: {
			email: data.email,
			newRequest: data.idProfile,
			companyName: data.company,
			cancel: data.cancel,
		},
	});
	return response;
};

/**
 * Delete person
 * @param {string} id
 * @returns {Object} response
 */
const deletePerson = async id => {
	const response = await fetch(`/persons/${id}`, { method: 'delete' });
	return response;
};

/**
 * Delete all person
 * @returns {Object} response
 */
const deleteAllPersons = async () => {
	const response = await fetch(`/persons/delete/all`, { method: 'delete' });
	return response;
};

const generatePdfReport = async companyId => {
	return await fetch(`/persons/${companyId}/reports/pdf`, {
		method: 'get',
		responseType: 'arraybuffer',
	});
};

const generateCsvReport = async companyId => {
	return await fetch(`/persons/${companyId}/reports/csv`, {
		method: 'get',
		responseType: 'arraybuffer',
	});
};

export {
	createPerson,
	pathRequest,
	getPerson,
	getPersonsByCompany,
	putPerson,
	deletePerson,
	deleteAllPersons,
	generatePdfReport,
	generateCsvReport,
};
