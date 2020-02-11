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
							v-model="dateStart"
							type="date"
							class="col-xs-2 "
							style="text-align: center; text-align-last:center;"
							required
							@change="dateChange({ dateStart, dateEnd })"
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
							v-model="dateEnd"
							type="date"
							class="col-xs-2 "
							style="text-align: center; text-align-last:center;"
							required
							@change="dateChange({ dateStart, dateEnd })"
						/>
					</b-form-group>
				</b-col>
			</b-row>
			<b-row>
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
				<b-col lg="4" xl="12">
					<autocomplete
						:items="passengerFormatted"
						:selected="addPassengerToLodging"
						placeholder="Agregar un pasajero"
					/>
				</b-col>
				<b-col lg="4" xl="12">
					<b-badge
						v-for="(item, i) in passengerSelected"
						:key="i"
						pill
						variant="primary"
						target="_blank"
						class="ml-1 mr-1"
						>{{ item.search }}
						<span class="text-danger ml-1 pointer" @click="removePassenger(item)"
							>X</span
						>
					</b-badge>
				</b-col>
				<b-col lg="4" xl="12">
					<button
						type="button"
						class=" btn btn-primary btn-md mt-2 btn-block"
						@click="addOneService(serviceSelected)"
					>
						Agregar un pasajero todos los dias a {{ serviceSelected }}
					</button>
				</b-col>
				<b-col lg="4" xl="12">
					<button
						type="button"
						class=" btn btn-primary btn-md mt-2 btn-block"
						@click="subOneService(serviceSelected)"
					>
						Disminuir un pasajero todos los dias a {{ serviceSelected }}
					</button>
				</b-col>
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
import { mapMutations, mapGetters, mapActions } from 'vuex';

export default {
	components: {
		Autocomplete,
	},
	data() {
		return {
			results: [],
			passengerSelected: [],
			isLoadingPassenger: false,
			dateStart: null,
			dateEnd: null,
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
				search: item.firstName + ' ' + item.lastName,
				id: item._id,
			}));
		},
		...mapGetters({
			lodgingSelect: 'Lodging/lodgingSelect',
			passengers: 'Passengers/passengers',
		}),
	},
	mounted() {
		this.fetchAllPassengers();
		this.dateStart = moment(this.lodgingSelect.start).format('YYYY-MM-DD');
		this.dateEnd = moment(this.lodgingSelect.end).format('YYYY-MM-DD');
	},
	methods: {
		removePassenger(item) {
			const index = this.passengerSelected.indexOf(item);
			this.passengerSelected.splice(index, 1);
		},
		addPassengerToLodging(selected) {
			this.passengerSelected.push(selected);
			this.setLodgingPassengers(this.passengerSelected.map(item => item.id));
		},
		...mapActions({
			fetchAllPassengers: 'Passengers/fetchAllPassengers',
			deleteLodging: 'Lodging/deleteLodging',
		}),
		...mapMutations({
			addOneService: 'Lodging/addOneService',
			subOneService: 'Lodging/subOneService',
			dateChange: 'Lodging/dateChange',
			setLodgingPassengers: 'Lodging/setLodgingPassengers',
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
