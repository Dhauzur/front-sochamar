<template lang="html">
	<b-container>
		<b-row class="justify-content-center">
			<b-col cols="12" md="10" lg="8" class="background-module py-3">
				<b-row>
					<b-col>
						<h4 class="my-5">Gestión de <span style="color: orange">turnos</span></h4>
					</b-col>
				</b-row>
				<b-row class="mb-5 text-left">
					<b-col cols="12" class="mb-3"><h6>Agregar nuevo</h6></b-col>
					<b-col cols="12" md="4">
						<label for="name" class="mb-0"><small>Nombre del turno</small></label>
						<b-form-input
							id="name"
							v-model.trim="$v.form.name.$model"
							placeholder="Ej: N°1"
						></b-form-input>
						<div v-if="$v.form.name.$dirty" class="text-right">
							<small v-if="!$v.form.name.required" class="text-danger">
								Campo requerido
							</small>
						</div>
					</b-col>
					<b-col cols="12" md="5">
						<label for="max" class="mb-0">
							<small>Cantidad máxima de pasajeros</small>
						</label>
						<b-form-input
							id="max"
							v-model="$v.form.numberPassangerMax.$model"
							type="number"
							placeholder="Ej: 5"
						></b-form-input>
						<div v-if="$v.form.numberPassangerMax.$dirty" class="text-right">
							<small v-if="!$v.form.numberPassangerMax.required" class="text-danger">
								Campo requerido
							</small>
						</div>
					</b-col>
					<b-col cols="12" md="3" class="mt-2">
						<b-button block class="col-12 mt-3" @click="onsubmit()">
							Guardar
						</b-button>
						<small v-if="errors" class="mt-2 d-block text-danger">
							Debe llenar el formulario correctamente
						</small>
					</b-col>
				</b-row>
				<template v-if="hasPeriods">
					<b-row
						style="max-height: 150px; overflow-y: auto;"
						class="background-into-module mr-2 mb-3"
					>
						<b-col>
							<table class="table table-bordered table-hover">
								<thead>
									<tr>
										<th>Nombre del turno</th>
										<th>Cantidad máx. de pasajeros</th>
										<th>Eliminar</th>
									</tr>
								</thead>
								<tbody>
									<tr
										v-for="(period, index) in periods"
										:key="index"
										class="p-0"
										@click="selectPeriod(period.id)"
									>
										<td class="p-0 align-middle">{{ period.name }}</td>
										<td class="p-0 align-middle">
											{{ period.numberPassangerMax }}
										</td>
										<td class="p-0 align-middle">
											<b-button
												variant="danger"
												@click="
													deletePeriod({
														id: period.id,
														placeId: idPlace,
													})
												"
											>
												X
											</b-button>
										</td>
									</tr>
								</tbody>
							</table>
						</b-col>
					</b-row>
				</template>
				<template v-else><h6 class="m-5">Vacio</h6></template>
				<b-row class="mb-3">
					<b-col cols="6" offset="6">
						<b-form-input
							v-model="filterPeriodWord"
							size="sm"
							placeholder="Filtrar turno"
							@keyup="filterPeriod(filterPeriodWord)"
						></b-form-input>
					</b-col>
				</b-row>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
	name: 'Period',
	mixins: [validationMixin],
	props: {
		idPlace: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			errors: '',
			form: {
				name: '',
				numberPassangerMax: '',
			},
			filterPeriodWord: '',
		};
	},
	computed: {
		hasPeriods() {
			return Array.isArray(this.periods) && this.periods.length;
		},
		...mapGetters({
			periods: 'Period/periods',
			periodSelected: 'Period/periodSelected',
			message: 'Period/message',
			placeLodging: 'Lodging/places',
		}),
	},
	watch: {
		message(newVal) {
			this.$toasted.show(newVal.text, {
				type: newVal.type,
			});
		},
	},
	mounted() {
		this.setIdPlacePeriod(this.idPlace);
		this.fetchPeriods(this.idPlace);
	},
	validations: {
		form: {
			name: {
				required,
			},
			numberPassangerMax: {
				required,
			},
		},
	},
	methods: {
		onsubmit() {
			// validations
			this.$v.$touch();
			if (this.$v.$invalid) {
				this.errors = true;
			} else {
				this.createPeriod(this.form).then(() => {
					this.clearInputs();
					this.$v.$reset();
				});
			}
		},
		clearInputs() {
			this.form.name = '';
			this.form.numberPassangerMax = '';
		},
		...mapActions({
			fetchPeriods: 'Period/fetchPeriods',
			createPeriod: 'Period/createPeriod',
			deletePeriod: 'Period/deletePeriod',
		}),
		...mapMutations({
			selectPeriod: 'Period/selectPeriod',
			filterPeriod: 'Period/filterPeriod',
			setIdPlacePeriod: 'Period/setIdPlacePeriod',
		}),
	},
};
</script>

<style lang="css" scoped></style>