import { api } from '@/config/index.js';
import axios from 'axios';
import moment from 'moment';
import { DataSet } from 'vue2vis';
import router from '@/router/index.js';

const state = {
	message: '',
	updatingService: null,
	mirrorLodging: null,
	lodgingSelect: null,
	loading: false,
	editMode: false,
	lodgings: new DataSet([]),
	periods: new DataSet([]),
	Places: [],
	lodgingPersons: [],
	place: null,
	rangeDatePayments: {},
	lodgingsPlace: [],
	countLogingsPlace: 0,
	rangeDate: {
		start: null,
		end: null,
	},
};

const getters = {
	message: state => state.message,
	lodgingPersons: state => state.lodgingPersons,
	updatingService: state => state.updatingService,
	mirrorLodging: state => state.mirrorLodging,
	lodgingSelect: state => state.lodgingSelect,
	loading: state => state.loading,
	editMode: state => state.editMode,
	lodgings: state => state.lodgings,
	rangeDatePayments: state => state.rangeDatePayments,
	lodgingsPlace: state => state.lodgingsPlace,
	countLogingsPlace: state => state.countLogingsPlace,
	rangeDate: state => state.rangeDate,
	periods: state => state.periods,
	places: state => state.Places,
	place: state => state.place,
};

const actions = {
	/**
	 * delete a lodging
	 */
	async deleteLodging({ commit }, value) {
		try {
			commit('setLoading', 'Eliminando hospedaje...');
			await axios.delete(`${api}/lodging/delete/place/${value.id}`);
			commit('setLoading', '');
			commit('setDeletLodging', value);
			commit('setMessage', {
				type: 'default',
				text: 'Hospedaje eliminado ',
			});
		} catch (error) {
			commit('setMessage', {
				type: 'error',
				text: 'Delete lodging ' + error,
			});
			if (error.message == 'Request failed with status code 401') router.push('/login');
		}
	},
	/**
	 * get all places
	 */
	async fetchPlace({ commit }) {
		try {
			commit('setModeEdit', false);
			commit('setPlaces', null);
			commit('setLoading', 'Cargando lugares...');
			const response = await axios.get(`${api}/place`);
			commit('setLoading', '');
			commit('setPlaces', response.data.place);
			commit('setMessage', {
				type: 'success',
				text: 'lugares descargados',
			});
		} catch (error) {
			commit('setPlaces', null);
			commit('setMessage', {
				type: 'error',
				text: 'Fetch place ' + error,
			});
			if (error.message == 'Request failed with status code 401') router.push('/login');
		}
	},
	/**
	 * get all lodgings
	 */
	async fetchLodgings({ commit }) {
		try {
			commit('setLoading', 'Cargando hospedajes...');
			commit('setModeEdit', false);
			commit('setLodgings', null);
			const response = await axios.get(api + '/lodgings');
			commit('setLoading', '');
			commit('setLodgings', response.data.lodgings);
			commit('setMessage', {
				type: 'success',
				text: 'Hospedajes descargados ',
			});
		} catch (error) {
			commit('setLodgings', null);
			commit('setMessage', {
				type: 'error',
				text: 'Fetch lodgings ' + error,
			});
			if (error.message == 'Request failed with status code 401') router.push('/login');
		}
	},
	/**
	 * get all periods
	 */
	async fetchPeriods({ commit }, placeId) {
		try {
			const response = await axios.get(`${api}/periods/${placeId}`);
			const { periods } = response.data;
			commit('setPeriods', periods);
			commit('setMessage', {
				type: 'success',
				text: 'Habitaciones descargadas',
			});
		} catch (e) {
			commit('setPeriods', null);
			commit('setMessage', {
				type: 'error',
				text: 'Error al descargar habitaciones',
			});
			if (e.message == 'Request failed with status code 401') router.push('/login');
		}
	},
	/**
	 * get lodgings for place
	 */
	async fetchLodgingsForPlace({ commit }, id) {
		try {
			const response = await axios.get(`${api}/lodgings/place/${id}`);
			commit('setLodgingsPlace', response.data.lodgings);
			commit('setRangeDatePayments', response.data.lodgings);
			commit('setcountLogingsPlace', response.data.count);
		} catch (error) {
			commit('setLodgingsPlace', null);
			commit('setMessage', {
				type: 'error',
				text: 'Fetch lodgings ' + error,
			});
			if (error.message == 'Request failed with status code 401') router.push('/login');
		}
	},
	/**
	 * Guarda un hospedaje que no este almacenado o que es diferente
	 * A lo que existe en la base de datos.
	 */
	async saveLodgings({ commit }) {
		try {
			commit('setModeEdit', false);
			commit('setLoading', 'Creando hospedajes...');
			let mirrorLodging = JSON.parse(state.mirrorLodging);
			state.lodgings.forEach((l, id) => {
				//Si es diferente o si no existe
				if (mirrorLodging._data[id] != l || !mirrorLodging[id]) {
					axios
						.post(api + '/lodging', {
							id: l.id,
							group: l.group,
							start: l.start,
							end: l.end,
							service: l.service[0],
							persons: l.persons,
							place: state.place,
						})
						.then(() => (state.mirrorLodging = JSON.stringify(state.lodgings)));
				}
			});
			commit('setLoading', '');
		} catch (error) {
			commit('setMessage', {
				type: 'error',
				text: 'Create lodging ' + error,
			});
			if (error.message == 'Request failed with status code 401') router.push('/login');
		}
	},
};

const mutations = {
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
		for (let i = 0; i <= numberDays; i++)
			service.push([
				oldService[i] ? oldService[i][0] : 1,
				oldService[i] ? oldService[i][1] : 1,
				oldService[i] ? oldService[i][2] : 1,
				oldService[i] ? oldService[i][3] : 1,
			]);
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
		for (let i = 0; i <= numberDays; i++) {
			for (let u = 0; u <= 3; u++) {
				if (service[i][u] == null) service[i][u] = 0;
			}
			if (serviceSelected == 'desayuno' || serviceSelected == 'todos los servicios')
				service[i][0] = service[i][0] - 1;
			if (serviceSelected == 'almuerzo' || serviceSelected == 'todos los servicios')
				service[i][1] = service[i][1] - 1;
			if (serviceSelected == 'cena' || serviceSelected == 'todos los servicios')
				service[i][2] = service[i][2] - 1;
			if (serviceSelected == 'alojamiento' || serviceSelected == 'todos los servicios')
				service[i][3] = service[i][3] - 1;
			for (let k = 0; k <= 3; k++) {
				if (service[i][k] < 0) service[i][k] = 0;
			}
		}
		tempLodging.service[0] = JSON.stringify(service);
		state.lodgingSelect = tempLodging;
	},
	addOneService(state, serviceSelected) {
		let tempLodging = state.lodgingSelect;
		state.lodgingSelect = null;
		let service = JSON.parse(tempLodging.service[0]);
		let numberDays = moment(tempLodging.end).diff(
			moment(tempLodging.start).format('YYYY-MM-DD'),
			'days'
		);
		for (let i = 0; i <= numberDays; i++) {
			for (let u = 0; u <= 3; u++) {
				if (service[i][u] == null) service[i][u] = 0;
				if (service[i][u] >= 20) service[i][u] = 0;
			}
			if (serviceSelected == 'desayuno' || serviceSelected == 'todos los servicios')
				service[i][0] = service[i][0] + 1;
			if (serviceSelected == 'almuerzo' || serviceSelected == 'todos los servicios')
				service[i][1] = service[i][1] + 1;
			if (serviceSelected == 'cena' || serviceSelected == 'todos los servicios')
				service[i][2] = service[i][2] + 1;
			if (serviceSelected == 'alojamiento' || serviceSelected == 'todos los servicios')
				service[i][3] = service[i][3] + 1;
		}
		tempLodging.service[0] = JSON.stringify(service);
		state.lodgingSelect = tempLodging;
	},
	setLodgingSelect(state, value) {
		if (state.lodgings.get(value)) state.lodgingSelect = state.lodgings.get(value);
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
		let place = state.Places.find(c => c.value == state.place);
		let verificate = true;
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
			if (place.text == 'Turismo')
				state.lodgings.add({
					group: state.periods.getIds()[0],
					start: moment().hours(15),
					end: moment()
						.hours(12)
						.add(1, 'day'),
					content: place.text,
					service: ['[[0,0,0,0],[0,0,0,0]]'],
					place: state.place,
				});
			else
				state.lodgings.add({
					group: state.periods.getIds()[0],
					start: moment().hours(15),
					end: moment()
						.hours(12)
						.add(1, 'day'),
					content: place.text,
					service: ['[[1,1,1,1],[1,1,1,1]]'],
					place: state.place,
				});
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
		if (value)
			state.lodgings.forEach(l => {
				if (idValue == l.id) {
					let numberDays = moment(l.end).diff(
						moment(l.start).format('YYYY-MM-DD'),
						'days'
					);
					for (let i = 0; i <= numberDays; i++) {
						if (
							moment(l.start)
								.add(i, 'day')
								.format('YYYY-MM-DD') == dateValue
						) {
							let service = JSON.parse(l.service[0]);
							if (value.name == 'dinner') service[i][2] = parseInt(value.value);
							if (value.name == 'lunch') service[i][1] = parseInt(value.value);
							if (value.name == 'accommodation')
								service[i][3] = parseInt(value.value);
							if (value.name == 'breakfast') service[i][0] = parseInt(value.value);
							newService.push(JSON.stringify(service));
							state.editMode = false;
							state.lodgings.update({
								id: l.id,
								service: newService,
							});
							state.editMode = true;
						}
					}
				}
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
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
