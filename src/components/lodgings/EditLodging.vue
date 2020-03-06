<template lang="html">
	<b-row v-if="lodgingSelect">
		<b-col class="borderModule p-3 m-3">
			<h4>Edición de "{{ lodgingSelect.content }}"</h4>
			<transition name="fade">
				<b-row v-if="!showPopover">
					<b-col>
						<b-form-group id="input-group-1" label="Fecha inicio" label-for="input-1">
							<b-form-input
								id="input-1"
								v-model="dateStartLodging"
								type="date"
								:value="dateStartLodging"
								class="col-xs-2 "
								required
								@change="
									dateChange({ dateStartLodging, dateEndLodging, start: true })
								"
							/>
						</b-form-group>
					</b-col>
					<b-col>
						<b-form-group id="input-group-1" label="Fecha fin" label-for="input-1">
							<b-form-input
								id="input-1"
								v-model="dateEndLodging"
								type="date"
								class="col-xs-2 "
								required
								@change="
									dateChange({ dateStartLodging, dateEndLodging, start: false })
								"
							/>
						</b-form-group>
					</b-col>
				</b-row>
			</transition>
			<b-row>
				<!--  services -->

				<!-- aucomplete passengers -->
				<b-col cols="12">
					<autocomplete
						v-if="!showPopover"
						:items="passengerFormatted"
						:selected="addPassengerToLodging"
						placeholder="Agregar un pasajero"
					/>

					<b-button
						v-if="!showPopover"
						variant="danger"
						@click="deleteLodging(lodgingSelect)"
					>
						Eliminar actividad
					</b-button>
				</b-col>
				<!-- badge passenger -->
				<b-col v-if="!showPopover">
					<b-badge
						v-for="(item, i) in lodgingPassengers"
						:id="`show${i}`"
						:key="i"
						pill
						target="_blank"
						class="ml-1 mr-1"
						>{{ item.search }}: {{ item.dateStart }} - {{ item.dateEnd }}
						<span class="text-danger ml-1 pointer" @click="removeLodgingPassengers(i)"
							>X</span
						>
					</b-badge>
				</b-col>
				<b-col v-show="showPopover">
					<LodgingsDate
						label="Fecha inicio"
						:start="true"
						:set-date="date => (dateStartPassengers = date)"
						:date-start="dateStart"
						:date-end="dateEnd"
						:is-passenger-date="true"
						:error-date="errorDate"
					/>
				</b-col>
				<b-col v-show="showPopover">
					<LodgingsDate
						label="Fecha fin"
						:start="false"
						:set-date="date => (dateEndPassengers = date)"
						:date-start="dateStart"
						:date-end="dateEnd"
						:is-passenger-date="true"
						:error-date="errorDate"
					/>
				</b-col>
				<b-col class="mb-2 d-flex justify-content-start flex-wrap">
					<b-button
						v-show="showPopover"
						:disabled="datePassengersInvalid"
						@click="setDatePassenger"
					>
						Agregar
					</b-button>
					<b-button
						v-if="showPopover"
						variant="danger"
						class="btn-sm"
						@click="cancelAddPassenger"
					>
						Cancelar
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
			dateStartLodging: null,
			dateEndLodging: null,
			oldDateLodging: null,
			dateStart: null,
			dateEnd: null,
			datePassengersInvalid: false,
			results: [],
			passengerSelected: null,
			isLoadingPassenger: false,
			showPopover: false,
			dateStartPassengers: null,
			dateEndPassengers: null,
		};
	},
	computed: {
		passengerFormatted() {
			return this.passengers.map(item => ({
				search: `${item.firstName} ${item.lastName ? item.lastName : ''}`,
				data: item,
			}));
		},
		...mapGetters({
			lodgings: 'Lodging/lodgings',
			lodgingSelect: 'Lodging/lodgingSelect',
			lodgingPassengers: 'Lodging/lodgingPassengers',
			passengers: 'Passengers/passengers',
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
		 * used for disabled button when passenger date is invalid
		 */
		errorDate(boolean) {
			this.datePassengersInvalid = boolean;
		},
		/**
		 * set date passenger in the store
		 */
		setDatePassenger() {
			if (this.dateStartPassengers === null) {
				this.dateStartPassengers = this.dateStart;
			}
			if (this.dateEndPassengers === null) {
				this.dateEndPassengers = this.dateEnd;
			}

			this.verifyOverlay() === 'OK'
				? this.updateLodgingPassengers({
						id: this.passengerSelected.data._id,
						search: this.passengerSelected.search,
						dateStart: this.dateStartPassengers,
						dateEnd: this.dateEndPassengers,
				  })
				: this.$toasted.show(`Ya existe un pasajero para el rango de fecha selecionado`, {
						type: 'error',
				  });

			this.passengerSelected = null;
			this.showPopover = false;
		},
		/**
		 * cancel the adiction passenger when close the popover
		 */
		cancelAddPassenger() {
			this.showPopover = false;
			this.passengerSelected = '';
		},
		/**
		 * add a passenger to lodging from autocomplete
		 * show popover for set date
		 */
		addPassengerToLodging(selected) {
			this.showPopover = true;
			this.passengerSelected = selected;
		},
		/**
		 * check if date of passenger ir already taken
		 */
		verifyOverlay() {
			let verificate = null;
			let temp = this.lodgingPassengers.filter(passenger => {
				return passenger.id === this.passengerSelected.data._id;
			});

			if (temp.length > 0) {
				temp.map(item => {
					if (
						(moment(this.dateStartPassengers).isBefore(moment(item.dateStart)) &&
							moment(this.dateEndPassengers).isBefore(moment(item.dateStart))) ||
						(moment(this.dateStartPassengers).isAfter(moment(item.dateEnd)) &&
							moment(this.dateEndPassengers).isAfter(moment(item.dateEnd)))
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
			sendDateChange: 'Lodging/dateChange',
			updateLodgingPassengers: 'Lodging/updateLodgingPassengers',
			removeLodgingPassengers: 'Lodging/removeLodgingPassengers',
		}),
	},
};
</script>

<style lang="css" scoped>
.pointer {
	cursor: pointer;
}
</style>
