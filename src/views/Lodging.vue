<template>
	<b-row id="nav">
		<b-col>
			<Loading v-if="loading" :msj="loading" />
			<template v-else>
				<b-row>
					<b-col>
						<b-row>
							<b-col md="6" lg="3" class="my-2">
								<label>Selecione lugar </label>
								<b-form-select
									v-model="selectCompany"
									:options="companies"
									@change="setCompany"
								/>
							</b-col>
						</b-row>
						<b-row>
							<b-col class="mb-2 d-flex justify-content-start flex-wrap">
								<b-button
									id="empresas-btn"
									@click="$router.push({ name: 'companies' })"
								>
									Lugares
									<b-tooltip target="empresas-btn" placement="bottom">
										Gestión de lugares
									</b-tooltip>
								</b-button>
								<b-button
									v-if="company"
									id="habitaciones-btn"
									@click="$router.push({ name: 'rooms' })"
								>
									Turno
									<b-tooltip target="habitaciones-btn" placement="bottom">
										Gestión de turnos
									</b-tooltip>
								</b-button>
								<b-button
									v-if="rooms.length > 0 && selectCompany"
									id="hospedaje-btn"
									@click="createOneLodging()"
								>
									+ Actividad
									<b-tooltip target="hospedaje-btn" placement="bottom">
										Agregar una actividad (Haga doble click en la linea de
										tiempo)
									</b-tooltip>
								</b-button>
								<b-button
									v-if="company"
									id="pagos-btn"
									@click="$router.push('/payments/' + company)"
								>
									Pagos
									<b-tooltip target="pagos-btn" placement="bottom">
										Gestión de pagos
									</b-tooltip>
								</b-button>
								<PassengersDialog />
								<b-button
									v-if="getMirrorLodging || editMode"
									id="guardar-btn"
									variant="success"
									@click="saveLodgings()"
								>
									Guardar
									<b-tooltip target="guardar-btn" placement="bottom">
										Guardar cambios realizados
									</b-tooltip>
								</b-button>
							</b-col>
						</b-row>
					</b-col>
				</b-row>
				<b-row>
					<b-col lg="9">
						<b-row>
							<b-col cols="12">
								<timeline
									v-if="rooms.length > 0 && lodgings.length > 0"
									class="p-2"
									:items="lodgings"
									:events="['rangechanged', 'click']"
									:groups="rooms"
									:options="options"
									@click="enableEdit"
									@rangechanged="rangechanged"
								/>
							</b-col>
							<b-col v-if="prices && company" cols="12" class="px-4 overflow-auto">
								<table class="table table-bordered ">
									<thead>
										<tr>
											<td>Actividad</td>
											<td>Precios</td>
											<td v-for="(d, index) in rangeDateTable" :key="index">
												{{ d.numberDay }}
												<br />
												{{ d.nameDay }}
											</td>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>ALOJAMIENTO</td>
											<td v-if="company">
												{{ prices.prices[3] }}
											</td>
											<td v-for="(p, index) in proyectionTable" :key="index">
												<span v-if="!editMode">{{
													p.service.accommodation
												}}</span>
												<input
													v-if="
														editMode &&
															p.service.accommodation !== undefined
													"
													:id="p.id + ',' + p.date"
													v-model="p.service.accommodation"
													type="number"
													class="inputService"
													name="accommodation"
													:placeholder="p.service.accommodation"
													@change="detectInputChange"
												/>
											</td>
										</tr>
										<tr>
											<td>DESAYUNO</td>
											<td v-if="company">
												{{ prices.prices[0] }}
											</td>
											<td v-for="(p, index) in proyectionTable" :key="index">
												<span v-if="!editMode">{{
													p.service.breakfast
												}}</span>
												<input
													v-if="
														editMode &&
															p.service.breakfast !== undefined
													"
													:id="p.id + ',' + p.date"
													v-model="p.service.breakfast"
													type="number"
													class="inputService"
													name="breakfast"
													:placeholder="p.service.breakfast"
													@change="detectInputChange"
												/>
											</td>
										</tr>
										<tr>
											<td>ALMUERZO</td>
											<td v-if="company">
												{{ prices.prices[1] }}
											</td>
											<td v-for="(p, index) in proyectionTable" :key="index">
												<span v-if="!editMode">{{ p.service.lunch }}</span>
												<input
													v-if="editMode && p.service.lunch != undefined"
													:id="p.id + ',' + p.date"
													v-model="p.service.lunch"
													type="number"
													class="inputService"
													name="lunch"
													:placeholder="p.service.lunch"
													@change="detectInputChange"
												/>
											</td>
										</tr>
										<tr>
											<td>CENA</td>
											<td v-if="company">
												{{ prices.prices[2] }}
											</td>
											<td v-for="(p, index) in proyectionTable" :key="index">
												<span v-if="!editMode">{{ p.service.dinner }}</span>
												<input
													v-if="
														editMode && p.service.dinner !== undefined
													"
													:id="p.id + ',' + p.date"
													v-model="p.service.dinner"
													type="number"
													class="inputService"
													name="dinner"
													:placeholder="p.service.dinner"
													@change="detectInputChange"
												/>
											</td>
										</tr>
										<tr v-if="company" class="   borderModule">
											<td colspan="2">TOTAL</td>
											<td v-for="(p, index) in proyectionTable" :key="index">
												<span v-if="finalyPrice[index] != 0">{{
													finalyPrice[index]
												}}</span>
											</td>
										</tr>
									</tbody>
								</table>
								<b-row v-if="lodgingSelect">
									<b-col>
										<b-form-group
											id="input-group-1"
											label="Espacio de trabajo:"
											label-for="input-1"
										>
											<b-form-select
												id="input-1"
												v-model="serviceSelected"
												style="text-align: center; text-align-last:center;"
												:options="services"
											/>
										</b-form-group>
									</b-col>
									<b-col class="mt-4 flex-wrap">
										<b-button @click="addOneService(serviceSelected)">
											+1 {{ serviceSelected }}
										</b-button>
										<b-button @click="subOneService(serviceSelected)">
											-1 {{ serviceSelected }}
										</b-button>
									</b-col>
								</b-row>
							</b-col>
						</b-row>
					</b-col>
					<transition name="fade">
						<b-col v-if="lodgingSelect" lg="3">
							<EditLodging />
						</b-col>
					</transition>
				</b-row>
				<b-row> </b-row>
			</template>
		</b-col>
	</b-row>
</template>

<script>
import { Timeline } from 'vue2vis';
import PassengersDialog from '../components/passengers/PassengersDialog';
import moment from 'moment';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import Loading from '@/components/Loading';
import EditLodging from '@/components/lodgings/EditLodging';

export default {
	components: {
		Timeline,
		Loading,
		EditLodging,
		PassengersDialog,
	},
	data() {
		return {
			services: [
				{ text: 'Todos los servicios', value: 'todos los servicios' },
				{ text: 'Desayuno', value: 'desayuno' },
				{ text: 'Almuerzo', value: 'almuerzo' },
				{ text: 'Cena', value: 'cena' },
				{ text: 'Alojamiento', value: 'alojamiento' },
			],
			serviceSelected: 'todos los servicios',
			selectCompany: null,
			options: {
				stack: true,
				editable: true,
				start: moment(),
				end: moment().add(14, 'day'),
				zoomMin: 1000 * 60 * 60 * 24 * 7,
				zoomMax: 1000 * 60 * 60 * 24 * 30,
				hiddenDates: [
					{
						start: '2019-01-01 00:00:00',
						end: '2019-01-01 06:00:00',
						repeat: 'daily',
					},
					{
						start: '2019-01-01 16:00:00',
						end: '2019-01-01 24:00:00',
						repeat: 'daily',
					},
				],
				onUpdate: (item, callback) => {
					if (this.company) {
						this.setModeEdit(true);
						if (this.verifyOverlay(item)) {
							callback(item);
							this.updateService(item);
						} else this.$toasted.show('Existe un alojamiento para esas fechas');
					} else this.$toasted.show('Selecione una entidad primero');
				},
				onMoving: (item, callback) => {
					this.setModeEdit(false);
					if (this.company) {
						if (this.verifyOverlay(item)) callback(item);
						else this.$toasted.show('Existe un alojamiento para esas fechas');
					} else this.$toasted.show('Selecione una entidad primero');
				},
				onRemove: (item, callback) => {
					if (this.lodgings.length > 1 && this.company) {
						this.setModeEdit(false);
						this.deleteLodging(item);
						callback(item);
					} else this.$toasted.show('Selecione una entidad primero');
				},
				onAdd: (item, callback) => {
					if (this.company) {
						item.start = moment(item.start).hours(15);
						item.end = moment(item.start)
							.hours(12)
							.add(1, 'day');
						if (this.verifyOverlay(item)) {
							this.setModeEdit(false);
							var company = this.companies.find(c => c.value == this.company).text;
							item.content = company;
							if (company != 'Turismo') item.service = ['[[1,1,1,1],[1,1,1,1]]'];
							else item.service = ['[[0,0,0,0],[0,0,0,0]]'];
							var timestamp = new Date().getTime().toString(16);
							timestamp +
								'xxxxxxxxxxxxxxxx'
									.replace(/[x]/g, function() {
										return ((Math.random() * 16) | 0).toString(16);
									})
									.toLowerCase();
							item.id = timestamp;
							this.addLodging(item);
							if (!this.lodgings.get(item.id)) callback(item);
						} else this.$toasted.show('Existe un alojamiento para esas fechas');
					} else this.$toasted.show('Selecione una entidad primero');
				},
				onMove: (item, callback) => {
					if (this.company) {
						var service = [];
						var numberDays = moment(item.end).diff(
							moment(item.start).format('YYYY-MM-DD'),
							'days'
						);
						var oldService = JSON.parse(item.service[0]);
						for (var i = 0; i <= numberDays; i++)
							service.push([
								oldService[i] ? oldService[i][0] : 1,
								oldService[i] ? oldService[i][1] : 1,
								oldService[i] ? oldService[i][2] : 1,
								oldService[i] ? oldService[i][3] : 1,
							]);
						var itemService = [];
						itemService.push(JSON.stringify(service));
						item.service = itemService;
						item.start = moment(item.start).hours(15);
						item.end = moment(item.end).hours(12);
						if (this.verifyOverlay(item)) {
							this.setModeEdit(true);
							this.updateService(item);
							callback(item);
						} else this.$toasted.show('Existe un alojamiento para esas fechas');
					} else this.$toasted.show('Selecione una entidad primero');
				},
			},
		};
	},
	computed: {
		getMirrorLodging() {
			var hola = JSON.stringify(this.lodgings);
			if (hola == this.mirrorLodging) return false;
			else return true;
		},
		finalyPrice() {
			var prices = [];
			var dayPrice = 0;
			if (this.company)
				this.proyectionTable.forEach(dailyService => {
					dayPrice =
						(dailyService.service.breakfast
							? dailyService.service.breakfast * this.prices.prices[0]
							: 0) +
						(dailyService.service.lunch
							? dailyService.service.lunch * this.prices.prices[1]
							: 0) +
						(dailyService.service.dinner
							? dailyService.service.dinner * this.prices.prices[2]
							: 0) +
						(dailyService.service.accommodation
							? dailyService.service.accommodation * this.prices.prices[3]
							: 0);
					prices.push(dayPrice);
				});
			return prices;
		},
		prices() {
			if (this.company) return this.companies.find(c => c.value == this.company);
			else return [];
		},
		proyectionTable() {
			// eslint-disable-next-line no-unused-vars
			var proyectionTable = [];
			var daysLodging = [];
			var numberDays = this.rangeDate.end.diff(this.rangeDate.start, 'days');
			for (var i = 0; i <= numberDays; i++)
				daysLodging.push({
					date: moment(this.rangeDate.start)
						.add(i, 'day')
						.format('YYYY-MM-DD'),
					service: [],
					id: null,
				});

			this.lodgings.forEach(l => {
				var index = 0;
				if (!this.editMode)
					daysLodging.forEach(day => {
						if (
							moment(day.date).isSameOrAfter(moment(l.start).format('YYYY-MM-DD')) &&
							moment(day.date).isSameOrBefore(moment(l.end).format('YYYY-MM-DD'))
						) {
							if (
								!this.company &&
								this.companies.find(c => c.value == l.company).text == 'Turismo'
							) {
								var numberPassangerMax = this.rooms.get(l.group).numberPassangerMax;
								day.service = {
									breakfast: day.service.breakfast
										? numberPassangerMax + day.service.breakfast
										: numberPassangerMax,
									lunch: day.service.lunch
										? numberPassangerMax + day.service.lunch
										: numberPassangerMax,
									dinner: day.service.dinner
										? numberPassangerMax + day.service.dinner
										: numberPassangerMax,
									accommodation: day.service.accommodation
										? numberPassangerMax + day.service.accommodation
										: numberPassangerMax,
								};
							} else {
								var service = JSON.parse(l.service[0]);
								day.service = {
									breakfast: day.service.breakfast
										? service[index][0] + day.service.breakfast
										: service[index][0],
									lunch: day.service.lunch
										? service[index][1] + day.service.lunch
										: service[index][1],
									dinner: day.service.dinner
										? service[index][2] + day.service.dinner
										: service[index][2],
									accommodation: day.service.accommodation
										? service[index][3] + day.service.accommodation
										: service[index][3],
								};
							}
							index++;
						}
					});
				if (this.lodgingSelect)
					if (this.editMode && this.lodgingSelect.id == l.id) {
						daysLodging.forEach(day => {
							if (
								moment(day.date).isSameOrAfter(
									moment(l.start).format('YYYY-MM-DD')
								) &&
								moment(day.date).isSameOrBefore(moment(l.end).format('YYYY-MM-DD'))
							) {
								var service = JSON.parse(l.service[0]);
								day.service = {
									breakfast: day.service.breakfast
										? service[index][0] + day.service.breakfast
										: service[index][0],
									lunch: day.service.lunch
										? service[index][1] + day.service.lunch
										: service[index][1],
									dinner: day.service.dinner
										? service[index][2] + day.service.dinner
										: service[index][2],
									accommodation: day.service.accommodation
										? service[index][3] + day.service.accommodation
										: service[index][3],
								};
								day.id = l.id;
								index++;
							}
						});
					}
			});
			return daysLodging;
		},
		rangeDateTable() {
			var dates = [];
			var numberDays = this.rangeDate.end.diff(this.rangeDate.start, 'days');
			// if(numberDays >= 7) numberDays = 7
			for (var i = 0; i <= numberDays; i++)
				dates.push({
					numberDay: moment(this.rangeDate.start)
						.add(i, 'day')
						.format('DD MMM'),
					nameDay: moment(this.rangeDate.start)
						.add(i, 'day')
						.format('ddd'),
				});
			return dates;
		},
		...mapGetters({
			message: 'Lodging/message',
			updatingService: 'Lodging/updatingService',
			mirrorLodging: 'Lodging/mirrorLodging',
			lodgingSelect: 'Lodging/lodgingSelect',
			loading: 'Lodging/loading',
			rooms: 'Lodging/rooms',
			rangeDate: 'Lodging/rangeDate',
			lodgings: 'Lodging/lodgings',
			companies: 'Lodging/companies',
			company: 'Lodging/company',
			editMode: 'Lodging/editMode',
		}),
	},
	watch: {
		message(newVal) {
			this.$toasted.show(newVal.text, {
				type: newVal.type,
			});
		},
		lodgingSelect() {
			if (
				this.lodgingSelect &&
				Array.isArray(this.lodgingSelect.passengers) &&
				this.lodgingSelect.passengers.length
			) {
				this.setAllLodgingPassengers(this.lodgingSelect.passengers);
			} else {
				this.setAllLodgingPassengers([]);
			}
		},
	},
	created() {
		this.selectCompany = this.company;
		this.fetchRooms(this.selectCompany);
		this.fetchCompany();
		this.fetchLodgings();
		this.setRangeDate({
			start: moment(),
			end: moment().add(15, 'day'),
		});
	},
	mounted() {
		this.fetchAllPassengers();
	},
	methods: {
		verifyOverlay(value) {
			let verificate = true;
			this.lodgings.forEach(lod => {
				if (lod.group == value.group && lod.id != value.id) {
					if (
						moment(value.start).isSameOrBefore(moment(lod.end)) &&
						moment(value.end).isSameOrAfter(moment(lod.start))
					)
						verificate = false;
				}
			});
			return verificate;
		},
		/*parece que en esta funcion no esta el error*/
		setCompany(payload) {
			this.setCompanyLodging(payload);
			this.setModeEdit(false);
			this.fetchRooms(this.company).then(() => this.fetchLodgings());
		},
		detectInputChange(payload) {
			if (payload.target.value == '' || payload.target.value == 0) payload.target.value = 0;
			var numberPassangerMax = this.rooms.get(this.lodgingSelect.group).numberPassangerMax;
			if (payload.target.value > numberPassangerMax) {
				this.$toasted.show('Cantidad máxima de la habitación excedida');
				payload.target.value = numberPassangerMax;
			}
			if (payload.target.value < 0) payload.target.value = numberPassangerMax;
			this.updateService(payload.target);
		},
		enableEdit(payload) {
			if (this.company && payload.item) {
				this.setLodgingSelect(payload.item);
				this.setModeEdit(true);
			} else this.setModeEdit(false);
		},
		rangechanged(payload) {
			if (payload) {
				this.setRangeDate({
					start: moment(payload.start),
					end: moment(payload.end),
				});
			}
		},
		...mapActions({
			saveLodgings: 'Lodging/saveLodgings',
			fetchCompany: 'Lodging/fetchCompany',
			fetchAllPassengers: 'Passengers/fetchAllPassengers',
			fetchRooms: 'Lodging/fetchRooms',
			fetchLodgings: 'Lodging/fetchLodgings',
			deleteLodging: 'Lodging/deleteLodging',
		}),
		...mapMutations({
			addOneService: 'Lodging/addOneService',
			subOneService: 'Lodging/subOneService',
			createOneLodging: 'Lodging/createOneLodging',
			addLodging: 'Lodging/addLodging',
			setLodgingSelect: 'Lodging/setLodgingSelect',
			setRangeDate: 'Lodging/setRangeDate',
			updateService: 'Lodging/updateService',
			setCompanyLodging: 'Lodging/setCompanyLodging',
			setModeEdit: 'Lodging/setModeEdit',
			setAllLodgingPassengers: 'Lodging/setAllLodgingPassengers',
		}),
	},
};
</script>

<style lang="css">
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
	opacity: 0;
}

.vis-selected {
	background-color: #ff591b !important;
	color: white !important;
	transition: all ease-in-out 0.3s;
	/* box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.75); */
}
.vis-time-axis .vis-text,
.vis-label,
.vis-inner,
.vis-time-axis .vis-text.vis-saturday,
.vis-time-axis .vis-text.vis-sunday {
	color: #3a3b3e !important;
}

.vis-time-axis .vis-grid.vis-saturday,
.vis-time-axis .vis-grid.vis-sunday {
	background: #ffffff7a !important;
	border: none !important;
}

.inputService {
	max-width: 60px;
}
.vis-timeline {
	box-shadow: 5px 5px 25px -5px rgba(5, 5, 5, 1);
	margin-bottom: 15px;
	background-color: #c1c5d1;
	border-radius: 0px 40px 0px 40px !important;
}
.vis-item {
	border: none !important;
	border-radius: 0px 10px 0px 0px !important;
	background-color: #ecb099;
	color: white;
	transition: all ease-in-out 0.3s;
}
td,
th {
	padding: 2px !important;
	padding-bottom: 10px !important;
	color: white;
	min-width: 60px;
	border-color: transparent !important;
}
</style>
