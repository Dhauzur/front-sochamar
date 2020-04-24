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
						v-model="selectPlace"
						:items="places"
						dense
						filled
						label="Selecione lugar"
						outlined
						@change="setPlace"
					>
					</v-select>
				</v-col>
				<!-- export pdf button -->
				<v-col cols="12" sm="2" md="auto" class="mt-2">
					<v-btn block color="primary" small @click="exportToPdf">
						<span>Exportar pdf</span>
					</v-btn>
				</v-col>
				<!-- export csv button -->
				<v-col cols="12" sm="2" md="auto" class="mt-2">
					<v-btn block color="primary" small @click="exportToCsv">
						<span>Exportar csv</span>
					</v-btn>
				</v-col>
				<!-- activity button -->
				<v-col v-if="selectedPlace" cols="12" sm="2" md="auto">
					<v-tooltip v-if="periods.length > 0" attach bottom>
						<template v-slot:activator="{ on }">
							<v-btn color="primary" block @click="createOneLodging()" v-on="on">
								<v-icon>mdi-plus</v-icon><span>Actividad</span>
							</v-btn>
						</template>
						<span>Añadir hospedaje</span>
					</v-tooltip>
				</v-col>
				<!-- periods buttons -->
				<v-col v-if="selectedPlace" cols="12" sm="2" md="auto">
					<v-tooltip attach bottom>
						<template v-slot:activator="{ on }">
							<v-btn
								block
								color="primary"
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
				<v-col v-if="selectedPlace" cols="12" sm="2" md="auto">
					<v-tooltip attach bottom>
						<template v-slot:activator="{ on }">
							<v-btn
								block
								color="primary"
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
				<v-col v-if="selectedPlace" cols="12" sm="2" md="auto">
					<v-tooltip attach bottom>
						<template v-slot:activator="{ on }">
							<v-btn
								block
								color="primary"
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
				<v-col v-if="getMirrorLodging || editMode" cols="12" sm="2" md="auto">
					<v-tooltip attach bottom class="mr-2">
						<template v-slot:activator="{ on }">
							<v-btn color="success" @click="saveLodgings()" v-on="on">
								<v-icon>mdi-content-save</v-icon><span>Guardar</span>
							</v-btn>
						</template>
						<span>Guardar</span>
					</v-tooltip>
				</v-col>
				<!-- periods dialog -->
				<v-bottom-sheet
					v-if="selectedPlace"
					v-model="bottomSheet"
					inset
					@click:outside="setBottomSheet(false)"
				>
					<v-sheet style="height: 75vh">
						<edit-lodging :lodgings="lodgings" :id-place="selectedPlace.value" />
					</v-sheet>
				</v-bottom-sheet>
				<v-bottom-sheet
					v-if="selectedPlace"
					v-model="dialogPeriods"
					inset
					@click:outside="dialogPeriods = false"
				>
					<v-sheet style="height: 75vh">
						<Periods :id-place="selectedPlace.value" />
					</v-sheet>
				</v-bottom-sheet>
				<!-- payments dialog -->

				<v-bottom-sheet
					v-if="dialogPayments"
					v-model="dialogPayments"
					inset
					@click:outside="dialogPayments = false"
				>
					<v-sheet style="height: 75vh; overflow-y: auto;">
						<Payments :id-place="selectedPlace.value" />
					</v-sheet>
				</v-bottom-sheet>
				<!-- <template v-if="Boolean(place) && dialogPayments">
					<v-dialog v-model="dialogPayments" fullscreen>
						<v-card>
							<v-toolbar dark color="primary">
								<v-btn icon dark @click="dialogPayments = false">
									<v-icon>mdi-close</v-icon>
								</v-btn>
								<v-toolbar-title>Gestion de Pagos</v-toolbar-title>
							</v-toolbar>
							<Payments :id-place="selectedPlace" />
						</v-card>
					</v-dialog>
				</template> -->
			</v-row>
			<!-- timeline -->
			<v-row class="mx-1">
				<v-col v-if="selectedPlace" cols="12" class="px-0">
					<transition name="fade">
						<Timeline
							v-if="periods.length > 0 && lodgings.length > 0"
							:items="lodgings"
						/>
					</transition>
				</v-col>
				<!-- <template v-for="(p, index) in places" v-else>
					<v-col v-if="p.value" :key="index" class="px-0 mb-4 " cols="12">
						<h4 class="mb-2">{{ p.text }}</h4>
						<Timeline
							v-if="periods.length > 0 && lodgings.length > 0"
							:events="['rangechanged', 'click', 'doubleClick']"
							:class="{ timelineModeLight: theme, timelineModeDark: !theme }"
							:groups="periodAllPlace(p.value)"
							:items="lodgingsAllPlace(p.value)"
							:options="options"
							@click="enableEdit"
							@rangechanged="rangechanged"
							@double-click="setBottomSheet({ action: true, lodging: null })"
						/>
					</v-col>
				</template> -->
			</v-row>
			<v-row>
				<v-col cols="12">
					<v-row>
						<v-col cols="12" class="overflow-x-auto">
							<v-switch
								v-if="selectedPlace && lodgingSelect"
								v-model="viewPrices"
								label="Ver precios"
							></v-switch>
							<div class="d-inline-flex  pb-3 ">
								<div
									v-for="(day, dayIndex) in servicesTableDetails.days"
									:key="dayIndex"
									class="microCard  "
									style="min-width: max-content;"
								>
									{{ day.date }}
									<table>
										<thead>
											<tr>
												<th>Servicio</th>
												<th>Cantidad</th>
											</tr>
										</thead>
										<tbody>
											<tr
												v-for="(service, serviceIndex) in day.services"
												:key="serviceIndex"
											>
												<td style="max-width: 200px;">
													<b>{{ service.name }}</b>
													<span v-if="viewPrices">
														<br />(${{ service.price }})
													</span>
												</td>
												<td>
													<input
														:id="day.date + day.services[serviceIndex]"
														:value="service.quantity"
														type="number"
														class="inputService"
														@change="
															detectServiceQuantityChange(
																$event,
																servicesTableDetails.id,
																dayIndex,
																serviceIndex
															)
														"
													/>

													<div>
														${{ service.price * service.quantity }}
													</div>
												</td>
											</tr>
											<tr>
												<td>Subtotal</td>
												<td>
													<b>{{ day.dayTotal }} </b>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</template>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { generatePdfReport, generateCsvReport } from '@/service/lodgings';

let moment = extendMoment(Moment);

export default {
	components: {
		EditLodging: () => import('@/components/lodgings/EditLodging'),
		Periods: () => import('@/components/periods/Periods'),
		Payments: () => import('@/components/payments/Payments'),
		Timeline: () => import('@/components/lodgings/Timeline'),
	},
	data() {
		return {
			selectPlace: null,
			dateLodgingSelect: [],
			modalDateLodgingSelect: false,
			viewPrices: false,
			dialogPeriods: false,
			dialogPayments: false,
			onMovingNotificationControl: true,
			sheet: false,
			serviceSelected: 'todos los servicios',
		};
	},
	computed: {
		theme() {
			return localStorage.getItem('mode');
		},
		servicesTableDetails() {
			if (this.selectedPlace && this.lodgingSelect) {
				let lodging = this.lodgings.get(this.lodgingSelect.id);
				return lodging;
			} else return 'Debe selecionar un lugar y lodging para ver data';
		},
		getMirrorLodging() {
			if (this.lodgings === this.mirrorLodging) return false;
			else return true;
		},
		...mapGetters({
			periodAllPlace: 'Lodging/periodAllPlace',
			bottomSheet: 'Lodging/bottomSheet',
			editMode: 'Lodging/editMode',
			loading: 'Lodging/loading',
			lodgings: 'Lodging/lodgings',
			lodgingSelect: 'Lodging/lodgingSelect',
			message: 'Lodging/message',
			mirrorLodging: 'Lodging/mirrorLodging',
			periods: 'Lodging/periods',
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
			if (this.lodgingSelect) {
				let datePicker = [];
				datePicker.push(moment(this.lodgingSelect.start).format('YYYY-MM-DD'));
				datePicker.push(moment(this.lodgingSelect.end).format('YYYY-MM-DD'));
				this.dateLodgingSelect = datePicker;
			}
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
	},
	methods: {
		// updateLodgingSelect() {
		// 	if (this.verifyOverlay(this.lodgingSelect)) {
		// 		this.setModeEdit(true);
		// 		this.);
		// 	} else {
		// 		this.$toasted.show('Existe un alojamiento para esas fechas');
		// 	}
		// },
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
		setPlace(place) {
			this.setModeEdit(false);
			console.log(place);
			this.setSelectedPlace(place);
			this.setServicesComboBox();
			this.fetchPeriods().then(() => this.fetchLodgings());
		},
		detectServiceQuantityChange(payload, lodgingId, dayIndex, serviceIndex) {
			let inputValue = parseInt(payload.target.value);
			let numberPassangerMax = this.periods.get(this.lodgings.get(lodgingId).group)
				.numberPassangerMax;
			if (inputValue > numberPassangerMax) {
				this.$toasted.show('Cantidad máxima de la habitación excedida');
				inputValue = 0;
			}
			if (inputValue < 0) inputValue = numberPassangerMax;
			this.updateActualService({ inputValue, lodgingId, dayIndex, serviceIndex });
		},
		enableEdit(payload) {
			if (this.selectedPlace && payload.item) {
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
		async exportToPdf() {
			const pdf = await generatePdfReport(this.place);
			let blob = new Blob([pdf], { type: 'application/pdf' });
			let link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = 'hospedajes.pdf';
			link.click();
		},
		async exportToCsv() {
			const csv = await generateCsvReport(this.place);
			let blob = new Blob([csv], { type: 'text/csv' });
			let link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = 'hospedajes.csv';
			link.click();
		},
		...mapActions({
			deleteLodging: 'Lodging/deleteLodging',
			fetchLodgings: 'Lodging/fetchLodgings',
			fetchPeriods: 'Lodging/fetchPeriods',
			fetchPlace: 'Lodging/fetchPlace',
			saveLodgings: 'Lodging/saveLodgings',
		}),
		...mapMutations({
			setSelectedPlace: 'Lodging/setSelectedPlace',
			dateChange: 'Lodging/dateChange',
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
			setServicesComboBox: 'Lodging/setServicesComboBox',
			updateActualService: 'Lodging/updateActualService',
		}),
	},
};
</script>

<style lang="css">
.subTotalTable {
	min-width: 100px;
}
.dateDayCard {
	border: 1px solid #0000006b;
	border-radius: 10px;
	padding: 10px;
	margin-right: 15px;
	margin-left: -15px;
	min-width: 400px;
	max-height: 41px;
}
.microCard {
	border-radius: 10px;
	background-color: transparent;
	margin-right: 10px;
	padding: 5px;
	box-shadow: 0px 1px 5px -2px rgba(0, 0, 0, 0.75);
}

.vis-selected {
	background-color: #6a31ff !important;
	transition: all ease-in-out 0.3s;
}

/* .vis-time-axis .vis-text,
.vis-label,
.vis-inner,
.vis-time-axis .vis-text.vis-saturday,
.vis-time-axis .vis-text.vis-sunday {
} */

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

input {
	text-align: center;
}

.inputService {
	width: 80px;
	box-shadow: 0px 3px 7px -1px rgba(0, 0, 0, 0.8);
	padding-left: 5px;
}
.vis-timeline {
	margin-bottom: 15px;
	background-color: transparent;
	border: none !important;
}
.vis-item {
	background-color: #6a30ffcc;
	box-shadow: 0px 0px 5px -2px rgba(0, 0, 0, 0.95);
	border: none !important;
	border-left: 4px solid #6a31ff !important;
	transition: all ease-in-out 0.2s;
}
</style>
