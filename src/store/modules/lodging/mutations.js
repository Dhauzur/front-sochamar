import { DataSet } from 'vue2vis';
import moment from 'moment';
import { findServiceIndexByName } from '@/utils/lodging/findServiceIndex';
import { generateServiceArray } from '@/utils/lodging/serviceArray';

const mutations = {
	setBottomSheet(state, value) {
		if (value.action && state.place && value.lodging) {
			setTimeout(() => {
				state.lodgingSelect = state.lodgings.get(value.lodging);
				state.bottomSheet = true;
				console.log('OKs');
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
	//Elimina de dataset del front, un hospedaje
	setDeletLodging(state, value) {
		let tempLodgings = state.lodgings;
		state.editMode = false;
		state.lodgingSelect = null;
		state.lodgings = new DataSet([]);
		tempLodgings.remove(value.id);
		state.lodgings = tempLodgings;
		state.mirrorLodging = JSON.stringify(state.lodgings);
	},
	dateChange(state, value) {
		let tempLodging = state.lodgingSelect;
		let tempLodgings = state.lodgings;
		state.lodgings = new DataSet([]);
		tempLodgings.update({
			id: state.lodgingSelect.id,
			start: moment(value.dateStart).hours(15),
			end: moment(value.dateEnd).hours(12),
		});
		let service = [];
		let numberDays = moment(value.dateEnd).diff(
			moment(value.dateStart).format('YYYY-MM-DD'),
			'days'
		);
		let oldService = JSON.parse(state.lodgingSelect.service[0]);
		//Algoritmo
		//1- el contador i esta contando la nueva cantidad de dias, recorre el primer acceso service[i].
		//3- entonces, por cada dia se vas pushear un nuevo arreglo en service.
		//4- Si existe algo en la posicion, procedemos a hacer map con la condicion de  existeValor ? retorna valor : returna un numero default 1.
		//5- si no existe el dia en la posicion service[i], generamos un arreglo de service pero sin volverlo string.
		const servicesIndex = state.selectedPlace.services.length;
		const generateNewServices = oldServices => {
			if (oldServices) {
				return oldServices.map(service => {
					return service ? service : 1;
				});
			} else {
				let defaultServices;
				let temporaryArray = [];
				for (let i = 0; i < servicesIndex; i++) {
					temporaryArray.push(1);
				}
				defaultServices = temporaryArray;
				return defaultServices;
			}
		};

		for (let i = 0; i <= numberDays; i++) {
			const newServices = generateNewServices(oldService[i]);
			service.push(newServices);
		}

		let itemService = [];
		itemService.push(JSON.stringify(service));
		tempLodgings.update({
			id: state.lodgingSelect.id,
			service: itemService,
		});
		tempLodging.start = moment(value.dateStart).hours(15);
		tempLodging.end = moment(value.dateEnd).hours(12);
		tempLodging.service = itemService;
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
				if (singleService == null) service[i][index] = 0;
			});
			//algoritmo
			//1- si seleccionamos un servicio, buscar el index de este y con esto tendriamos la posicion de service para alterar su valor
			//2- si el valor es 'todos los servicios' o un valor numerico que represente esta accion, hacer un foreach de service[i]
			// y con esto podriamos alterar todos los valores
			if (serviceSelected === 'todos los servicios') {
				service[i].forEach((singleService, index) => {
					service[i][index] = singleService - 1;
				});
			} else {
				const foundIndex = findServiceIndexByName(
					serviceSelected,
					state.selectedPlace.services
				);
				service[i][foundIndex] = service[i][foundIndex] - 1;
			}

			//si el service fuera 0 y entra en esta funcion, este forEach esta evitando que registre valores negativos
			service[i].forEach((singleService, index) => {
				if (singleService < 0) service[i][index] = 0;
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
			service[i].forEach((singleService, index) => {
				if (singleService == null) service[i][index] = 0;
				if (singleService >= numberPassangerMax) service[i][index] = 0;
			});
			//Algoritmo
			//1- si el servicio seleccionado es 'todos los servicios', entonces procedemos a actualizar el valor de todos los servicios
			//2- en caso contrario, es un servicio seleccionado en especifico y en base a su nombre procedemos a buscar el index a modificar
			if (serviceSelected === 'todos los servicios') {
				service[i].forEach((singleService, index) => {
					service[i][index] = singleService + 1;
				});
			} else {
				const foundIndex = findServiceIndexByName(
					serviceSelected,
					state.selectedPlace.services
				);
				service[i][foundIndex] = service[i][foundIndex] + 1;
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
		const generatedService = generateServiceArray(place);
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
					start: moment().hours(15),
					end: moment()
						.hours(12)
						.add(1, 'day'),
					content: state.placeName,
					service: [generatedService],
					place: state.place,
				});
			} else {
				state.lodgings.add({
					group: state.periods.getIds()[0],
					start: moment().hours(15),
					end: moment()
						.hours(12)
						.add(1, 'day'),
					content: state.placeName,
					service: [generatedService],
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
	updateService(state, value) {
		state.updatingService = null;
		let idValue = value.id.split(',')[0];
		let dateValue = value.id.split(',')[1];
		let newService = [];
		//Si el value existe, se inicia el proceso de actualizar service
		if (value) {
			state.lodgings.forEach(l => {
				//Si la id de value coincide con un lodging, se continua el proceso de actualizar service
				if (idValue === l.id) {
					let numberDays = moment(l.end).diff(
						moment(l.start).format('YYYY-MM-DD'),
						'days'
					);
					//generalmente numberDay siempre va ser 1
					for (let i = 0; i <= numberDays; i++) {
						//si la fecha de value es igual a la fecha del lodging
						if (
							moment(l.start)
								.add(i, 'day')
								.format('YYYY-MM-DD') === dateValue
						) {
							//se obtiene el arreglo de service
							let service = JSON.parse(l.service[0]);
							//service[i] nos indica que va tocar el service de un dia
							//la segunda posicion de service[i][] corresponde al servicio a modificar

							//la cantidad de service y placeServices son iguales, si encontramos el index de placeServices
							//sabremos que posicion de service modificar
							const foundIndex = findServiceIndexByName(
								value.name,
								state.selectedPlace.services
							);
							//En base al index encontrado y el dia, procedemos a actualizar el valor
							service[i][foundIndex] = parseInt(value.value);
							newService.push(JSON.stringify(service));
							state.editMode = false;
							//El lodging es modificado y el nuevo servicio queda registado
							state.lodgings.update({
								id: l.id,
								service: newService,
							});
							state.editMode = true;
						}
					}
				}
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
							service: lodging.service,
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
						service: lodging.service,
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
