<template lang="html">
	<v-container>
		<v-row class="justify-content-center">
			<v-col md="12" lg="10" class="background-module pv-3">
				<v-col cols="12" class="mv-3">
					<h4 class="my-4">Gestión de <span style="color: orange">lugares</span></h4>
				</v-col>
				<v-row class="mv-3 text-left">
					<v-col cols="12" class="mv-3"><h6>Agregar nuevo</h6></v-col>
					<v-col cols="12" md lg="8">
						<label for="name" class="mv-0"><small>Nombre</small></label>
						<v-text-field
							id="name"
							v-model="$v.form.name.$model"
							required
							placeholder="Ej: Minera los pelambres"
						></v-text-field>
						<div v-if="$v.form.name.$dirty" class="text-right">
							<small v-if="!$v.form.name.required" class="text-danger">
								Campo requerido
							</small>
							<small v-if="!$v.form.name.minLength" class="text-danger">
								Minimo 3 Caracteres
							</small>
						</div>
					</v-col>
					<v-col cols="12" md lg="4">
						<label for="rut" class="mv-0"><small>RUT</small></label>
						<v-text-field
							id="rut"
							v-model="$v.form.rut.$model"
							placeholder="Ej: 11.111.111-3"
						></v-text-field>
						<div v-if="$v.form.rut.$dirty" class="text-right">
							<small v-if="!$v.form.rut.required" class="text-danger">
								Campo requerido
							</small>
						</div>
					</v-col>
				</v-row>
				<v-row class="mv-3 text-left">
					<v-col>
						<h6>Precios</h6>
					</v-col>
				</v-row>
				<v-row class="mv-5 text-left">
					<v-col cols="12" md>
						<label for="breakfast" class="mv-0"><small>Desayuno</small></label>
						<v-text-field
							id="breakfast"
							v-model="$v.form.breakfast.$model"
							type="number"
							placeholder="Ej: 4000"
						></v-text-field>
						<div v-if="$v.form.breakfast.$dirty" class="text-right">
							<small v-if="!$v.form.breakfast.required" class="text-danger">
								Campo requerido
							</small>
						</div>
					</v-col>
					<v-col cols="12" md>
						<label for="lunch" class="mv-0"><small>Almuerzo</small></label>
						<v-text-field
							id="lunch"
							v-model="$v.form.lunch.$model"
							type="number"
							placeholder="Ej: 8000"
						></v-text-field>
						<div v-if="$v.form.lunch.$dirty" class="text-right">
							<small v-if="!$v.form.lunch.required" class="text-danger">
								Campo requerido
							</small>
						</div>
					</v-col>
					<v-col cols="12" md>
						<label for="dinner" class="mv-0"><small>Cena</small></label>
						<v-text-field
							id="dinner"
							v-model="$v.form.dinner.$model"
							type="number"
							placeholder="Ej: 6000"
						></v-text-field>
						<div v-if="$v.form.dinner.$dirty" class="text-right">
							<small v-if="!$v.form.dinner.required" class="text-danger">
								Campo requerido
							</small>
						</div>
					</v-col>
					<v-col cols="12" md>
						<label for="lodging" class="mv-0"><small>Alojamiento</small></label>
						<v-text-field
							id="lodging"
							v-model="$v.form.lodging.$model"
							type="number"
							placeholder="Ej: 25000"
						></v-text-field>
						<div v-if="$v.form.lodging.$dirty" class="text-right">
							<small v-if="!$v.form.lodging.required" class="text-danger">
								Campo requerido
							</small>
						</div>
					</v-col>
					<v-col cols="12" md class="mt-3">
						<v-btn block size="sm" class="col-12" @click="onsubmit()">
							Guardar
						</v-btn>
						<small v-if="errors" class="mt-2 d-block text-danger">
							Debe llenar el formulario correctamente
						</small>
					</v-col>
				</v-row>
				<div v-if="hasPlaces">
					<v-row
						style="max-height: 150px; overflow-y: auto;"
						class="background-into-module mr-2 mv-3"
					>
						<v-col>
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
											<v-btn variant="danger" @click="deletePlace(c.id)">
												X
											</v-btn>
										</td>
									</tr>
								</tbody>
							</table>
						</v-col>
					</v-row>
				</div>
				<div v-else>
					<h6 class="m-5">Vacio</h6>
				</div>
				<v-row>
					<v-col cols="6" offset="6">
						<v-text-field
							v-model="filterPlaceWord"
							size="sm"
							placeholder="Filtrar lugar"
							@keyup="filterPlace(filterPlaceWord)"
						></v-text-field>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</v-container>
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
