import fetch from '@/service/fetch';

const generatePdfReport = async placeId => {
	return await fetch(`/lodgings/${placeId}/reports/pdf`, {
		method: 'get',
		responseType: 'arraybuffer',
	});
};

export { generatePdfReport };
