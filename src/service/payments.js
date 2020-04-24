import fetch from '@/service/fetch';

/*get the csv o pdf from the api response*/
/*arrayBuffer option prevents damaged file conversion in blob*/
const generateByFormatReport = async (placeId, format) => {
	return await fetch(`/payments/${placeId}/reports/${format}`, {
		method: 'get',
		responseType: 'arraybuffer',
	});
};

export { generateByFormatReport };
