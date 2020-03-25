<template>
	<v-container fluid style="height: 70vh; overflow: auto">
		<v-row>
			<v-col cols="12">
				<v-tabs v-model="tab">
					<v-tab>Detalles</v-tab>
					<v-tab>Habitaciones</v-tab>
				</v-tabs>
				<v-tabs-items v-model="tab">
					<v-tab-item>
						<!-- @todo remove dialog changeDate -->
						<v-dialog v-model="dialogChangeDate" width="290px">
							<template v-slot:activator="{ on }">
								<v-btn small color="accent" class="ma-2 d-none" v-on="on">
									Cambiar fecha del hospedaje
								</v-btn>
							</template>
							<v-date-picker
								v-model="dates"
								no-title
								range
								locale="es"
								:show-current="false"
								scrollable
							>
								<v-spacer></v-spacer>
								<v-btn small text @click="dialogChangeDate = false">
									Cancel
								</v-btn>
								<v-btn small text color="primary" @click="setDates">
									Guardar
								</v-btn>
							</v-date-picker>
						</v-dialog>
						<!-- steppers -->
						<v-dialog v-model="dialogAddPerson" max-width="440">
							<v-stepper v-model="stepper" class="elevation-12">
								<v-stepper-header>
									<v-stepper-step :complete="stepper > 1" step="1">
										Persona
									</v-stepper-step>
									<v-divider></v-divider>
									<v-stepper-step :complete="stepper > 2" step="2">
										Fecha
									</v-stepper-step>
									<v-stepper-step :complete="stepper > 3" step="3">
										Habitación
									</v-stepper-step>
								</v-stepper-header>
								<v-stepper-items>
									<v-stepper-content step="1">
										<v-autocomplete
											v-model="personSelected"
											solo
											:items="personFormatted"
											:filter="customFilter"
											color="white"
											item-value="data"
											item-text="search"
											label="Buscar persona"
											clearable
										></v-autocomplete>
										<v-btn
											:disabled="Boolean(!personSelected)"
											small
											text
											color="primary"
											@click="stepper = 2"
										>
											Continuar
										</v-btn>
										<v-btn small text @click="closeDialogPerson">
											Cancelar
										</v-btn>
									</v-stepper-content>
									<v-stepper-content step="2">
										<v-date-picker
											v-model="datesPersons"
											no-title
											range
											locale="es"
											:show-current="false"
											scrollable
											class="elevation-0 mb-2"
											:max="dateEnd"
											:min="dateStart"
										>
										</v-date-picker>
										<v-btn small text color="primary" @click="stepper = 3">
											Continuar
										</v-btn>
										<v-btn text small @click="closeDialogPerson">
											Cancelar
										</v-btn>
									</v-stepper-content>
									<v-stepper-content step="3">
										<v-select
											v-model="select"
											:items="selectRooms"
											outlined
											item-value="id"
											item-text="name"
											dense
										></v-select>
										<v-btn text small @click="closeDialogPerson">
											Cancelar
										</v-btn>
										<v-btn small text color="primary" @click="setDatePerson">
											Guardar
										</v-btn>
									</v-stepper-content>
								</v-stepper-items>
							</v-stepper>
						</v-dialog>
						<timeline
							v-if="componentReady"
							id="timelinePeople"
							:items="items"
							:groups="groups"
							:options="options"
						/>
					</v-tab-item>
					<v-tab-item>
						<rooms v-if="idPlace" :id-place="idPlace" />
					</v-tab-item>
				</v-tabs-items>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import moment from 'moment';
import Rooms from '@/components/rooms/Rooms';
import { mapMutations, mapGetters, mapActions } from 'vuex';
import { Timeline } from 'vue2vis';

export default {
	name: 'EditLodgings',
	components: {
		Timeline,
		Rooms,
	},
	props: {
		lodgings: {
			type: Object,
			required: true,
		},
		idPlace: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			componentReady: false,
			tab: 0,
			select: 'Sin habitación',
			stepper: 1,
			dialogChangeDate: false,
			dialogAddPerson: false,
			dialogTableRooms: false,
			dates: [],
			datesPersons: [],
			dateStart: null,
			dateEnd: null,
			dateEndLodging: null,
			dateStartLodging: null,
			oldDateLodging: null,
			personSelected: null,
		};
	},
	computed: {
		selectRooms() {
			let rooms = [];
			if (this.rooms) {
				rooms = [...this.rooms];
			}
			rooms.unshift('Sin habitación');
			return rooms;
		},
		groups() {
			let groups = [{ id: 'Sin habitación' }];
			if (this.rooms) {
				this.rooms.map(room => groups.push({ id: room.id, content: room.name }));
				return groups;
			}
			return groups;
		},
		items() {
			if (this.lodgingSelect.persons) {
				return this.lodgingSelect.persons.map((person, index) => ({
					index,
					id: person.id,
					idPerson: person.idPerson,
					group: person.group,
					start: person.dateStart,
					end: person.dateEnd,
					content: person.name,
				}));
			}
			return [];
		},
		options() {
			return {
				editable: true,
				start: moment(this.lodgingSelect.start),
				end: moment(this.lodgingSelect.end),
				zoomMin: 1000 * 60 * 60 * 24 * 7,
				zoomMax: 1000 * 60 * 60 * 24 * 30,
				onRemove: item => {
					this.removeLodgingPersons(item.index);
					this.setBottomSheet({ action: false, lodging: null });
					this.setBottomSheet({ action: true, lodging: this.lodgingSelect.id });
					this.saveLodgings();
				},
				onAdd: () => {
					this.openDialogPerson();
				},
				onMove: (item, callback) => {
					if (
						this.verifyOverlay({
							id: item.idPerson,
							dateStart: item.start,
							dateEnd: item.end,
							timestamp: item.id,
						})
					) {
						this.updatePersonsLodging(item);
						callback(item);
						this.setBottomSheet({ action: false, lodging: null });
						this.setBottomSheet({ action: true, lodging: this.lodgingSelect.id });
						this.saveLodgings();
					} else {
						this.$toasted.show(
							'Ya existe el pasajero para el rango de fecha selecionado',
							{ type: 'error' }
						);
					}
				},
			};
		},
		personFormatted() {
			return this.persons.map(item => ({
				search: `${item.firstName} ${item.lastName ? item.lastName : ''}`,
				data: item,
			}));
		},
		...mapGetters({
			rooms: 'Room/rooms',
			lodgingPersons: 'Lodging/lodgingPersons',
			lodgingSelect: 'Lodging/lodgingSelect',
			persons: 'Persons/persons',
			loadingRooms: 'Room/loading',
		}),
	},
	watch: {
		lodgingSelect() {
			this.setDateIntheState();
		},
		//Si la modificacion al nuevo hpspedaje no es valida, el input date vuelve a su posicion original
		dateStart(newDate, oldDate) {
			this.oldDateLodging = oldDate;
		},
		dateEnd(newDate, oldDate) {
			this.oldDateLodging = oldDate;
		},
	},
	mounted() {
		this.setDateIntheState();
		this.fetchRooms(this.idPlace);
		setTimeout(() => (this.componentReady = true), 800);
	},
	methods: {
		openDialogPerson() {
			this.dialogAddPerson = true;
		},
		closeDialogPerson() {
			this.personSelected = null;
			this.dialogAddPerson = false;
			this.select = 'Sin habitación';
			this.stepper = 1;
		},
		customFilter(item, queryText) {
			const textOne = item.search.toLowerCase();
			const searchText = queryText.toLowerCase();

			return textOne.indexOf(searchText) > -1;
		},
		setDateStart() {
			// set startdate from array dates
			if (moment(this.dates[0]).isBefore(moment(this.dates[1]))) {
				return this.dates[0];
			} else {
				moment(this.dates[1]).isBefore(moment(this.dates[0]));
				return this.dates[1];
			}
		},
		setDateEnd() {
			// set enddate from array dates
			if (moment(this.dates[0]).isAfter(moment(this.dates[1]))) {
				return this.dates[0];
			} else {
				moment(this.dates[1]).isAfter(moment(this.dates[0]));
				return this.dates[1];
			}
		},
		setDateStartPerson() {
			// set startdate from array dates
			if (moment(this.datesPersons[0]).isBefore(moment(this.dates[1]))) {
				return this.datesPersons[0];
			} else {
				moment(this.datesPersons[1]).isBefore(moment(this.dates[0]));
				return this.datesPersons[1];
			}
		},
		setDateEndPerson() {
			// set enddate from array dates
			if (moment(this.datesPersons[0]).isAfter(moment(this.dates[1]))) {
				return this.datesPersons[0];
			} else {
				moment(this.datesPersons[1]).isAfter(moment(this.dates[0]));
				return this.datesPersons[1];
			}
		},
		setDates() {
			let verificate = true;
			const start = this.setDateStart();
			const end = this.setDateEnd();
			this.lodgings.forEach(lod => {
				/*Verifica que se este usando la misma habitacion, y que el hospedaje selecionado sea distinto
				 * al comparado. Y luego verifica que la fecha este fuera de algun otro hospedaje
				 */
				if (lod.group == this.lodgingSelect.group && this.lodgingSelect.id != lod.id) {
					if (
						moment(start).isBefore(moment(lod.end).format('YYYY-MM-DD')) &&
						moment(end).isAfter(moment(lod.start).format('YYYY-MM-DD'))
					)
						verificate = false;
				}
			});
			if (verificate) {
				this.sendDateChange({
					dateStart: start,
					dateEnd: end,
				});
				this.saveLodgings();
			} else {
				this.$toasted.show('Existe un alojamiento para esas fechas');
			}
		},
		setDateIntheState() {
			this.dateStart = moment(this.lodgingSelect.start).format('YYYY-MM-DD');
			this.dateEnd = moment(this.lodgingSelect.end).format('YYYY-MM-DD');
			this.datesPersons = [this.dateStart, this.dateEnd];
			this.dates = [this.dateStart, this.dateEnd];
		},
		/**
		 * set date person in the store
		 */
		setDatePerson() {
			const oldIdLodgingSelect = this.lodgingSelect.id;
			const id = this.personSelected._id;
			const name = `${this.personSelected.firstName} ${
				this.personSelected.lastName ? this.personSelected.lastName : ''
			}`;
			const dateStart = this.setDateStartPerson()
				? this.setDateStartPerson()
				: this.dateStart;
			const dateEnd = this.setDateEndPerson() ? this.setDateEndPerson() : this.dateEnd;
			const group = this.select;
			this.verifyOverlay({ id, dateStart, dateEnd })
				? this.addPersonsLodging({
						id: Date.now(),
						idPerson: id,
						group,
						name,
						dateStart,
						dateEnd,
				  })
				: this.$toasted.show(`Ya existe un pasajero para el rango de fecha selecionado`, {
						type: 'error',
				  });
			this.personSelected = null;
			this.saveLodgings();
			this.closeDialogPerson();
			this.setBottomSheet({ action: false, lodging: null });
			this.setBottomSheet({ action: true, lodging: oldIdLodgingSelect });
		},
		/**
		 * Check date of person is already taken
		 * @param {Object} element to verify overlay
		 * @param {String} element.id id person
		 * @param {String} element.dateStart dateStart person
		 * @param {String} element.dateEnd dateEnd person
		 */
		verifyOverlay(element) {
			let verificate = true;
			let temp = this.lodgingPersons.filter(person => {
				return person.idPerson === element.id && person.id !== element.timestamp;
			});

			temp.length &&
				temp.map(item => {
					let validation =
						(moment(element.dateStart).isBefore(moment(item.dateStart)) &&
							moment(element.dateEnd).isBefore(moment(item.dateStart))) ||
						(moment(element.dateStart).isAfter(moment(item.dateEnd)) &&
							moment(element.dateEnd).isAfter(moment(item.dateEnd)));
					if (!validation) {
						verificate = false;
					}
				});

			return verificate;
		},
		...mapActions({
			fetchRooms: 'Room/fetchRooms',
			deleteLodging: 'Lodging/deleteLodging',
			saveLodgings: 'Lodging/saveLodgings',
		}),
		...mapMutations({
			setLodgingSelect: 'Lodging/setLodgingSelect',
			setBottomSheet: 'Lodging/setBottomSheet',
			sendDateChange: 'Lodging/dateChange',
			addPersonsLodging: 'Lodging/addPersonsLodging',
			updatePersonsLodging: 'Lodging/updatePersonsLodging',
			removeLodgingPersons: 'Lodging/removeLodgingPersons',
		}),
	},
};
</script>

<style lang="scss">
// #timelinePeople > .vis-left {
// 	min-height: 250px !important;
// }

// #timelinePeople > .vis-label {
// 	background-color: red !important;
// 	min-height: 220px !important;
// }
//
// #timelinePeople > .vis-group {
// 	background-color: red !important;
//
// 	min-height: 220px !important;
// }

.vis-horizontal {
	min-height: 150px !important;
}
</style>
