<template>
	<v-card elevation="6">
		<v-container>
			<v-row>
				<v-col cols="10" class="text-left title">Lodging1</v-col>
				<!-- save buttons -->
				<v-col cols="2">
					<v-tooltip attach bottom>
						<template v-slot:activator="{ on }">
							<v-btn fab color="success" small @click="submit" v-on="on">
								<v-icon>mdi-content-save</v-icon>
							</v-btn>
						</template>
						<span>Guardar</span>
					</v-tooltip>
				</v-col>
				<v-col cols="5">
					<v-menu
						ref="menu"
						v-model="menu"
						:close-on-content-click="false"
						:return-value.sync="dates"
						transition="scale-transition"
						offset-y
						min-width="290px"
					>
						<template v-slot:activator="{ on }">
							<v-text-field
								v-model="dates"
								dense
								readonly
								clearable
								filled
								outlined
								append-icon="mdi-calendar-clock"
								label="Fecha de ingreso y salida"
								v-on="on"
							></v-text-field>
						</template>
						<v-date-picker
							v-model="dates"
							outlined
							range
							locale="es"
							no-title
							scrollable
						>
							<v-spacer></v-spacer>
							<v-btn text color="primary" @click="menu = false">Cancelar</v-btn>
							<v-btn text color="primary" @click="$refs.menu.save(dates)">OK</v-btn>
						</v-date-picker>
					</v-menu>
				</v-col>
				<v-col cols="7"></v-col>
				<v-col cols="4">
					<v-autocomplete
						v-model="periodSelected"
						:hint="
							!isEditing
								? 'Click sobre el icono para editar'
								: 'Click sobre el icono para guardar'
						"
						:items="itemsAutocompletePeriods"
						:readonly="!isEditing"
						:label="`${isEditing ? 'Editable' : 'Seleccione Turno'}`"
						outlined
						dense
						filled
						persistent-hint
						no-data-text="No hay turnos agregados"
					>
						<template v-slot:append-outer>
							<v-slide-x-reverse-transition mode="out-in">
								<v-icon
									:key="`icon-${isEditing}`"
									:color="isEditing ? 'success' : 'info'"
									@click="isEditing = !isEditing"
									v-text="
										isEditing ? 'mdi-check-outline' : 'mdi-circle-edit-outline'
									"
								></v-icon>
							</v-slide-x-reverse-transition>
						</template>
					</v-autocomplete>
				</v-col>
				<v-col cols="4">
					<v-autocomplete
						v-model="roomSelected"
						:hint="
							!isEditingRoom
								? 'Click sobre el icono para editar'
								: 'Click sobre el icono para guardar'
						"
						:items="itemsAutocompleteRooms"
						:readonly="!isEditingRoom"
						:label="`${isEditingRoom ? 'Editable' : 'Seleccione habitacion *opcional'}`"
						outlined
						dense
						filled
						no-data-text="No hay habitaciones agregadas"
						persistent-hint
					>
						<template v-slot:append-outer>
							<v-slide-x-reverse-transition mode="out-in">
								<v-icon
									:key="`icon-${isEditingRoom}`"
									:color="isEditingRoom ? 'success' : 'info'"
									@click="isEditingRoom = !isEditingRoom"
									v-text="
										isEditingRoom
											? 'mdi-check-outline'
											: 'mdi-circle-edit-outline'
									"
								></v-icon>
							</v-slide-x-reverse-transition>
						</template>
					</v-autocomplete>
				</v-col>
				<v-col cols="4">
					<v-autocomplete
						v-model="personSelected"
						:hint="
							!isEditingPerson
								? 'Click sobre el icono para editar'
								: 'Click sobre el icono para guardar'
						"
						:items="itemsAutocompletePersons"
						:readonly="!isEditingPerson"
						:label="`${isEditingPerson ? 'Editable' : 'Seleccione persona'}`"
						outlined
						dense
						filled
						no-data-text="No hay Personas agregadas"
						persistent-hint
					>
						<template v-slot:append-outer>
							<v-slide-x-reverse-transition mode="out-in">
								<v-icon
									:key="`icon-${isEditingPerson}`"
									:color="isEditingPerson ? 'success' : 'info'"
									@click="isEditingPerson = !isEditingPerson"
									v-text="
										isEditingPerson
											? 'mdi-check-outline'
											: 'mdi-circle-edit-outline'
									"
								></v-icon>
							</v-slide-x-reverse-transition>
						</template>
					</v-autocomplete>
				</v-col>
				<v-col cols="12">
					<Calendar></Calendar>
				</v-col>
			</v-row>
		</v-container>
	</v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { getPersonsByCompany } from '@/service/persons';
import moment from 'moment';

export default {
	components: { Calendar: () => import('@/components/lodgings/Calendar') },
	data() {
		return {
			calendar: [],
			dates: [],
			isEditing: false,
			isEditingPerson: false,
			isEditingRoom: false,
			menu: false,
			periodSelected: null,
			persons: [],
			personSelected: null,
			roomSelected: null,
		};
	},
	computed: {
		itemsAutocompletePeriods() {
			return this.periods.map(item => ({ value: item._id, text: item.name }));
		},
		itemsAutocompleteRooms() {
			return this.rooms.map(item => ({ value: item.id, text: item.name }));
		},
		itemsAutocompletePersons() {
			return this.persons.map(item => ({
				value: item._id,
				text: `${item.firstName} ${item.lastName ? item.lastName : ''}`,
			}));
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
		totalDays() {
			if (this.setDateStart && this.setDateEnd) {
				return moment(this.setDateEnd).diff(moment(this.setDateStart), 'days') + 1;
			}
			return null;
		},
		...mapGetters({
			profile: 'User/profile',
			rooms: 'Room/rooms',
			periods: 'Lodging/periods',
			lodgingSelect: 'Lodging/lodgingSelect',
			selectedPlace: 'Lodging/selectedPlace',
			countLogingsPlace: 'Lodging/countLogingsPlace',
		}),
	},
	mounted() {
		getPersonsByCompany(this.profile._id).then(response => (this.persons = response));
	},
	methods: {
		submit() {
			const name = `${this.selectedPlace.text}-${this.countLogingsPlace + 1}`;
			const data = {
				name: name,
				group: this.periodSelected,
				room: this.roomSelected,
				person: this.personSelected,
				place: this.selectedPlace.value,
				calendar: this.calendar,
				start: this.setDateStart,
				end: this.setDateEnd,
				totalDays: this.totalDays,
			};
			this.createLodging(data);
		},
		...mapActions({
			createLodging: 'Lodging/createLodging',
		}),
	},
};
</script>

<style lang="scss" scoped></style>
