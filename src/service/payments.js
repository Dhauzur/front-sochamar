import fetch from '@/service/fetch';

/*get the pdf from the api response*/
/*arrayBuffer option prevents damaged file conversion in blob*/
const generatePdfReport = async placeId => {
	return await fetch(`/payments/${placeId}/reports/pdf`, {
		method: 'get',
		responseType: 'arraybuffer',
	});
};

/*get the csv from the api response*/
/*arrayBuffer option prevents damaged file conversion in blob*/
const generateCsvReport = async placeId => {
	return await fetch(`/payments/${placeId}/reports/csv`, {
		method: 'get',
		responseType: 'arraybuffer',
	});
};
const generateFormatReport = async (placeId, format) => {
	return await fetch(`/payments/${placeId}/reports/${format}`, {
		method: 'get',
		responseType: 'arraybuffer',
	});
};

export { generatePdfReport, generateCsvReport, generateFormatReport };
