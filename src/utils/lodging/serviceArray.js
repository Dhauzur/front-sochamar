export const generateServiceArray = place => {
	const temporaryArray = [];
	let serviceArray;
	place.services.forEach(() => {
		temporaryArray.push(1);
	});
	serviceArray = [temporaryArray, temporaryArray];
	return JSON.stringify(serviceArray);
};
