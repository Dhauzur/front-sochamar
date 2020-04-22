import fetch from '@/service/fetch';

const generatePdfReport = async placeId => {
	return await fetch(`/payments/${placeId}/reports/pdf`, {
		method: 'get',
		responseType: 'arraybuffer',
	});
};

const generateCsvReport = async placeId => {
	return await fetch(`/payments/${placeId}/reports/csv`, {
		method: 'get',
		responseType: 'arraybuffer',
	});
};

export { generatePdfReport, generateCsvReport };
