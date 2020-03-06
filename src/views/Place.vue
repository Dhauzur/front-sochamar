<template lang="html">
	<b-container>
		<b-row class="justify-content-center">
			<b-col md="12" lg="10" class="background-module pb-3">
				<b-col cols="12" class="mb-3">
					<h4 class="my-4">Gestión de <span style="color: orange">lugares</span></h4>
				</b-col>
				<b-row class="mb-3 text-left">
					<b-col cols="12" class="mb-3"><h6>Agregar nuevo</h6></b-col>
					<b-col cols="12" md lg="8">
						<label for="name" class="mb-0"><small>Nombre</small></label>
						<b-form-input
							id="name"
							v-model="$v.form.name.$model"
							required
							placeholder="Ej: Minera los pelambres"
						></b-form-input>
						<div v-if="$v.form.name.$dirty" class="text-right">
							<small v-if="!$v.form.name.required" class="text-danger">
								Campo requerido
							</small>
							<small v-if="!$v.form.name.minLength" class="text-danger">
								Minimo 3 Caracteres
							</small>
						</div>
					</b-col>
					<b-col cols="12" md lg="4">
						<label for="rut" class="mb-0"><small>RUT</small></label>
						<b-form-input
							id="rut"
							v-model="$v.form.rut.$model"
							placeholder="Ej: 11.111.111-3"
						></b-form-input>
						<div v-if="$v.form.rut.$dirty" class="text-right">
							<small v-if="!$v.form.rut.required" class="text-danger">
								Campo requerido
							</small>
						</div>
					</b-col>
				</b-row>
				<b-row class="mb-3 text-left">
					<b-col>
						<h6>Precios</h6>
					</b-col>
				</b-row>
				<b-row class="mb-5 text-left">
					<b-col cols="12" md>
						<label for="breakfast" class="mb-0"><small>Desayuno</small></label>
						<b-form-input
							id="breakfast"
							v-model="$v.form.breakfast.$model"
							type="number"
							placeholder="Ej: 4000"
						></b-form-input>
						<div v-if="$v.form.breakfast.$dirty" class="text-right">
							<small v-if="!$v.form.breakfast.required" class="text-danger">
								Campo requerido
							</small>
						</div>
					</b-col>
					<b-col cols="12" md>
						<label for="lunch" class="mb-0"><small>Almuerzo</small></label>
						<b-form-input
							id="lunch"
							v-model="$v.form.lunch.$model"
							type="number"
							placeholder="Ej: 8000"
						></b-form-input>
						<div v-if="$v.form.lunch.$dirty" class="text-right">
							<small v-if="!$v.form.lunch.required" class="text-danger">
								Campo requerido
							</small>
						</div>
					</b-col>
					<b-col cols="12" md>
						<label for="dinner" class="mb-0"><small>Cena</small></label>
						<b-form-input
							id="dinner"
							v-model="$v.form.dinner.$model"
							type="number"
							placeholder="Ej: 6000"
						></b-form-input>
						<div v-if="$v.form.dinner.$dirty" class="text-right">
							<small v-if="!$v.form.dinner.required" class="text-danger">
								Campo requerido
							</small>
						</div>
					</b-col>
					<b-col cols="12" md>
						<label for="lodging" class="mb-0"><small>Alojamiento</small></label>
						<b-form-input
							id="lodging"
							v-model="$v.form.lodging.$model"
							type="number"
							placeholder="Ej: 25000"
						></b-form-input>
						<div v-if="$v.form.lodging.$dirty" class="text-right">
							<small v-if="!$v.form.lodging.required" class="text-danger">
								Campo requerido
							</small>
						</div>
					</b-col>
					<b-col cols="12" md class="mt-3">
						<b-button block size="sm" class="col-12" @click="onsubmit()">
							Guardar
						</b-button>
						<small v-if="errors" class="mt-2 d-block text-danger">
							Debe llenar el formulario correctamente
						</small>
					</b-col>
				</b-row>
				<div v-if="hasPlaces">
					<b-row
						style="max-height: 150px; overflow-y: auto;"
						class="background-into-module mr-2 mb-3"
					>
						<b-col>
							<table class="table table-bordered table-hover">
								<thead>
									<tr>
										<th>Nombre</th>
										<th>RUT / ID</th>
										<th>Precios</th>
										<th>Eliminar</th>
									</tr>
								</thead>
								<tbody>
									<tr
										v-for="(c, index) in places"
										:key="index"
										@click="selectPlace(c.id)"
									>
										<td>{{ c.name }}</td>
										<td>{{ c.rut }}</td>
										<td>
											<table class="table ">
												<thead>
													<th>Tipo</th>
													<th>Precio</th>
												</thead>
												<tbody>
													<tr>
														<td>Desayuno</td>
														<td>{{ c.prices[0] }}</td>
													</tr>
													<tr>
														<td>Almuerzo</td>
														<td>{{ c.prices[1] }}</td>
													</tr>
													<tr>
														<td>Cena</td>
														<td>{{ c.prices[2] }}</td>
													</tr>
													<tr>
														<td>Alojamiento</td>
														<td>{{ c.prices[3] }}</td>
													</tr>
												</tbody>
											</table>
										</td>
										<td class="p-2">
											<b-button variant="danger" @click="deletePlace(c.id)">
												X
											</b-button>
										</td>
									</tr>
								</tbody>
							</table>
						</b-col>
					</b-row>
				</div>
				<div v-else>
					<h6 class="m-5">Vacio</h6>
				</div>
				<b-row>
					<b-col cols="6" offset="6">
						<b-form-input
							v-model="filterPlaceWord"
							size="sm"
							placeholder="Filtrar lugar"
							@keyup="filterPlace(filterPlaceWord)"
						></b-form-input>
					</b-col>
				</b-row>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
	name: 'Place',
	mixins: [validationMixin],
	data() {
		return {
			form: {
				name: '',
				rut: '',
				breakfast: '',
				lunch: '',
				dinner: '',
				lodging: '',
			},
			errors: '',
			filterPlaceWord: '',
		};
	},
	computed: {
		hasPlaces() {
			return Array.isArray(this.places) && this.places.length;
		},
		...mapGetters({
			places: 'Place/places',
			placeSelected: 'Place/placeSelected',
			message: 'Place/message',
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
		this.fetchPlace();
	},
	validations: {
		form: {
			name: {
				required,
				minLength: minLength(3),
			},
			rut: {
				required,
			},
			breakfast: {
				required,
			},
			lunch: {
				required,
			},
			dinner: {
				required,
			},
			lodging: {
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
				let tempArray = [];
				tempArray.push(
					this.form.breakfast,
					this.form.lunch,
					this.form.dinner,
					this.form.lodging
				);
				this.createPlace({ name: this.form.name, rut: this.form.rut, prices: tempArray });
				this.clearInputs();
				this.$v.$reset();
			}
		},
		clearInputs() {
			this.form = {
				name: '',
				rut: '',
				breakfast: '',
				lunch: '',
				dinner: '',
				lodging: '',
			};
		},
		...mapActions({
			fetchPlace: 'Place/fetchPlace',
			createPlace: 'Place/createPlace',
			deletePlace: 'Place/deletePlace',
		}),
		...mapMutations({
			selectPlace: 'Place/selectPlace',
			filterPlace: 'Place/filterPlace',
		}),
	},
};
</script>

<style lang="css" scoped></style>
