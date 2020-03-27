import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

export const generateDaysArray = (place, startDate, endDate) => {
	const range = moment.range(startDate, endDate);
	const arrayOfDates = Array.from(range.by('days'));
	const servicesArray = [];
	let daysArray = [];
	const startDay = {
		services: [],
		date: startDate.format('L'),
		dayTotal: 0,
	};
	const endDay = {
		services: [],
		date: endDate.format('L'),
		dayTotal: 0,
	};
	//formateo del serviceObject
	place.services.forEach(service => {
		const serviceObject = {
			name: service.name,
			quantity: 1,
			price: service.price,
		};
		servicesArray.push(serviceObject);
	});
	//si el rango es mayor a uno, significa que son fechas mayores a un dia de diferencia
	if (arrayOfDates.length > 1) {
		//push del primer dia
		startDay.services = servicesArray;
		daysArray.push(startDay);
		//recorremos el rando de fecha;
		arrayOfDates.forEach(date => {
			const dayObject = {
				services: [],
				date: date.format('L'),
				dayTotal: 0,
			};
			dayObject.services = servicesArray;
			daysArray.push(dayObject);
		});
		//push del ultimo  dia
		endDay.services = servicesArray;
		daysArray.push(endDay);
	} else {
		startDay.services = servicesArray;
		endDay.services = servicesArray;
		daysArray = [startDay, endDay];
	}

	return daysArray;
};
//vamos a necesitar la fecha del dia exacto
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
