<template lang="html">
	<b-row v-if="lodgingSelect">
		<b-col class="borderModule p-3 m-3">
			<h4>Edición de "{{ lodgingSelect.content }}"</h4>
			<b-row>
				<b-col md="4" lg="6">
					<b-form-group
						id="input-group-1"
						label="Fecha inicio"
						label-for="input-1"
						description="Selecione la fecha que desea cambiar."
					>
						<b-form-input
							id="input-1"
							v-model="dateStartLodging"
							type="date"
							:value="dateStartLodging"
							class="col-xs-2 "
							style="text-align: center; text-align-last:center;"
							required
							@change="dateChange({ dateStartLodging, dateEndLodging, start: true })"
						/>
					</b-form-group>
				</b-col>
				<b-col md="4" lg="6">
					<b-form-group
						id="input-group-1"
						label="Fecha fin"
						label-for="input-1"
						description="Selecione la fecha que desea cambiar."
					>
						<b-form-input
							id="input-1"
							v-model="dateEndLodging"
							type="date"
							class="col-xs-2 "
							style="text-align: center; text-align-last:center;"
							required
							@change="dateChange({ dateStartLodging, dateEndLodging, start: false })"
						/>
					</b-form-group>
				</b-col>
			</b-row>
			<b-row>
				<!--  services -->
				<b-col sm="12">
					<b-form-group
						id="input-group-1"
						label="Espacio de trabajo:"
						label-for="input-1"
						description="Selecione el lugar de donde enviará información."
					>
						<b-form-select
							id="input-1"
							v-model="serviceSelected"
							class="col-xs-2"
							style="text-align: center; text-align-last:center;"
							:options="services"
							required
						/>
					</b-form-group>
				</b-col>
			</b-row>
			<b-row>
				<!-- aucomplete persons -->
				<b-col sm="12" class="position-relative">
					<autocomplete
						:items="personFormatted"
						:selected="addPersonToLodging"
						placeholder="Agregar un pasajero"
					/>
				</b-col>
				<!-- badge person -->
				<b-col v-if="!showPopover" sm="12" class="mt-2 mt-xl-1">
					<b-badge
						v-for="(item, i) in lodgingPersons"
						:id="`show${i}`"
						:key="i"
						pill
						variant="primary"
						target="_blank"
						class="ml-1 mr-1"
						>{{ item.search }}
						<span class="text-danger ml-1 pointer" @click="removeLodgingPersons(i)"
							>X</span
						>
						<b-tooltip :target="`show${i}`" placement="bottom"
							>{{ item.dateStart }} - {{ item.dateEnd }}</b-tooltip
						>
					</b-badge>
				</b-col>
				<!-- popover date persons -->
				<b-card
					v-show="showPopover"
					class="shadow bg-white rounded my-3 ml-3 position-absolute"
					style="z-index: 2050; top: 150px"
				>
					<template v-slot:header>
						<div class="d-flex">
							<span class="mb-0 flex-grow-1"
								>Indique la fecha que se hospedara el pasajero</span
							>
							<b-button variant="danger" class="btn-sm" @click="cancelAddPerson">
								X
							</b-button>
						</div>
					</template>
					<b-row>
						<!-- start date person -->
						<b-col sm="6">
							<LodgingsDate
								label="Fecha inicio"
								:start="true"
								:set-date="date => (dateStartPersons = date)"
								:date-start="dateStart"
								:date-end="dateEnd"
								:is-person-date="true"
								:error-date="errorDate"
							/>
						</b-col>
						<!-- end date person -->
						<b-col sm="6">
							<LodgingsDate
								label="Fecha fin"
								:start="false"
								:set-date="date => (dateEndPersons = date)"
								:date-start="dateStart"
								:date-end="dateEnd"
								:is-person-date="true"
								:error-date="errorDate"
							/>
						</b-col>
					</b-row>
					<button
						:disabled="datePersonsInvalid"
						type="button"
						class="btn btn-secondary btn-md mt-2 btn-block"
						@click="setDatePerson"
					>
						Ok
					</button>
				</b-card>
				<!-- increment persons  -->
				<b-col sm="12" class="d-flex justify-content-start flex-wrap">
					<b-button @click="addOneService(serviceSelected)">
						+1 {{ serviceSelected }}
					</b-button>
					<b-button @click="subOneService(serviceSelected)">
						-1 {{ serviceSelected }}
					</b-button>
					<b-button variant="danger" @click="deleteLodging(lodgingSelect)">
						Eliminar
					</b-button>
				</b-col>
			</b-row>
		</b-col>
	</b-row>
</template>

<script>
import moment from 'moment';
import Autocomplete from '@/components/ui/autocomplete/Autocomplete';
import LodgingsDate from '@/components/lodgings/LodgingsDate';
import { mapMutations, mapGetters, mapActions } from 'vuex';

export default {
	name: 'EditLodgings',
	components: {
		Autocomplete,
		LodgingsDate,
	},
	data() {
		return {
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
			services: [
				{ text: 'Todos los servicios', value: 'todos los servicios' },
				{ text: 'Desayuno', value: 'desayuno' },
				{ text: 'Almuerzo', value: 'almuerzo' },
				{ text: 'Cena', value: 'cena' },
				{ text: 'Alojamiento', value: 'alojamiento' },
			],
			serviceSelected: 'todos los servicios',
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
		dateChange(newDate) {
			let verificate = true;
			this.lodgings.forEach(lod => {
				//Verifica que se este usando la misma habitacion, y que el hospedaje selecionado sea distinto
				//al comparado. Y luego verifica que la fecha este fuera de algun otro hospedaje
				if (lod.group == this.lodgingSelect.group && this.lodgingSelect.id != lod.id) {
					if (
						moment(newDate.dateStartLodging).isBefore(
							moment(lod.end).format('YYYY-MM-DD')
						) &&
						moment(newDate.dateEndLodging).isAfter(
							moment(lod.start).format('YYYY-MM-DD')
						)
					)
						verificate = false;
				}
			});
			if (verificate)
				this.sendDateChange({
					dateStart: newDate.dateStartLodging,
					dateEnd: newDate.dateEndLodging,
				});
			else {
				this.$toasted.show('Existe un alojamiento para esas fechas');
				if (newDate.start)
					setTimeout(() => (this.dateStartLodging = this.oldDateLodging), 1);
				else setTimeout(() => (this.dateEndLodging = this.oldDateLodging), 1);
			}
		},
		setDateIntheState() {
			this.dateStartLodging = moment(this.lodgingSelect.start).format('YYYY-MM-DD');
			this.dateEndLodging = moment(this.lodgingSelect.end).format('YYYY-MM-DD');
			this.dateStart = moment(this.lodgingSelect.start).format('YYYY-MM-DD');
			this.dateEnd = moment(this.lodgingSelect.end).format('YYYY-MM-DD');
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
		}),
		...mapMutations({
			addOneService: 'Lodging/addOneService',
			removeLodgingPersons: 'Lodging/removeLodgingPersons',
			sendDateChange: 'Lodging/dateChange',
			subOneService: 'Lodging/subOneService',
			updateLodgingPersons: 'Lodging/updateLodgingPersons',
		}),
	},
};
</script>
