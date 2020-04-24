import fetch from '@/service/fetch';

/*get the pdf from the api response*/
/*arrayBuffer option prevents damaged file conversion in blob*/
const generatePdfReport = async placeId => {
	return await fetch(`/lodgings/${placeId}/reports/pdf`, {
		method: 'get',
		responseType: 'arraybuffer',
	});
};

/*get the csv from the api response*/
/*arrayBuffer option prevents damaged file conversion in blob*/
const generateCsvReport = async placeId => {
	return await fetch(`/lodgings/${placeId}/reports/csv`, {
		method: 'get',
		responseType: 'arraybuffer',
	});
};

/**
 * create new lodging
 * @param {Object} data to save
 * @return lodging
 */
const createLodging = async data => {
	const response = await fetch(`/lodging`, {
		method: 'post',
		data,
	});

	return response;
};

/**
 * update lodging
 * @param {id} id lodging
 * @param {data} data to update
 * @return lodging
 */
const updateLodging = async (id, data) => {
	const response = await fetch(`/lodging/:id`, {
		method: 'put',
		data,
	});

	return response;
};

export { generatePdfReport, generateCsvReport, createLodging, updateLodging };
