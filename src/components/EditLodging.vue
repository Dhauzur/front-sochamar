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
import { mapMutations, mapGetters, mapActions } from 'vuex';

export default {
	data() {
		return {
			oldDate: null,
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
		...mapGetters({
			lodgings: 'Lodging/lodgings',
			lodgingSelect: 'Lodging/lodgingSelect',
		}),
	},
	watch: {
		dateStart: function(newDate) {
			//Si la modificacion al nuevo hpspedaje no es valida, el input date vuelve a su posicion
			//Original
			this.oldDate = newDate;
		},
	},
	mounted() {
		this.dateStart = moment(this.lodgingSelect.start).format('YYYY-MM-DD');
		this.dateEnd = moment(this.lodgingSelect.end).format('YYYY-MM-DD');
	},
	methods: {
		dateChange(newDate) {
			let verificate = true;
			this.lodgings.forEach(lod => {
				//Verifica que se este usando la misma habitacion, y que el hospedaje selecionado sea distinto
				//al comparado. Y luego verifica que la fecha este fuera de algun otro hospedaje
				if (lod.group == this.lodgingSelect.group && this.lodgingSelect.id != lod.id) {
					if (
						moment(newDate.dateStart).isBefore(moment(lod.end).format('YYYY-MM-DD')) &&
						moment(newDate.dateEnd).isAfter(moment(lod.start).format('YYYY-MM-DD'))
					) {
						verificate = false;
					}
				}
			});
			if (verificate) this.sendDateChange(newDate);
			else this.dateStart = this.oldDate;
		},
		saveLodging() {
			this.$store.dispatch('Lodging/createLodging');
		},
		...mapActions({
			deleteLodging: 'Lodging/deleteLodging',
		}),
		...mapMutations({
			addOneService: 'Lodging/addOneService',
			subOneService: 'Lodging/subOneService',
			sendDateChange: 'Lodging/dateChange',
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
</style>
