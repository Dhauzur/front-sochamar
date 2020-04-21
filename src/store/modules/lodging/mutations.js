import moment from 'moment';
import { generateDaysArray } from '@/utils/lodging/daysArray';
import { dayTotal } from '@/utils/lodging/dayTotal';

const mutations = {
	setBottomSheet(state, value) {
		if (value.action && state.place && value.lodging) {
			state.lodgingSelect = state.lodgings.filter(lod => lod.id == value.lodging);
			state.bottomSheet = true;
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
		state.lodgings = state.lodgings.forEach(lod => {
			if (lod.id == state.lodgingSelect.id) lod.persons = state.lodgingPersons;
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
		state.lodgings = state.lodgings.forEach(lod => {
			if (lod.id == state.lodgingSelect.id) lod.persons = state.lodgingPersons;
		});
	},
	removeLodgingPersons(state, value) {
		state.lodgingPersons.splice(value, 1);
		state.lodgings = state.lodgings.forEach(lod => {
			if (lod.id == state.lodgingSelect.id) lod.persons = state.lodgingPersons;
		});
	},
	setUpdatingService(state, value) {
		state.updatingService = value;
	},
	addLodging(state, value) {
		if (!state.lodgings.filter(lod => lod.id == value.id)) state.lodgings.push(value);
	},
	setMirrorLodging(state, value) {
		state.mirrorLodging = value;
	},
	setDeletLodging(state, value) {
		state.editMode = false;
		state.lodgingSelect = null;
		state.lodgings = state.lodgings.filter(lod => lod.id != value.id);
		state.mirrorLodging = state.lodgings;
	},
	dateChange(state, value) {
		const startDate = moment(value.dateStart).hours(13);
		const endDate = moment(value.dateEnd).hours(9);
		state.lodgings = state.lodgings.forEach(lod => {
			if (lod.id == state.lodgingSelect.id) {
				lod.start = startDate;
				lod.end = endDate;
			}
		});
		const newDaysArray = generateDaysArray(this.selectedPlace, startDate, endDate);
		state.lodgingSelect.days.forEach(oldDay => {
			const foundIndex = newDaysArray.findIndex(newDay => newDay.date === oldDay.date);
			if (foundIndex >= 0) newDaysArray[foundIndex] = oldDay;
		});
		state.lodgings = state.lodgings.forEach(lod => {
			if (lod.id == state.lodgingSelect.id) lod.days = newDaysArray;
		});
		state.lodgingSelect.start = startDate;
		state.lodgingSelect.end = endDate;
		state.lodgingSelect.daysservice = newDaysArray;
	},
	setLodgingSelect(state, value) {
		if (state.lodgings.filter(lod => lod.id == value)) {
			state.lodgingSelect = state.lodgings.filter(lod => lod.id == value);
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
		const startDate = moment().hours(13);
		const endDate = moment()
			.hours(9)
			.add(1, 'day');
		state.lodgings.add({
			group: state.periods[0].id,
			start: startDate,
			end: endDate,
			content: state.placeName,
			days: generateDaysArray(state.place, startDate, endDate),
			place: state.place,
		});
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
				treeLevel: 1,
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
		state.lodgings = values;
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
