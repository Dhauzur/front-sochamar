import { DataSet } from 'vue2vis';
import moment from 'moment';
import { findServiceIndexByName } from '@/utils/lodging/findServiceIndex';
import { generateDaysArray } from '@/utils/lodging/daysArray';
import { generateSingleDay } from '@/utils/lodging/daysArray';
import { dayTotal } from '@/utils/lodging/dayTotal';

const mutations = {
	setBottomSheet(state, value) {
		if (value.action && state.place && value.lodging) {
			setTimeout(() => {
				state.lodgingSelect = state.lodgings.get(value.lodging);
				state.bottomSheet = true;
			}, 1000);
		} else state.bottomSheet = true;
		if (!value.action) state.bottomSheet = false;
	},
	setMessage(state, value) {
		state.message = value;
	},
	setAllLodgingPersons(state, values) {
		state.lodgingPersons = values;
	},
	updateLodgingPersons(state, value) {
		state.lodgingPersons.push(value);
		state.lodgings.update({
			id: state.lodgingSelect.id,
			persons: state.lodgingPersons,
		});
	},
	removeLodgingPersons(state, value) {
		state.lodgingPersons.splice(value, 1);
		state.lodgings.update({
			id: state.lodgingSelect.id,
			persons: state.lodgingPersons,
		});
	},
	setUpdatingService(state, value) {
		state.updatingService = value;
	},
	addLodging(state, value) {
		if (!state.lodgings.get(value.id)) state.lodgings.add(value);
	},
	setMirrorLodging(state, value) {
		state.mirrorLodging = value;
	},
	setDeletLodging(state, value) {
		let tempLodgings = state.lodgings;
		state.editMode = false;
		state.lodgingSelect = null;
		state.lodgings = new DataSet([]);
		tempLodgings.remove(value.id);
		state.lodgings = tempLodgings;
		state.mirrorLodging = JSON.stringify(state.lodgings);
	},
	//Esto pasa al editar el lodging, comentar todo mientras pasamos a la nueva estructura
	dateChange(state, value) {
		console.log('trigger de detectChange');
		let tempLodging = state.lodgingSelect;
		let tempLodgings = state.lodgings;
		state.lodgings = new DataSet([]);
		tempLodgings.update({
			id: state.lodgingSelect.id,
			start: moment(value.dateStart).hours(15),
			end: moment(value.dateEnd).hours(12),
		});

		let newDays = [];
		let numberDays = moment(value.dateEnd).diff(
			moment(value.dateStart).format('YYYY-MM-DD'),
			'days'
		);
		const oldDays = state.lodgingSelect.days;
		//Algoritmo
		//1- el contador i esta contando la nueva cantidad de dias, recorre el primer acceso service[i].
		//3- entonces, por cada dia se vas pushear un nuevo arreglo en service.
		//4- Si existe algo en la posicion, procedemos a hacer map con la condicion de  existeValor ? retorna valor : returna un numero default 1.
		//5- si no existe el dia en la posicion service[i], generamos un arreglo de service pero sin volverlo string.
		const generateNewDays = oldDay => {
			if (oldDay) {
				//por evaluar si debemos controlar el valor quantity con un ternario
				//este valor ya esta definido antes de llegar a este codigo
				return oldDay;
			} else {
				return generateSingleDay(this.selectedPlace);
			}
		};
		//TRANSPORTAR LA MISMA LOGICA DE ONMOVE ACA
		for (let i = 0; i <= numberDays; i++) {
			const newDay = generateNewDays(oldDays[i]);
			newDays.push(newDay);
		}

		tempLodgings.update({
			id: state.lodgingSelect.id,
			days: newDays,
		});
		tempLodging.start = moment(value.dateStart).hours(15);
		tempLodging.end = moment(value.dateEnd).hours(12);
		tempLodging.daysservice = newDays;
		state.lodgingSelect = tempLodging;
		state.lodgings = tempLodgings;
	},
	subOneService(state, serviceSelected) {
		let tempLodging = state.lodgingSelect;
		state.lodgingSelect = null;
		let service = JSON.parse(tempLodging.service[0]);
		let numberDays = moment(tempLodging.end).diff(
			moment(tempLodging.start).format('YYYY-MM-DD'),
			'days'
		);
		//el primer for nos indica que por cada dia modificara una posicion de service;
		for (let i = 0; i <= numberDays; i++) {
			//este forEach se encarga de recorrer todos los valores actuales de ese dia
			//de ser null, el valor de ese service queda en 0;
			service[i].forEach((singleService, index) => {
				if (singleService.quantity == null) service[i][index].quantity = 8;
			});
			//algoritmo
			//1- si seleccionamos un servicio, buscar el index de este y con esto tendriamos la posicion de service para alterar su valor
			//2- si el valor es 'todos los servicios' o un valor numerico que represente esta accion, hacer un foreach de service[i]
			// y con esto podriamos alterar todos los valores
			if (serviceSelected === 'todos los servicios') {
				service[i].forEach((singleService, index) => {
					service[i][index].quantity = singleService.quantity - 1;
				});
			} else {
				const foundIndex = findServiceIndexByName(serviceSelected, service[i]);
				service[i][foundIndex].quantity = service[i][foundIndex].quantity - 1;
			}

			//si el service fuera 0 y entra en esta funcion, este forEach esta evitando que registre valores negativos
			service[i].forEach((singleService, index) => {
				if (singleService.quantity < 0) service[i][index].quantity = 0;
			});
		}
		tempLodging.service[0] = JSON.stringify(service);
		state.lodgingSelect = tempLodging;
	},
	addOneService(state, serviceSelected) {
		let tempLodging = state.lodgingSelect;
		const numberPassangerMax = state.periods.get(state.lodgingSelect.group).numberPassangerMax;
		state.lodgingSelect = null;
		let service = JSON.parse(tempLodging.service[0]);
		let numberDays = moment(tempLodging.end).diff(
			moment(tempLodging.start).format('YYYY-MM-DD'),
			'days'
		);
		for (let i = 0; i <= numberDays; i++) {
			//Este foreach esta evaluando si algun valor excede o es igual a la cantidad maxima de pasajeros
			// va ser necesario volver a hacer esta logica, esta interfiriendo gravemente con otros services al momento de añadir en uno
			// ejemplo: almuerzo: 0 once: 1 desayuno 0, añado un uso a desayuno entonces este foreach es ejecutado
			// al ejectuarse va evaluar todos los servicios y si encuentra uno igual o mayor a la cantidad de pasajeros, lo va volver 0
			// entonces nuestro servicio once o cualquier servicio externo a desayuno va cambiar su valor a 0

			//Tal vez este foreach es mejor dejarlo para el caso todos los 'servicios'
			//para evaluar un servicio especifico, copiar las condiciones del foreach y aprovechar la busqueda de index que tenemos en el else
			service[i].forEach((singleService, index) => {
				if (singleService.quantity == null) service[i][index].quantity = 0;
				if (singleService.quantity >= numberPassangerMax) service[i][index].quantity = 0;
			});
			//Algoritmo
			//1- si el servicio seleccionado es 'todos los servicios', entonces procedemos a actualizar el valor de todos los servicios
			//2- en caso contrario, es un servicio seleccionado en especifico y en base a su nombre procedemos a buscar el index a modificar
			if (serviceSelected === 'todos los servicios') {
				service[i].forEach((singleService, index) => {
					service[i][index].quantity = singleService.quantity + 1;
				});
			} else {
				const foundIndex = findServiceIndexByName(serviceSelected, service[i]);
				service[i][foundIndex].quantity = service[i][foundIndex].quantity + 1;
			}
		}
		tempLodging.service[0] = JSON.stringify(service);
		state.lodgingSelect = tempLodging;
	},
	setLodgingSelect(state, value) {
		if (state.lodgings.get(value)) {
			state.lodgingSelect = state.lodgings.get(value);
		}
	},
	setLoading(state, value) {
		state.loading = value;
	},
	setModeEdit(state, value) {
		state.editMode = value;
		if (!value) state.lodgingSelect = null;
	},
	createOneLodging(state) {
		state.editMode = false;
		let place = state.Places.find(c => c.value === state.place);
		let verificate = true;
		const startDate = moment().hours(15);
		const endDate = moment()
			.hours(12)
			.add(1, 'day');
		const generatedDays = generateDaysArray(place, startDate, endDate);
		state.lodgings.forEach(lod => {
			if (
				lod.group == state.periods.getIds()[0] &&
				moment().isSameOrAfter(moment(lod.start)) &&
				moment()
					.add(1, 'day')
					.isSameOrBefore(moment(lod.end))
			)
				verificate = false;
		});
		if (verificate) {
			if (place.text === 'Turismo') {
				state.lodgings.add({
					group: state.periods.getIds()[0],
					start: startDate,
					end: endDate,
					content: state.placeName,
					days: generatedDays,
					place: state.place,
				});
			} else {
				state.lodgings.add({
					group: state.periods.getIds()[0],
					start: startDate,
					end: endDate,
					content: state.placeName,
					days: generatedDays,
					place: state.place,
				});
			}
		} else {
			state.message = {
				type: 'default',
				text: 'Existe un alojamiento para esas fechas ',
			};
		}
	},
	setPlaceLodging(state, value) {
		state.place = value;
	},
	setPlaces(state, values) {
		let Places = [];
		Places.push({
			value: null,
			text: 'Todas las empresas',
		});
		if (values) {
			const mapValues = values.map(v => {
				return {
					value: v._id,
					text: v.name,
					prices: v.prices,
					services: v.services,
				};
			});
			Places.push(...mapValues);
		}
		state.Places = Places;
	},
	updateActualService(state, { inputValue, lodgingId, dayIndex, serviceIndex }) {
		const foundLodging = state.lodgings.get({
			filter: item => item.id === lodgingId,
		});
		//En base al dia y index de servicio actualizamos la cantidad
		//get de vis dataSet siempre nos devuelve un arreglo con objetos, en este caso es solo 1 por eso siempre usar la posicion 0 para este caso
		foundLodging[0].days[dayIndex].services[serviceIndex].quantity = inputValue;
		//como cambiamos un valor en especifico, podemos actualizar el valor de dayTotal
		foundLodging[0].days[dayIndex].dayTotal = dayTotal(foundLodging[0].days[dayIndex].services);
		//En base a la id del lodging actualizaremos la propiedad days
		state.lodgings.update({
			id: lodgingId,
			days: foundLodging[0].days,
		});
	},
	subDaysServices(state, { serviceName, lodgingId }) {
		const foundLodging = state.lodgings.get({
			filter: item => item.id === lodgingId,
		});
		foundLodging[0].days.forEach(day => {
			day.services.forEach(service => {
				if (service.name === serviceName) {
					service.quantity = service.quantity - 1;
					if (service.quantity < 0) service.quantity = 0;
				}
			});
		});
	},
	addDaysServices(state, { serviceName, lodgingId }) {
		const numberPassangerMax = 1;
		const foundLodging = state.lodgings.get({
			filter: item => item.id === lodgingId,
		});
		foundLodging[0].days.forEach(day => {
			day.services.forEach(service => {
				if (service.name === serviceName) {
					service.quantity = service.quantity + 1;
					if (service.quantity == null) service.quantity = 0;
					if (service.quantity > numberPassangerMax) service.quantity = 0;
				}
			});
		});
	},
	setPeriods(state, values) {
		state.periods = new DataSet([]);
		const dataSet = new DataSet([]);
		const mappedValues = values.map(period => {
			return {
				id: period._id,
				content: period.name,
				numberPassangerMax: period.numberPassangerMax,
				place: period.place,
			};
		});
		dataSet.add(mappedValues);
		setTimeout(() => (state.periods = dataSet), 1);
	},
	setRangeDate(state, value) {
		state.rangeDate = value;
	},
	setRangeDatePayments(state, value) {
		let start = value.map(item => item.start);
		let end = value.map(item => item.end);
		var min = start.reduce(function(a, b) {
			return a < b ? a : b;
		});
		var max = end.reduce(function(a, b) {
			return a > b ? a : b;
		});
		state.rangeDatePayments = { startDate: min, endDate: max };
	},
	setLodgingsPlace(state, value) {
		state.lodgingsPlace = value;
	},
	setcountLogingsPlace(state, value) {
		state.countLogingsPlace = value;
	},
	setLodgings(state, values) {
		let tempLodging = state.lodgings;
		state.editMode = false;
		state.lodgings = new DataSet([]);
		if (values) {
			tempLodging = new DataSet([]);
			const evaluateLodgingPush = (lodging, place) => {
				if (state.place) {
					if (state.place === lodging.place)
						tempLodging.add({
							id: lodging.id,
							group: lodging.group,
							start: moment(lodging.start).hours(15),
							end: moment(lodging.end).hours(12),
							content: place.text,
							days: lodging.days,
							place: lodging.place,
							persons: lodging.persons,
							mountTotal: lodging.mountTotal,
						});
				} else {
					tempLodging.add({
						id: lodging.id,
						group: lodging.group,
						start: moment(lodging.start).hours(15),
						end: moment(lodging.end).hours(12),
						content: place.text,
						days: lodging.days,
						place: lodging.place,
						persons: lodging.persons,
						mountTotal: lodging.mountTotal,
					});
				}
			};
			values.forEach(v => {
				let place = state.Places.find(c => c.value == v.place);
				/*Necesitamos seguir corriendo esta funcion aun si place es undefined
				 * si es undefined, entonces creamos un objeto basico con la propiedad text.
				 * Con esto evitamos el mensaje de 'place.text' is undefined en la interfaz de usuario*/
				if (!place) place = { text: '' };
				evaluateLodgingPush(v, place);
			});
			state.lodgings = tempLodging;
			state.mirrorLodging = JSON.stringify(tempLodging);
		} else state.lodgings = new DataSet([]);
	},
	setSelectedPlace(state) {
		state.selectedPlace = state.Places.find(place => place.value === state.place);
	},
	//esto nos va servir en las cards
	setServicesComboBox(state) {
		const allServicesObject = {
			text: 'todos los servicios',
			value: 'todos los servicios',
		};
		const comboBoxArray = [];
		comboBoxArray.push(allServicesObject);
		//Si services existe significa que un place fue seleccionado, entonces procedemos a generar el arreglo de comboBoxServices
		//si services no existe significa que se selecciono 'Todas las empresas'  entonces servicesComboBox va ser un arreglo vacio,
		//ya qua no vamos a añadir o disminuir servicios en esa parte
		if (state.selectedPlace.services) {
			const comboBoxServices = state.selectedPlace.services.map(service => {
				return {
					text: service.name,
					value: service.name,
				};
			});
			comboBoxArray.push(...comboBoxServices);
			state.servicesComboBox = comboBoxArray;
		} else {
			state.servicesComboBox = [];
		}
	},
};

export default mutations;
