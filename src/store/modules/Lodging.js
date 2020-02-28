import { api } from '@/config/index.js';
import Axios from 'axios';
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
	rooms: new DataSet([]),
	companies: [],
	lodgingPassengers: [],
	company: null,
	rangeDatePayments: {},
	lodgingsCompany: [],
	countLogingsCompany: 0,
	mountTotal: null,
	rangeDate: {
		start: null,
		end: null,
	},
};

const getters = {
	message: state => state.message,
	lodgingPassengers: state => state.lodgingPassengers,
	updatingService: state => state.updatingService,
	mirrorLodging: state => state.mirrorLodging,
	lodgingSelect: state => state.lodgingSelect,
	loading: state => state.loading,
	editMode: state => state.editMode,
	lodgings: state => state.lodgings,
	rangeDatePayments: state => state.rangeDatePayments,
	lodgingsCompany: state => state.lodgingsCompany,
	countLogingsCompany: state => state.countLogingsCompany,
	rangeDate: state => state.rangeDate,
	rooms: state => state.rooms,
	companies: state => state.companies,
	company: state => state.company,
	mountTotal: state => state.mountTotal,
};

const actions = {
	//Elimina un unico hospedaje
	async deleteLodging({ commit }, value) {
		commit('setLoading', 'Eliminando hospedaje...');
		return Axios.delete(api + '/lodging/delete/company/' + value.id)
			.then(() => {
				commit('setLoading', '');
				commit('setDeletLodging', value);
				commit('setMessage', {
					type: 'default',
					text: 'Hospedaje eliminado ',
				});
			})
			.catch(error => {
				commit('setMessage', {
					type: 'error',
					text: 'Delete lodging ' + error,
				});
				if (error.message == 'Request failed with status code 401') router.push('/login');
			});
	},
	//Obtiene todos las compañias
	async fetchCompany({ commit }) {
		commit('setModeEdit', false);
		commit('setCompanies', null);
		commit('setLoading', 'Cargando compañias...');
		return Axios.get(api + '/company')
			.then(response => {
				commit('setLoading', '');
				commit('setCompanies', response.data.company);
				commit('setMessage', {
					type: 'success',
					text: 'Compañias descargadas',
				});
			})
			.catch(error => {
				commit('setCompanies', null);
				commit('setMessage', {
					type: 'error',
					text: 'Fetch company ' + error,
				});
				if (error.message == 'Request failed with status code 401') router.push('/login');
			});
	},
	//Obtiene los hospedajes
	async fetchLodgings({ commit }) {
		commit('setLoading', 'Cargando hospedajes...');
		commit('setModeEdit', false);
		commit('setLodgings', null);
		return Axios.get(api + '/lodgings')
			.then(response => {
				commit('setLoading', '');
				commit('setLodgings', response.data.lodgings);
				commit('setMessage', {
					type: 'success',
					text: 'Hospedajes descargadas ',
				});
			})
			.catch(error => {
				commit('setLodgings', null);
				commit('setMessage', {
					type: 'error',
					text: 'Fetch lodgings ' + error,
				});
				if (error.message == 'Request failed with status code 401') router.push('/login');
			});
	},

	async fetchRooms({ commit }, companyId) {
		try {
			const response = await Axios.get(api + '/rooms/' + companyId);
			const { rooms } = response.data;
			commit('setRooms', rooms);
			commit('setMessage', {
				type: 'success',
				text: 'Habitaciones descargados',
			});
		} catch (e) {
			commit('setRooms', null);
			commit('setMessage', {
				type: 'error',
				text: 'Error al descargar habitaciones',
			});
			if (e.message == 'Request failed with status code 401') router.push('/login');
		}
	},
	//fetch lodgings for company
	async fetchLodgingsForCompany({ commit }, id) {
		try {
			const response = await Axios.get(`${api}/lodgings/company/${id}`);
			commit('setLodgingsCompany', response.data.lodgings);
			commit('setRangeDatePayments', response.data.lodgings);
			commit('setCountLogingsCompany', response.data.count);
		} catch (error) {
			commit('setLodgingsCompany', null);
			commit('setMessage', {
				type: 'error',
				text: 'Fetch lodgings ' + error,
			});
			if (error.message == 'Request failed with status code 401') router.push('/login');
		}
	},

	//Guarda un hospedaje que no este almacenado o que es diferente
	//A lo que existe en la base de datos.
	async saveLodgings({ commit }) {
		commit('setModeEdit', false);
		commit('setLoading', 'Creando hospedajes...');
		let mirrorLodging = JSON.parse(state.mirrorLodging);
		state.lodgings.forEach((l, id) => {
			//Si es diferente o si no existe
			if (mirrorLodging._data[id] != l || !mirrorLodging[id]) {
				Axios.post(api + '/lodging', {
					id: l.id,
					group: l.group,
					start: l.start,
					end: l.end,
					service: l.service[0],
					company: state.company,
					passengers: state.lodgingPassengers,
					mountTotal: l.mountTotal,
				})
					.then(() => (state.mirrorLodging = JSON.stringify(state.lodgings)))
					.catch(error => {
						commit('setMessage', {
							type: 'error',
							text: 'Create lodging ' + error,
						});
						if (error.message == 'Request failed with status code 401')
							router.push('/login');
					});
			}
		});
		commit('setLoading', '');
	},
};

const mutations = {
	setMessage(state, value) {
		state.message = value;
	},
	setAllLodgingPassengers(state, values) {
		state.lodgingPassengers = values;
	},
	updateLodgingPassengers(state, value) {
		state.lodgingPassengers.push(value);
	},
	removeLodgingPassengers(state, value) {
		state.lodgingPassengers.splice(value, 1);
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
			start: moment(value.dateStart).hours(16),
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
		tempLodging.start = moment(value.dateStart).hours(16);
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
		let company = state.companies.find(c => c.value == state.company);
		let verificate = true;
		state.lodgings.forEach(lod => {
			if (
				lod.group == state.rooms.getIds()[0] &&
				moment().isSameOrAfter(moment(lod.start)) &&
				moment()
					.add(1, 'day')
					.isSameOrBefore(moment(lod.end))
			)
				verificate = false;
		});
		if (verificate) {
			if (company.text == 'Turismo')
				state.lodgings.add({
					group: state.rooms.getIds()[0],
					start: moment().hours(16),
					end: moment()
						.hours(13)
						.add(1, 'day'),
					content: company.text,
					service: ['[[0,0,0,0],[0,0,0,0]]'],
					company: state.company,
				});
			else
				state.lodgings.add({
					group: state.rooms.getIds()[0],
					start: moment().hours(16),
					end: moment()
						.hours(13)
						.add(1, 'day'),
					content: company.text,
					service: ['[[1,1,1,1],[1,1,1,1]]'],
					company: state.company,
				});
		} else {
			state.message = {
				type: 'default',
				text: 'Existe un alojamiento para esas fechas ',
			};
		}
	},
	setCompanyLodging(state, value) {
		state.company = value;
	},
	setCompanies(state, values) {
		let companies = [];
		companies.push({
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
			companies.push(...mapValues);
		}
		state.companies = companies;
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
	setRooms(state, values) {
		const dataSet = new DataSet([]);
		const mappedValues = values.map(room => {
			return {
				id: room._id,
				content: room.name,
				numberPassangerMax: room.numberPassangerMax,
			};
		});
		dataSet.add(mappedValues);
		state.rooms = dataSet;
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
	setLodgingsCompany(state, value) {
		state.lodgingsCompany = value;
	},
	setCountLogingsCompany(state, value) {
		state.countLogingsCompany = value;
	},
	setLodgings(state, values) {
		let tempLodging = state.lodgings;
		state.editMode = false;
		state.lodgings = new DataSet([]);
		if (values) {
			tempLodging = new DataSet([]);
			const evaluateLodgingPush = (lodging, company) => {
				if (state.company) {
					if (state.company === lodging.company)
						tempLodging.add({
							id: lodging.id,
							group: lodging.group,
							start: moment(lodging.start).hours(16),
							end: moment(lodging.end).hours(13),
							content: company.text,
							service: lodging.service,
							company: lodging.company,
							passengers: lodging.passengers,
							mountTotal: lodging.mountTotal,
						});
				} else {
					tempLodging.add({
						id: lodging.id,
						group: lodging.group,
						start: moment(lodging.start).hours(16),
						end: moment(lodging.end).hours(13),
						content: company.text,
						service: lodging.service,
						company: lodging.company,
						passengers: lodging.passengers,
						mountTotal: lodging.mountTotal,
					});
				}
			};
			values.forEach(v => {
				let company = state.companies.find(c => c.value == v.company);
				/*Necesitamos seguir corriendo esta funcion aun si company es undefined
				 * si es undefined, entonces creamos un objeto basico con la propiedad text.
				 * Con esto evitamos el mensaje de 'company.text' is undefined en la interfaz de usuario*/
				if (!company) company = { text: '' };
				evaluateLodgingPush(v, company);
			});
			state.lodgings = tempLodging;
			state.mirrorLodging = JSON.stringify(tempLodging);
		} else state.lodgings = new DataSet([]);
	},
	/**
	 * prices from company for calculate the total
	 * @param {Array} prices
	 */
	setMountTotal(state, prices) {
		let service = JSON.parse(state.lodgingSelect.service[0]);
		let breakfast = 0,
			lunch = 0,
			dinner = 0,
			lodging = 0;
		if (prices) {
			service.map(arr => {
				arr.filter((item, index) => {
					if (index === 0) breakfast = breakfast + item;
					if (index === 1) lunch = lunch + item;
					if (index === 2) dinner = dinner + item;
					if (index === 3) lodging = lodging + item;
				});
			});
		}
		const mountTotal =
			lodging * prices[3] + dinner * prices[2] + lunch * prices[1] + breakfast * prices[0];
		state.lodgings.update({ id: state.lodgingSelect.id, mountTotal });
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
