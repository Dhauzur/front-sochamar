export const generateServiceArray = place => {
	const temporaryArray = [];
	let serviceArray;
	place.services.forEach(service => {
		const serviceObject = {
			name: service.name,
			quantity: 1,
			servicePrice: service.price,
		};
		temporaryArray.push(serviceObject);
	});
	//al final del forEach, pushear el index deleteServicesTotalPrices
	serviceArray = [temporaryArray, temporaryArray];
	return JSON.stringify(serviceArray);
};
export const generateSingleServiceArray = place => {
	const temporaryArray = [];
	place.services.forEach(service => {
		const serviceObject = {
			name: service.name,
			quantity: 1,
			servicePrice: service.price,
		};
		temporaryArray.push(serviceObject);
	});
	//al final del forEach, pushear el index deleteServicesTotalPrices
	return temporaryArray;
};
