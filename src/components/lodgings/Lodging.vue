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
			<v-row>
				<!-- select place  -->
				<v-col cols="12" md="3">
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
				<v-col v-if="place" cols="12" sm="2" md="auto" class="mt-2">
					<v-tooltip v-if="periods.length > 0" attach bottom>
						<template v-slot:activator="{ on }">
							<v-btn color="accent" block small @click="createOneLodging()" v-on="on">
								<v-icon>mdi-plus</v-icon><span>Actividad</span>
							</v-btn>
						</template>
						<span>Añadir hospedaje</span>
					</v-tooltip>
				</v-col>
				<!-- periods buttons -->
				<v-col v-if="place" cols="12" sm="2" md="auto" class="mt-2">
					<v-tooltip attach bottom>
						<template v-slot:activator="{ on }">
							<v-btn
								block
								color="accent"
								small
								v-on="on"
								@click.stop="dialogPeriods = true"
							>
								<span>Turnos</span>
							</v-btn>
						</template>
						<span>Gestionar turnos del lugar</span>
					</v-tooltip>
				</v-col>
				<!-- payments buttons -->
				<v-col v-if="place" cols="12" sm="2" md="auto" class="mt-2">
					<v-tooltip attach bottom>
						<template v-slot:activator="{ on }">
							<v-btn
								block
								color="accent"
								small
								v-on="on"
								@click.stop="dialogPayments = true"
							>
								<span>Pagos</span>
							</v-btn>
						</template>
						<span>Gestionar pagos del lugar</span>
					</v-tooltip>
				</v-col>
				<!-- edit buttons -->
				<v-col v-if="lodgingSelect" cols="12" sm="2" md="auto" class="mt-2">
					<v-tooltip attach bottom>
						<template v-slot:activator="{ on }">
							<v-btn
								block
								color="accent"
								small
								v-on="on"
								@click.stop="setBottomSheet({ action: true, lodging: null })"
							>
								<v-icon>mdi-pencil</v-icon><span>Editar</span>
							</v-btn>
						</template>
						<span>Editar el hospedaje</span>
					</v-tooltip>
				</v-col>
				<!-- save buttons -->
				<v-col v-if="getMirrorLodging || editMode" cols="12" sm="2" md="auto" class="mt-2">
					<v-tooltip attach bottom class="mr-2">
						<template v-slot:activator="{ on }">
							<v-btn color="success" small @click="saveLodgings()" v-on="on">
								<v-icon>mdi-content-save</v-icon><span>Guardar</span>
							</v-btn>
						</template>
						<span>Guardar</span>
					</v-tooltip>
				</v-col>
				<!-- periods dialog -->
				<v-bottom-sheet
					v-if="lodgingSelect"
					v-model="bottomSheet"
					inset
					@click:outside="setBottomSheet(false)"
				>
					<v-sheet style="height: 75vh">
						<edit-lodging :lodgings="lodgings" :id-place="place" />
					</v-sheet>
				</v-bottom-sheet>
				<v-bottom-sheet
					v-model="dialogPeriods"
					inset
					@click:outside="dialogPeriods = false"
				>
					<v-sheet style="height: 75vh">
						<Periods :id-place="place" />
					</v-sheet>
				</v-bottom-sheet>
				<!-- payments dialog -->
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
			</v-row>
			<!-- timeline -->
			<v-row>
				<v-col v-if="place" cols="12">
					<timeline
						v-if="periods.length > 0 && lodgings.length > 0"
						class="timelineContent"
						:events="['rangechanged', 'click', 'doubleClick']"
						:groups="periods"
						:items="lodgings"
						:options="options"
						@click="enableEdit"
						@rangechanged="rangechanged"
						@double-click="setBottomSheet({ action: true, lodging: null })"
					/>
				</v-col>
				<template v-for="(p, index) in places" v-else>
					<v-col v-if="p.value" :key="index" class="timelineContent " cols="12">
						<h4 class="mb-2">{{ p.text }}</h4>
						<timeline
							v-if="periods.length > 0 && lodgings.length > 0"
							:events="['rangechanged', 'click', 'doubleClick']"
							:groups="periodAllPlace(p.value)"
							:items="lodgingsAllPlace(p.value)"
							:options="options"
							@click="enableEdit"
							@rangechanged="rangechanged"
							@double-click="setBottomSheet({ action: true, lodging: null })"
						/>
					</v-col>
				</template>
			</v-row>
			<!--v3 proyection-->
			<v-row v-if="selectedPlace.value">
				<v-col v-for="lodging in lodgings._data" :key="lodging.id" cols="12">
					<v-card cols="3">
						<v-card-title class="headline">
							{{ lodging.start.format('L') + ' - ' + lodging.end.format('L') }}
						</v-card-title>
						<v-row>
							<v-col v-for="(day, dayIndex) in lodging.days" :key="dayIndex" cols="4">
								<v-card>
									<div>{{ day.date }}</div>
									{{ day.services }}
									<table>
										<thead>
											<tr>
												<th class="text-left">Nombre</th>
												<th class="text-left">Precio</th>
												<th class="text-left">Cantidad</th>
												<th class="text-left">SubTotal</th>
											</tr>
										</thead>
										<tbody>
											<tr
												v-for="(service, serviceIndex) in day.services"
												:key="serviceIndex"
											>
												<td>{{ service.name }}</td>
												<td>{{ service.price }}</td>
												<td>
													<input
														v-model.number="service.quantity"
														type="number"
														class="inputService"
														@change="
															detectServiceQuantityChange(
																$event,
																lodging.group,
																lodging.id,
																dayIndex,
																serviceIndex
															)
														"
													/>
												</td>
												<td>{{ service.price * service.quantity }}</td>
											</tr>
										</tbody>
									</table>
									<div>Total: {{ day.dayTotal }}</div>
								</v-card>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="12" sm="4">
								<v-select
									id="services_select"
									v-model="serviceSelected"
									:items="servicesComboBox"
									dense
									label="Servicios"
									outlined
								>
								</v-select>
							</v-col>
							<v-col cols="6" md="3" class="mt-1">
								<v-btn
									small
									color="primary"
									@click="
										addDaysServices({
											serviceName: serviceSelected,
											lodgingId: lodging.id,
											lodgingGroup: lodging.group,
										})
									"
								>
									+1 {{ serviceSelected }}
								</v-btn>
							</v-col>
							<v-col cols="6" md="3" class="mt-1">
								<v-btn
									small
									color="primary"
									@click="
										subDaysServices({
											serviceName: serviceSelected,
											lodgingId: lodging.id,
										})
									"
								>
									-1 {{ serviceSelected }}
								</v-btn>
							</v-col>
						</v-row>
					</v-card>
				</v-col>
			</v-row>
			<!--aqui van los botones de proyection-->
			<v-row justify="center">
				<v-col>
					<v-bottom-sheet
						v-if="lodgingSelect"
						v-model="bottomSheet"
						inset
						@click:outside="setBottomSheet(false)"
					>
						<v-sheet style="height: 75vh">
							<edit-lodging :lodgings="lodgings" :id-place="place" />
						</v-sheet>
					</v-bottom-sheet>
				</v-col>
			</v-row>
		</template>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { Timeline } from 'vue2vis';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { generateDaysArray } from '../../utils/lodging/daysArray';

const moment = extendMoment(Moment);

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
			//Este string interactua con la comboBox de services
			serviceSelected: 'todos los servicios',
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
				//Esta funcion hace trigger cuando estamos moviendo el lodging, nos sirve para verificar el overlay
				onMoving: (item, callback) => {
					this.setModeEdit(false);
					if (this.place) {
						if (this.verifyOverlay(item)) callback(item);
						else this.$toasted.show('Existe un alojamiento para esas fechas');
					} else this.$toasted.show('Selecione una entidad primero');
				},
				//Esta funcion hace trigger cuando removemos un lodging de la timeline
				onRemove: (item, callback) => {
					if (this.lodgings.length > 1 && this.place) {
						this.setModeEdit(false);
						this.deleteLodging(item);
						callback(item);
					} else this.$toasted.show('Selecione una entidad primero');
				},
				//No tenemos que modificar nada mas de onAdd
				//Cuando clickeo una parte del timeline esta función hace trigger y se encarga de crear un lodging, es similar a createOnelodging de la store
				onAdd: (item, callback) => {
					if (this.place) {
						const startDate = moment(item.start).hours(15);
						const endDate = moment(item.start)
							.hours(12)
							.add(1, 'day');
						item.start = startDate;
						item.end = endDate;
						if (this.verifyOverlay(item)) {
							this.setModeEdit(false);
							const place = this.places.find(c => c.value === this.place);
							const generatedDays = generateDaysArray(place, startDate, endDate);
							item.content = place.text;
							if (place != 'Turismo') item.days = generatedDays;
							else item.days = generatedDays;
							let timestamp = new Date().getTime().toString(16);
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
				//Cuando agrando o muevo un lodging esta función hace trigger
				//Esta funcion va tener que cambiar harto, por el momento la dejo comentada
				// eslint-disable-next-line no-unused-vars
				onMove: (item, callback) => {
					if (this.place) {
						const oldDays = item.days;
						const startDate = moment(item.start);
						const endDate = moment(item.end);

						const newDaysArray = generateDaysArray(
							this.selectedPlace,
							startDate,
							endDate
						);
						const saveOldDaysServices = (oldDays, newDays) => {
							oldDays.forEach(oldDay => {
								const foundIndex = newDays.findIndex(
									newDay => newDay.date === oldDay.date
								);
								if (foundIndex >= 0) newDaysArray[foundIndex] = oldDay;
							});
						};
						saveOldDaysServices(oldDays, newDaysArray);
						//1- el contador i se esta contando la nueva cantidad de dias, esta encargado de recorrer nuestro arreglo de days
						//3- entonces, por cada dia se va pushear un objeto days o se va conservar el existente.
						//4- Si existe algo en la posicion entonces lo retornamos;
						//5- si no existe el dia en la posicion, generamos un dia nuevo para esa posicion con generateSingleDay
						//6- si es un dia nuevo, va ser necesario saber cual va ser la fecha del dia a ingresar;
						item.days = newDaysArray;
						item.start = moment(item.start).hours(15);
						item.end = moment(item.end).hours(12);
						if (this.verifyOverlay(item)) {
							this.setModeEdit(true);
							//Esta funcion ya no funciona con v3, preguntar el por que se actualizan los servvices aca
							/*this.updateService(item);*/
							callback(item);
						} else this.$toasted.show('Existe un alojamiento para esas fechas');
					} else this.$toasted.show('Selecione una entidad primero');
				},
			},
		};
	},
	computed: {
		//funcion de mirrorLodginds
		getMirrorLodging() {
			var hola = JSON.stringify(this.lodgings);
			if (hola === this.mirrorLodging) return false;
			else return true;
		},
		//falta ver para que sirve
		prices() {
			if (this.place) return this.places.find(c => c.value == this.place);
			else return [];
		},
		...mapGetters({
			periodAllPlace: 'Lodging/periodAllPlace',
			lodgingsAllPlace: 'Lodging/lodgingsAllPlace',
			bottomSheet: 'Lodging/bottomSheet',
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
			selectedPlace: 'Lodging/selectedPlace',
			servicesComboBox: 'Lodging/servicesComboBox',
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
		this.setRangeDate({
			start: moment(),
			end: moment().add(15, 'day'),
		});
		this.fetchPlace();
		this.fetchPeriods();
		this.fetchLodgings();
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
			this.setSelectedPlace();
			this.setServicesComboBox();
			this.fetchPeriods(this.place).then(() => this.fetchLodgings());
		},
		//Cuando cambio de valor un servicio, esta funcion se encarga de evaluar si estoy excediendo el numero de pasajeros
		//Esta funcion se encarga de evaluar el valor y luego pasarlo a updateService, updateService es el encargado real de actualizar el valor
		detectServiceQuantityChange(payload, lodgingGroup, lodgingId, dayIndex, serviceIndex) {
			let inputValue = parseInt(payload.target.value);
			//busca el numero de pasajeros en el lodging seleccionado
			const numberPassangerMax = this.periods.get(lodgingGroup).numberPassangerMax;
			//si el valor excede el numero de pasaejeros, se setea el numero de pasajeros como valor y se levanta una notificacion toast
			if (inputValue >= numberPassangerMax) {
				this.$toasted.show('Cantidad máxima de la habitación excedida');
				inputValue = numberPassangerMax;
			}
			//si el valor es menor a 0, se setea el numero de pasajeros como valor
			if (inputValue < 0) inputValue = numberPassangerMax;
			this.updateActualService({ inputValue, lodgingId, dayIndex, serviceIndex });
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
			setBottomSheet: 'Lodging/setBottomSheet',
			subDaysServices: 'Lodging/subDaysServices',
			addDaysServices: 'Lodging/addDaysServices',
			createOneLodging: 'Lodging/createOneLodging',
			addLodging: 'Lodging/addLodging',
			setAllLodgingPersons: 'Lodging/setAllLodgingPersons',
			setLodgingSelect: 'Lodging/setLodgingSelect',
			setModeEdit: 'Lodging/setModeEdit',
			setPlaceLodging: 'Lodging/setPlaceLodging',
			setRangeDate: 'Lodging/setRangeDate',
			updateService: 'Lodging/updateService',
			setSelectedPlace: 'Lodging/setSelectedPlace',
			setServicesComboBox: 'Lodging/setServicesComboBox',
			updateActualService: 'Lodging/updateActualService',
		}),
	},
};
</script>

<style lang="css">
.timelineContent:hover {
	box-shadow: 0px 3px 13px 2px rgba(0, 0, 0, 0.75);
	transition: all ease-in-out 0.5s;
}
.timelineContent {
	background-color: transparent;
	/* background: linear-gradient(90deg, rgba(106, 49, 255, 0.07) 0%, rgba(213, 47, 143, 0.18) 100%); */
	margin-bottom: 20px !important;
	padding: 10px;
	border-radius: 10px;
	box-shadow: 0px 3px 15px 2px rgba(0, 0, 0, 0.2);
	transition: all ease-in-out 0.5s;
}

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
	color: var(--v-textColor) !important;
}

.vis-time-axis .vis-grid.vis-saturday,
.vis-time-axis .vis-grid.vis-sunday {
	background-color: #9090906e !important;
	border: none !important;
}

.inputService {
	max-width: 60px;
}
.vis-timeline {
	margin-bottom: 15px;
	background-color: transparent;
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
