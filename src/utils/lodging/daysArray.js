export const generateDaysArray = place => {
	const servicesArray = [];
	let daysArray;
	const dayObject = {
		services: [],
		//una idea que tengo es pasarle el start y end del lodging y por cada dia entre estos rangos generar un objeto
		//dayObject, con esto tendriamos la fecha exacta del dia
		date: 'por definir',
		dayTotal: 0,
	};
	place.services.forEach(service => {
		const serviceObject = {
			name: service.name,
			quantity: 1,
			price: service.price,
		};
		servicesArray.push(serviceObject);
	});
	dayObject.services = servicesArray;
	daysArray = [dayObject, dayObject];
	return daysArray;
};
export const generateSingleDay = place => {
	const servicesArray = [];
	const dayObject = {
		services: [],
		//una idea que tengo es pasarle el start y end del lodging y por cada dia entre estos rangos generar un objeto
		//dayObject, con esto tendriamos la fecha exacta del dia
		date: 'por definir',
		dayTotal: 0,
	};
	place.services.forEach(service => {
		const serviceObject = {
			name: service.name,
			quantity: 1,
			price: service.price,
		};
		servicesArray.push(serviceObject);
	});
	dayObject.services = servicesArray;
	return dayObject;
};
