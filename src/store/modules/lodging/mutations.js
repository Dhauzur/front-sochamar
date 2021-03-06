import { DataSet } from 'vue2vis';
import moment from 'moment';
import { generateDaysArray } from '@/utils/lodging/daysArray';
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
	addPersonsLodging(state, value) {
		state.lodgingPersons.push(value);
		state.lodgings.update({
			id: state.lodgingSelect.id,
			persons: state.lodgingPersons,
		});
	},
	updatePersonsLodging(state, value) {
		state.lodgingPersons[value.index] = {
			id: value.id,
			idPerson: value.idPerson,
			group: value.group,
			dateStart: value.start,
			dateEnd: value.end,
			name: value.content,
		};
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
	//Esto pasa al editar el lodging
	dateChange(state, value) {
		let tempLodging = state.lodgingSelect;
		let tempLodgings = state.lodgings;
		state.lodgings = new DataSet([]);
		const startDate = moment(value.dateStart).hours(15);
		const endDate = moment(value.dateEnd).hours(12);

		tempLodgings.update({
			id: state.lodgingSelect.id,
			start: startDate,
			end: endDate,
		});

		const oldDays = state.lodgingSelect.days;
		//en base a los nuevos rangos de fecha, creamos un arreglo de dias
		const newDaysArray = generateDaysArray(this.selectedPlace, startDate, endDate);
		//Con el nuevo arreglo de dias generados, buscamos si existe un fecha que corresponda a un dia viejo
		//si existe un match entre ellos, la posicion del dia nuevo asignara al dia viejo.
		//Con esto logramos preservar la data existente si yo quisiera extender el lodging hacia la derecha o izquierda.
		const saveOldDaysServices = (oldDays, newDays) => {
			oldDays.forEach(oldDay => {
				const foundIndex = newDays.findIndex(newDay => newDay.date === oldDay.date);
				if (foundIndex >= 0) newDaysArray[foundIndex] = oldDay;
			});
		};
		saveOldDaysServices(oldDays, newDaysArray);

		tempLodgings.update({
			id: state.lodgingSelect.id,
			days: newDaysArray,
		});
		tempLodging.start = startDate;
		tempLodging.end = endDate;
		tempLodging.daysservice = newDaysArray;
		state.lodgingSelect = tempLodging;
		state.lodgings = tempLodgings;
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
			text: 'Todas los lugares',
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
		let foundLodging = state.lodgings.get({
			filter: item => item.id === lodgingId,
		});
		//BUG CON FALTA DE EXPLICACION: Por referenciacion de arrays, el value se replicaba en el resto del array days
		//Para evitar esta replicacion, se utilizo stringify - parse. Se sugiere volver a verificar funcionamiento erroneo
		let dayString = JSON.stringify(foundLodging[0].days[dayIndex]);
		let day = JSON.parse(dayString);
		day.services[serviceIndex].quantity = inputValue;
		foundLodging[0].days[dayIndex].services = day.services;
		foundLodging[0].days[dayIndex].dayTotal = dayTotal(foundLodging[0].days[dayIndex].services);
		state.lodgings.update({
			id: lodgingId,
			days: foundLodging[0].days,
		});
	},
	subDaysServices(state, { serviceName, lodgingId }) {
		const foundLodging = state.lodgings.get({
			filter: item => item.id === lodgingId,
		});
		if (serviceName === 'todos los servicios') {
			foundLodging[0].days.forEach(day => {
				day.services.forEach(service => {
					service.quantity = service.quantity - 1;
					if (service.quantity < 0) service.quantity = 0;
					day.dayTotal = dayTotal(day.services);
				});
			});
		} else {
			foundLodging[0].days.forEach(day => {
				day.services.forEach(service => {
					if (service.name === serviceName) {
						service.quantity = service.quantity - 1;
						if (service.quantity < 0) service.quantity = 0;
						day.dayTotal = dayTotal(day.services);
					}
				});
			});
		}
	},
	addDaysServices(state, { serviceName, lodgingId, lodgingGroup }) {
		const numberPassangerMax = state.periods.get(lodgingGroup).numberPassangerMax;
		const foundLodging = state.lodgings.get({
			filter: item => item.id === lodgingId,
		});
		if (serviceName === 'todos los servicios') {
			foundLodging[0].days.forEach(day => {
				day.services.forEach(service => {
					service.quantity = service.quantity + 1;
					if (service.quantity == null) service.quantity = 0;
					if (service.quantity >= numberPassangerMax)
						service.quantity = numberPassangerMax;
					day.dayTotal = dayTotal(day.services);
				});
			});
		} else {
			foundLodging[0].days.forEach(day => {
				day.services.forEach(service => {
					if (service.name === serviceName) {
						service.quantity = service.quantity + 1;
						if (service.quantity == null) service.quantity = 0;
						if (service.quantity >= numberPassangerMax)
							service.quantity = numberPassangerMax;
						day.dayTotal = dayTotal(day.services);
					}
				});
			});
		}
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
