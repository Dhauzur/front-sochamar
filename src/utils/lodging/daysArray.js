import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { dayTotal } from './dayTotal';
const moment = extendMoment(Moment);

export const generateDaysArray = (place, startDate, endDate) => {
	const range = moment.range(startDate, endDate);
	const arrayOfDates = Array.from(range.by('days'));
	const servicesArray = [];
	let daysArray = [];

	//formateo del serviceObject
	place.services.forEach(service => {
		const serviceObject = {
			name: service.name,
			quantity: 1,
			price: service.price,
		};
		servicesArray.push(serviceObject);
	});

	const startDay = {
		services: servicesArray,
		date: startDate.format('DD-MM-YYYY'),
		dayTotal: dayTotal(servicesArray),
	};
	const endDay = {
		services: servicesArray,
		date: endDate.format('DD-MM-YYYY'),
		dayTotal: dayTotal(servicesArray),
	};
	//si el rango es mayor a uno, significa que son fechas mayores a un dia de diferencia
	//en caso contrario, significa que son solo un dia, se procede a crear el arreglo con startDay y endDay
	if (arrayOfDates.length > 1) {
		arrayOfDates.forEach(date => {
			const dayObject = {
				services: servicesArray,
				date: date.format('DD-MM-YYYY'),
				dayTotal: dayTotal(servicesArray),
			};
			daysArray.push(dayObject);
		});
		//el rango no cuenta con el dia final, entonces hacemos push de el cuando el foreach terminer
		daysArray.push(endDay);
	} else {
		daysArray = [startDay, endDay];
	}

	return daysArray;
};
//vamos a necesitar la fecha del dia exacto
export const generateSingleDay = (place, dayDate) => {
	const servicesArray = [];
	const dayObject = {
		services: [],
		date: dayDate.format('DD-MM-YYYY'),
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
	dayObject.dayTotal = dayTotal(servicesArray);
	return dayObject;
};
