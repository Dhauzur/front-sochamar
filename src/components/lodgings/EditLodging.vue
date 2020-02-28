<template lang="html">
	<b-row v-if="lodgingSelect">
		<b-col class="borderEdit m-3">
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
				<!-- aucomplete passengers -->
				<b-col sm="12" class="position-relative">
					<autocomplete
						:items="passengerFormatted"
						:selected="addPassengerToLodging"
						placeholder="Agregar un pasajero"
					/>
				</b-col>
				<!-- badge passenger -->
				<b-col v-if="!showPopover" sm="12" class="mt-2 mt-xl-1">
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
						<b-col sm="6">
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
						<b-col sm="6">
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
				<b-col sm="12">
					<button
						type="button"
						class=" btn btn-primary btn-md mt-2 btn-block"
						@click="addOneService(serviceSelected)"
					>
						Agregar un pasajero todos los dias a {{ serviceSelected }}
					</button>
				</b-col>
				<!-- decrement passengers -->
				<b-col sm="12">
					<button
						type="button"
						class=" btn btn-primary btn-md mt-2 btn-block"
						@click="subOneService(serviceSelected)"
					>
						Disminuir un pasajero todos los dias a {{ serviceSelected }}
					</button>
				</b-col>
				<!-- delete lodging -->
				<b-col sm="12">
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
			lodgings: 'Lodging/lodgings',
			lodgingSelect: 'Lodging/lodgingSelect',
			lodgingPassengers: 'Lodging/lodgingPassengers',
			passengers: 'Passengers/passengers',
			idCompany: 'Lodging/company',
			company: 'Company/company',
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
			if (verificate) {
				this.sendDateChange({
					dateStart: newDate.dateStartLodging,
					dateEnd: newDate.dateEndLodging,
				});
				this.setLodgingSelect(this.lodgingSelect.id);
			} else {
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
			addOneService: 'Lodging/addOneService',
			subOneService: 'Lodging/subOneService',
			updateLodgingPassengers: 'Lodging/updateLodgingPassengers',
			removeLodgingPassengers: 'Lodging/removeLodgingPassengers',
			setLodgingSelect: 'Lodging/setLodgingSelect',
		}),
	},
};
</script>

<style lang="css" scoped>
.borderEdit {
	border: 1px solid #dee2e6;
	padding: 15px;
	border-radius: 30px;
	box-shadow: 0px 0px 20px -8px rgb(0, 0, 0);
}
.pointer {
	cursor: pointer;
}
</style>
