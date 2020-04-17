import fetch from '@/service/fetch';

const generatePdfReport = async () => {
	return await fetch('/payments/reports/pdf', { method: 'get', responseType: 'arraybuffer' });
};

export { generatePdfReport };
