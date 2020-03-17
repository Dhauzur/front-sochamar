export const generateServiceArray = place => {
	const temporalArray = [];
	let serviceArray;
	place.services.forEach(() => {
		temporalArray.push(1);
	});
	serviceArray = [temporalArray, temporalArray];
	return JSON.stringify(serviceArray);
};
