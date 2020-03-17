<template>
	<div>
		<template v-if="loading">
			<!-- loading -->
			<v-dialog :value="loading" persistent width="300" hide-overlay>
				<v-card color="secondary" dark>
					<v-card-text>
						Cargando...
						<v-progress-linear
							indeterminate
							color="white"
							class="mb-0"
						></v-progress-linear>
					</v-card-text>
				</v-card>
			</v-dialog>
		</template>
		<template v-else>
			<v-row justify="start">
				<!-- select place  -->
				<v-col md="4">
					<v-select
						:value="place"
						:items="places"
						dense
						label="Selecione lugar"
						outlined
						@change="setPlace"
					>
					</v-select>
				</v-col>
				<!-- activity button -->
				<v-col v-if="place" md="8" class="d-flex flex-row mt-2">
					<v-tooltip v-if="periods.length > 0" attach bottom min-width="180" class="mr-2">
						<template v-slot:activator="{ on }">
							<v-btn color="accent" dark small @click="createOneLodging()" v-on="on">
								<v-icon>mdi-plus</v-icon><span>Actividad</span>
							</v-btn>
						</template>
						<span>Añadir hospedaje</span>
					</v-tooltip>
					<v-tooltip attach bottom min-width="180" class="mr-2">
						<template v-slot:activator="{ on }">
							<v-btn
								color="accent"
								dark
								small
								v-on="on"
								@click.stop="dialogPeriods = true"
							>
								<span>Turnos</span>
							</v-btn>
						</template>
						<span>Gestionar turnos del lugar</span>
					</v-tooltip>
					<v-tooltip attach bottom min-width="180" class="mr-2">
						<template v-slot:activator="{ on }">
							<v-btn
								color="accent"
								dark
								small
								v-on="on"
								@click.stop="dialogPayments = true"
							>
								<span>Pagos</span>
							</v-btn>
						</template>
						<span>Gestionar pagos del lugar</span>
					</v-tooltip>
					<v-tooltip v-if="lodgingSelect" attach bottom min-width="180" class="mr-2">
						<template v-slot:activator="{ on }">
							<v-btn color="accent" dark small v-on="on" @click.stop="sheet = !sheet">
								<v-icon>mdi-pencil</v-icon><span>Editar</span>
							</v-btn>
						</template>
						<span>Editar el hospedaje</span>
					</v-tooltip>
					<v-tooltip v-if="getMirrorLodging || editMode" attach bottom class="mr-2">
						<template v-slot:activator="{ on }">
							<v-btn color="success" dark small @click="saveLodgings()" v-on="on">
								<v-icon>mdi-content-save</v-icon><span>Guardar</span>
							</v-btn>
						</template>
						<span>Guardar</span>
					</v-tooltip>
					<template v-if="Boolean(place) && dialogPeriods">
						<v-dialog v-model="dialogPeriods" fullscreen>
							<v-card>
								<v-toolbar dark color="primary">
									<v-btn icon dark @click="dialogPeriods = false">
										<v-icon>mdi-close</v-icon>
									</v-btn>
									<v-toolbar-title>Gestion de Turnos</v-toolbar-title>
								</v-toolbar>
								<Periods :id-place="place" />
							</v-card>
						</v-dialog>
					</template>
					<template v-if="Boolean(place) && dialogPayments">
						<v-dialog v-model="dialogPayments" fullscreen>
							<v-card>
								<v-toolbar dark color="primary">
									<v-btn icon dark @click="dialogPayments = false">
										<v-icon>mdi-close</v-icon>
									</v-btn>
									<v-toolbar-title>Gestion de Pagos</v-toolbar-title>
								</v-toolbar>
								<Payments :id-place="place" />
							</v-card>
						</v-dialog>
					</template>
				</v-col>
			</v-row>
			<!-- time-line -->
			<v-row>
				<v-col cols="12">
					<timeline
						v-if="periods.length > 0 && lodgings.length > 0"
						:events="['rangechanged', 'click']"
						:groups="periods"
						:items="lodgings"
						:options="options"
						@click="enableEdit"
						@rangechanged="rangechanged"
					/>
				</v-col>
			</v-row>
			<v-row>
				<v-col v-if="prices && place" cols="12" class="overflow-auto">
					<v-simple-table>
						<template v-slot:default>
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
									<td v-if="place">
										{{ prices.prices[3] }}
									</td>
									<td v-for="(p, index) in proyectionTable" :key="index">
										<span v-if="!editMode">{{ p.service.accommodation }}</span>
										<input
											v-if="editMode && p.service.accommodation !== undefined"
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
									<td v-if="place">
										{{ prices.prices[0] }}
									</td>
									<td v-for="(p, index) in proyectionTable" :key="index">
										<span v-if="!editMode">{{ p.service.breakfast }}</span>
										<input
											v-if="editMode && p.service.breakfast !== undefined"
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
									<td v-if="place">
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
									<td v-if="place">
										{{ prices.prices[2] }}
									</td>
									<td v-for="(p, index) in proyectionTable" :key="index">
										<span v-if="!editMode">{{ p.service.dinner }}</span>
										<input
											v-if="editMode && p.service.dinner !== undefined"
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
								<tr v-if="place" class="borderModule">
									<td colspan="2">TOTAL</td>
									<td v-for="(p, index) in proyectionTable" :key="index">
										<span v-if="finalyPrice[index] != 0">{{
											finalyPrice[index]
										}}</span>
									</td>
								</tr>
							</tbody>
						</template>
					</v-simple-table>
				</v-col>
			</v-row>
			<v-row v-if="lodgingSelect">
				<v-col cols="12" sm="4">
					<v-select
						id="services_select"
						v-model="serviceSelected"
						:items="services"
						dense
						label="Sericios"
						outlined
					>
					</v-select>
				</v-col>
				<v-col cols="6" md="3" class="mt-1">
					<v-btn small color="primary" @click="addOneService(serviceSelected)">
						+1 {{ serviceSelected }}
					</v-btn>
				</v-col>
				<v-col cols="6" md="3" class="mt-1">
					<v-btn small color="primary" @click="subOneService(serviceSelected)">
						-1 {{ serviceSelected }}
					</v-btn>
				</v-col>
			</v-row>
			<v-bottom-sheet v-model="sheet">
				<v-sheet class="text-center">
					<edit-lodging :lodgings="lodgings" :id-place="place" />
				</v-sheet>
			</v-bottom-sheet>
		</template>
	</div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { Timeline } from 'vue2vis';
import moment from 'moment';

export default {
	components: {
		EditLodging: () => import('@/components/lodgings/EditLodging'),
		Periods: () => import('@/components/periods/Periods'),
		Payments: () => import('@/components/payments/Payments'),
		Timeline,
	},
	data() {
		return {
			dialogPeriods: false,
			dialogPayments: false,
			sheet: false,
			services: [
				{ text: 'Todos los servicios', value: 'todos los servicios' },
				{ text: 'Desayuno', value: 'desayuno' },
				{ text: 'Almuerzo', value: 'almuerzo' },
				{ text: 'Cena', value: 'cena' },
				{ text: 'Alojamiento', value: 'alojamiento' },
			],
			serviceSelected: 'todos los servicios',
			selectPlace: null,
			options: {
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
					if (this.place) {
						this.setModeEdit(true);
						if (this.verifyOverlay(item)) {
							callback(item);
							this.updateService(item);
						} else this.$toasted.show('Existe un alojamiento para esas fechas');
					} else this.$toasted.show('Selecione una entidad primero');
				},
				onMoving: (item, callback) => {
					this.setModeEdit(false);
					if (this.place) {
						if (this.verifyOverlay(item)) callback(item);
						else this.$toasted.show('Existe un alojamiento para esas fechas');
					} else this.$toasted.show('Selecione una entidad primero');
				},
				onRemove: (item, callback) => {
					if (this.lodgings.length > 1 && this.place) {
						this.setModeEdit(false);
						this.deleteLodging(item);
						callback(item);
					} else this.$toasted.show('Selecione una entidad primero');
				},
				onAdd: (item, callback) => {
					if (this.place) {
						item.start = moment(item.start).hours(15);
						item.end = moment(item.start)
							.hours(12)
							.add(1, 'day');
						if (this.verifyOverlay(item)) {
							this.setModeEdit(false);
							var place = this.places.find(c => c.value == this.place).text;
							item.content = place;
							if (place != 'Turismo') item.service = ['[[1,1,1,1],[1,1,1,1]]'];
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
					if (this.place) {
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
			if (this.place)
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
			if (this.place) return this.places.find(c => c.value == this.place);
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
								!this.place &&
								this.places.find(c => c.value == l.place).text == 'Turismo'
							) {
								var numberPassangerMax = this.periods.get(l.group)
									.numberPassangerMax;
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
			editMode: 'Lodging/editMode',
			loading: 'Lodging/loading',
			lodgings: 'Lodging/lodgings',
			lodgingSelect: 'Lodging/lodgingSelect',
			message: 'Lodging/message',
			mirrorLodging: 'Lodging/mirrorLodging',
			periods: 'Lodging/periods',
			place: 'Lodging/place',
			places: 'Lodging/places',
			rangeDate: 'Lodging/rangeDate',
			updatingService: 'Lodging/updatingService',
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
				Array.isArray(this.lodgingSelect.persons) &&
				this.lodgingSelect.persons.length
			) {
				this.setAllLodgingPersons(this.lodgingSelect.persons);
			} else {
				this.setAllLodgingPersons([]);
			}
		},
	},
	created() {
		this.selectPlace = this.place;
		this.fetchPeriods(this.selectPlace);
		this.fetchPlace();
		this.fetchLodgings();
		this.setRangeDate({
			start: moment(),
			end: moment().add(15, 'day'),
		});
	},
	mounted() {
		this.fetchAllPersons();
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
		setPlace(payload) {
			this.setPlaceLodging(payload);
			this.setModeEdit(false);
			this.fetchPeriods(this.place).then(() => this.fetchLodgings());
		},
		detectInputChange(payload) {
			if (payload.target.value == '' || payload.target.value == 0) payload.target.value = 0;
			var numberPassangerMax = this.periods.get(this.lodgingSelect.group).numberPassangerMax;
			if (payload.target.value > numberPassangerMax) {
				this.$toasted.show('Cantidad máxima de la habitación excedida');
				payload.target.value = numberPassangerMax;
			}
			if (payload.target.value < 0) payload.target.value = numberPassangerMax;
			this.updateService(payload.target);
		},
		enableEdit(payload) {
			if (this.place && payload.item) {
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
			deleteLodging: 'Lodging/deleteLodging',
			fetchAllPersons: 'Persons/fetchAllPersons',
			fetchLodgings: 'Lodging/fetchLodgings',
			fetchPeriods: 'Lodging/fetchPeriods',
			fetchPlace: 'Lodging/fetchPlace',
			saveLodgings: 'Lodging/saveLodgings',
		}),
		...mapMutations({
			addOneService: 'Lodging/addOneService',
			subOneService: 'Lodging/subOneService',
			createOneLodging: 'Lodging/createOneLodging',
			addLodging: 'Lodging/addLodging',
			setAllLodgingPersons: 'Lodging/setAllLodgingPersons',
			setLodgingSelect: 'Lodging/setLodgingSelect',
			setModeEdit: 'Lodging/setModeEdit',
			setPlaceLodging: 'Lodging/setPlaceLodging',
			setRangeDate: 'Lodging/setRangeDate',
			updateService: 'Lodging/updateService',
		}),
	},
};
</script>

<style lang="css">
.vis-selected {
	background-color: #c06240 !important;
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
	margin-bottom: 15px;
	background-color: #80808014;
	border: none !important;
}
.vis-item {
	border: none !important;
	background: rgb(213, 47, 143);
	background: linear-gradient(
		90deg,
		rgba(213, 47, 143, 0.861782212885154) 0%,
		rgba(106, 49, 255, 0.8701855742296919) 100%
	);
	color: white;
	border-radius: 5px !important;
	transition: all ease-in-out 0.3s;
}
</style>
