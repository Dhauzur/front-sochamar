<template>
	<v-container fluid>
		<v-row v-if="lodgingSelect">
			<v-col>
				<timeline />
				<v-row v-if="!showPopover">
					<v-col cols="4">
						<v-date-picker
							v-model="dates"
							width="250"
							no-title
							range
							:first-day-of-week="1"
							locale="es"
							:show-current="false"
							scrollable
						>
							<v-spacer></v-spacer>
							<v-btn text color="primary" @click="setDates">Guardar</v-btn>
						</v-date-picker>
					</v-col>
					<v-col cols="6">
						<autocomplete
							v-if="!showPopover"
							:items="personFormatted"
							:selected="addPersonToLodging"
							placeholder="Agregar un pasajero"
						/>
						<v-btn
							v-if="!showPopover"
							color="error"
							text
							@click="deleteLodging(lodgingSelect)"
						>
							Eliminar actividad
						</v-btn>
					</v-col>
				</v-row>
				<v-row>
					<!-- badge person -->
					<v-col v-if="!showPopover">
						<v-badge
							v-for="(item, i) in lodgingPersons"
							:id="`show${i}`"
							:key="i"
							pill
							target="_blank"
							class="ml-1 mr-1"
							>{{ item.search }}: {{ item.dateStart }} - {{ item.dateEnd }}
							<span class="text-danger ml-1 pointer" @click="removeLodgingPersons(i)"
								>X</span
							>
						</v-badge>
					</v-col>
					<v-col v-show="showPopover">
						<v-menu
							ref="menu"
							v-model="menu"
							:close-on-content-click="false"
							:return-value.sync="date"
							transition="scale-transition"
							offset-y
							min-width="290px"
						>
							<template v-slot:activator="{ on }">
								<v-text-field
									v-model="date"
									label="Picker in menu"
									prepend-icon="event"
									readonly
									v-on="on"
								></v-text-field>
							</template>
							<v-date-picker
								v-model="datesPersons"
								width="250"
								no-title
								range
								:first-day-of-week="1"
								locale="es"
								:show-current="false"
								scrollable
							>
								<v-spacer></v-spacer>
								<v-btn text color="primary" @click="menu = false">Cancel</v-btn>
								<v-btn text color="primary">OK</v-btn>
							</v-date-picker>
						</v-menu>
					</v-col>
					<!-- <v-col v-show="showPopover">
						<LodgingsDate
							label="Fecha inicio"
							:start="true"
							:set-date="date => (dateStartPersons = date)"
							:date-start="dateStart"
							:date-end="dateEnd"
							:is-person-date="true"
							:error-date="errorDate"
						/>
						<LodgingsDate
							label="Fecha fin"
							:start="false"
							:set-date="date => (dateEndPersons = date)"
							:date-start="dateStart"
							:date-end="dateEnd"
							:is-person-date="true"
							:error-date="errorDate"
						/>
					</v-col> -->
					<v-col>
						<v-btn
							v-show="showPopover"
							color="primary"
							rounded
							small
							:disabled="datePersonsInvalid"
							@click="setDatePerson"
						>
							Agregar
						</v-btn>
						<v-btn
							v-if="showPopover"
							text
							small
							variant="danger"
							@click="cancelAddPerson"
						>
							Cancelar
						</v-btn>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import moment from 'moment';
import Autocomplete from '@/components/ui/autocomplete/Autocomplete';
import { mapMutations, mapGetters, mapActions } from 'vuex';
import { Timeline } from 'vue2vis';

export default {
	name: 'EditLodgings',
	components: {
		Autocomplete,
		Timeline,
	},
	data() {
		return {
			menu: false,
			dates: [],
			datesPersons: [],
			dateEnd: null,
			dateEndLodging: null,
			dateEndPersons: null,
			datePersonsInvalid: false,
			dateStart: null,
			dateStartLodging: null,
			dateStartPersons: null,
			isLoadingPerson: false,
			oldDateLodging: null,
			personSelected: null,
			results: [],
			showPopover: false,
		};
	},
	computed: {
		personFormatted() {
			return this.persons.map(item => ({
				search: `${item.firstName} ${item.lastName ? item.lastName : ''}`,
				data: item,
			}));
		},
		...mapGetters({
			lodgingPersons: 'Lodging/lodgingPersons',
			lodgings: 'Lodging/lodgings',
			lodgingSelect: 'Lodging/lodgingSelect',
			persons: 'Persons/persons',
		}),
	},
	watch: {
		lodgingSelect() {
			this.setDateIntheState();
		},
		//Si la modificacion al nuevo hpspedaje no es valida, el input date vuelve a su posicion original
		dateStartLodging(newDate, oldDate) {
			this.oldDateLodging = oldDate;
		},
		dateEndLodging(newDate, oldDate) {
			this.oldDateLodging = oldDate;
		},
	},
	mounted() {
		this.setDateIntheState();
	},
	methods: {
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
		async setDates() {
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
			this.dateStartLodging = moment(this.lodgingSelect.start).format('YYYY-MM-DD');
			this.dateEndLodging = moment(this.lodgingSelect.end).format('YYYY-MM-DD');
			this.dateStart = moment(this.lodgingSelect.start).format('YYYY-MM-DD');
			this.dateEnd = moment(this.lodgingSelect.end).format('YYYY-MM-DD');
			this.dates = [this.dateStartLodging, this.dateEndLodging];
		},
		/**
		 * used for disabled button when person date is invalid
		 */
		errorDate(boolean) {
			this.datePersonsInvalid = boolean;
		},
		/**
		 * set date person in the store
		 */
		setDatePerson() {
			if (this.dateStartPersons === null) {
				this.dateStartPersons = this.dateStart;
			}
			if (this.dateEndPersons === null) {
				this.dateEndPersons = this.dateEnd;
			}

			this.verifyOverlay() === 'OK'
				? this.updateLodgingPersons({
						id: this.personSelected.data._id,
						search: this.personSelected.search,
						dateStart: this.dateStartPersons,
						dateEnd: this.dateEndPersons,
				  })
				: this.$toasted.show(`Ya existe un pasajero para el rango de fecha selecionado`, {
						type: 'error',
				  });

			this.personSelected = null;
			this.showPopover = false;
		},
		/**
		 * cancel the adiction person when close the popover
		 */
		cancelAddPerson() {
			this.showPopover = false;
			this.personSelected = '';
		},
		/**
		 * add a person to lodging from autocomplete
		 * show popover for set date
		 */
		addPersonToLodging(selected) {
			this.showPopover = true;
			this.personSelected = selected;
		},
		/**
		 * check if date of person ir already taken
		 */
		verifyOverlay() {
			let verificate = null;
			let temp = this.lodgingPersons.filter(person => {
				return person.id === this.personSelected.data._id;
			});

			if (temp.length > 0) {
				temp.map(item => {
					if (
						(moment(this.dateStartPersons).isBefore(moment(item.dateStart)) &&
							moment(this.dateEndPersons).isBefore(moment(item.dateStart))) ||
						(moment(this.dateStartPersons).isAfter(moment(item.dateEnd)) &&
							moment(this.dateEndPersons).isAfter(moment(item.dateEnd)))
					) {
						verificate = 'OK';
					} else {
						verificate = 'No puede agregar en esa fecha';
					}
				});
			} else {
				verificate = 'OK';
			}

			return verificate;
		},
		...mapActions({
			deleteLodging: 'Lodging/deleteLodging',
			saveLodgings: 'Lodging/saveLodgings',
		}),
		...mapMutations({
			sendDateChange: 'Lodging/dateChange',
			updateLodgingPersons: 'Lodging/updateLodgingPersons',
			removeLodgingPersons: 'Lodging/removeLodgingPersons',
			fetchRooms: 'Room/fetchRooms',
		}),
	},
};
</script>
