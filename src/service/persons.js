import fetch from '@/service/fetch';

/**
 * Create a new person
 * @param {Object} data
 * @returns {Object} person
 */
const createPerson = async data => {
	const response = await fetch(`/persons/create`, {
		method: 'post',
		data,
	});
	return response.person;
};

const getPersonsByCompany = async idCompany => {
	const response = await fetch(`/persons/${idCompany}`);
	return response.persons;
};

const getPerson = async id => {
	const response = await fetch(`/person/${id}`);
	return response.person;
};

const putPerson = async (data, id) => {
	const response = await fetch(`/persons/${id}`, { method: 'put', data });
	return response.person;
};

const pathRequest = async data => {
	const response = await fetch('/person/patchRequest', {
		method: 'patch',
		data: { email: data.email, newRequest: data.idProfile, cancel: data.cancel },
	});
	return response;
};

const deletePerson = async id => {
	const response = await fetch(`/persons/${id}`, { method: 'delete' });
	return response;
};

const deleteAllPersons = async () => {
	const response = await fetch(`/persons/delete/all`, { method: 'delete' });
	return response;
};

export {
	createPerson,
	pathRequest,
	getPerson,
	getPersonsByCompany,
	putPerson,
	deletePerson,
	deleteAllPersons,
};
