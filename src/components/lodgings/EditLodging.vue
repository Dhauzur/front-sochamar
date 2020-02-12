<template lang="html">
	<b-row v-if="lodgingSelect">
		<b-col class="borderEdit m-3">
			<h4>Edición de "{{ lodgingSelect.content }}"</h4>
			<b-row>
				<!-- date start lodging -->
				<b-col md="4" lg="6">
					<LodgingsDate
						label="Fecha inicio"
						:start="true"
						:set-date="date => (dateStart = date)"
						:date-start="dateStart"
						:date-end="dateEnd"
					/>
				</b-col>
				<!-- date end lodging -->
				<b-col md="4" lg="6">
					<LodgingsDate
						label="Fecha fin"
						:start="false"
						:set-date="date => (dateEnd = date)"
						:date-start="dateStart"
						:date-end="dateEnd"
					/>
				</b-col>
			</b-row>
			<b-row>
				<!--  services -->
				<b-col md="4" lg="12">
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
				<!-- aucomplete passengers -->
				<b-col lg="4" xl="12" class="position-relative">
					<autocomplete
						:items="passengerFormatted"
						:selected="addPassengerToLodging"
						placeholder="Agregar un pasajero"
					/>
				</b-col>
				<!-- badge passenger -->
				<b-col v-if="!showPopover" lg="4" xl="12">
					<b-badge
						v-for="(item, i) in lodgingPassengers"
						:id="`show${i}`"
						:key="i"
						pill
						variant="primary"
						target="_blank"
						class="ml-1 mr-1"
						>{{ item.search }}
						<span class="text-danger ml-1 pointer" @click="removeLodgingPassengers(i)"
							>X</span
						>
						<b-tooltip :target="`show${i}`" placement="bottom"
							>{{ item.dateStart }} - {{ item.dateEnd }}</b-tooltip
						>
					</b-badge>
				</b-col>
				<!-- popover date passengers -->
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
							<b-button variant="danger" class="btn-sm" @click="cancelAddPassenger">
								X
							</b-button>
						</div>
					</template>
					<b-row>
						<!-- start date passenger -->
						<b-col cols="6">
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
						<!-- end date passenger -->
						<b-col cols="6">
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
					</b-row>
					<button
						:disabled="datePassengersInvalid"
						type="button"
						class="btn btn-secondary btn-md mt-2 btn-block"
						@click="setDatePassenger"
					>
						Ok
					</button>
				</b-card>
				<!-- increment passengers  -->
				<b-col lg="4" xl="12">
					<button
						type="button"
						class=" btn btn-primary btn-md mt-2 btn-block"
						@click="addOneService(serviceSelected)"
					>
						Agregar un pasajero todos los dias a {{ serviceSelected }}
					</button>
				</b-col>
				<!-- decrement passengers -->
				<b-col lg="4" xl="12">
					<button
						type="button"
						class=" btn btn-primary btn-md mt-2 btn-block"
						@click="subOneService(serviceSelected)"
					>
						Disminuir un pasajero todos los dias a {{ serviceSelected }}
					</button>
				</b-col>
				<!-- delete lodging -->
				<b-col lg="4" xl="12">
					<button
						type="button"
						class="btn btn-danger btn-md mt-2  btn-block"
						@click="deleteLodging(lodgingSelect)"
					>
						Eliminar
					</button>
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
			datePassengersInvalid: false,
			results: [],
			passengerSelected: null,
			isLoadingPassenger: false,
			dateStart: null,
			showPopover: false,
			dateStartPassengers: null,
			dateEnd: null,
			dateEndPassengers: null,
			services: [
				{ text: 'Todos los servicios', value: 'todos los servicios' },
				{ text: 'Desayuno', value: 'desayuno' },
				{ text: 'Almuerzo', value: 'almuerzo' },
				{ text: 'Cena', value: 'cena' },
				{ text: 'Alojamiento', value: 'alojamiento' },
			],
			serviceSelected: 'todos los servicios',
		};
	},
	computed: {
		passengerFormatted() {
			return this.passengers.map(item => ({
				search: `${item.firstName} ${item.lastName}`,
				data: item,
			}));
		},
		...mapGetters({
			lodgingSelect: 'Lodging/lodgingSelect',
			lodgingPassengers: 'Lodging/lodgingPassengers',
			passengers: 'Passengers/passengers',
		}),
	},
	watch: {
		lodgingSelect() {
			this.dateStart = moment(this.lodgingSelect.start).format('YYYY-MM-DD');
			this.dateEnd = moment(this.lodgingSelect.end).format('YYYY-MM-DD');
		},
	},
	mounted() {
		/**
		 * fetch passengers
		 */
		this.fetchAllPassengers();
		this.dateStart = moment(this.lodgingSelect.start).format('YYYY-MM-DD');
		this.dateEnd = moment(this.lodgingSelect.end).format('YYYY-MM-DD');
	},
	methods: {
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
				: this.$toasted.show(`ya ha sido seleccionado en esta fecha`, {
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
			fetchAllPassengers: 'Passengers/fetchAllPassengers',
			deleteLodging: 'Lodging/deleteLodging',
		}),
		...mapMutations({
			addOneService: 'Lodging/addOneService',
			subOneService: 'Lodging/subOneService',
			updateLodgingPassengers: 'Lodging/updateLodgingPassengers',
			removeLodgingPassengers: 'Lodging/removeLodgingPassengers',
		}),
	},
};
</script>

<style lang="css" scoped>
.borderEdit {
	border: 1px solid #dee2e6;
	padding: 15px;
}
.pointer {
	cursor: pointer;
}
</style>
