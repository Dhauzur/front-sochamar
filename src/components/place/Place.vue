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
						<PlaceServicesForm :push-service="pushService"></PlaceServicesForm>
						<v-simple-table>
							<template v-slot:default>
								<thead>
									<tr>
										<th class="text-left">Nombre</th>
										<th class="text-left">Precio</th>
										<th class="text-left">Acciones</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="item in form.services" :key="item.name">
										<td>{{ item.name }}</td>
										<td>{{ item.price }}</td>
										<td>
											<v-icon small @click="removeService(item)">
												mdi-delete
											</v-icon>
										</td>
									</tr>
								</tbody>
							</template>
						</v-simple-table>
					</v-col>
				</v-row>
				<v-row class="mv-5 text-left">
					<v-col cols="12" md class="mt-3">
						<v-btn block size="sm" class="col-6" @click="onsubmit()">
							Guardar
						</v-btn>
						<small v-if="errors" class="mt-2 d-block text-danger">
							Debe llenar el formulario correctamente
						</small>
					</v-col>
				</v-row>
				<!--PLACE TABLE-->
				<v-text-field
					v-model="filterPlaceWord"
					size="sm"
					placeholder="Filtrar lugar"
					@keyup="filterPlace(filterPlaceWord)"
				></v-text-field>
				<div v-if="hasPlaces">
					<v-row>
						<v-col class="mv-5" cols="12">
							<v-simple-table>
								<template v-slot:default>
									<thead>
										<tr>
											<th>Nombre</th>
											<th>RUT / ID</th>
											<th>Servicios</th>
											<th>Acciones</th>
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
												<v-btn @click="manageServices(c)">
													Administrar Servicios
													<v-icon dark>mdi-wrench</v-icon>
												</v-btn>
											</td>
											<td class="p-2">
												<v-icon small @click="deletePlace(c.id)">
													mdi-delete
												</v-icon>
											</td>
										</tr>
									</tbody>
								</template>
							</v-simple-table>
						</v-col>
					</v-row>
				</div>
				<div v-else>
					<h6 class="m-5">Vacio</h6>
				</div>
			</v-col>
		</v-row>
		<v-bottom-sheet v-model="servicesSheet">
			<v-sheet class="text-center" height="500px">
				<PlaceServicesCRUD :place="selectedPlace"></PlaceServicesCRUD>
			</v-sheet>
		</v-bottom-sheet>
	</v-container>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import PlaceServicesForm from './PlaceServicesForm';
import PlaceServicesCRUD from './PlaceServicesCRUD';

export default {
	name: 'Place',
	components: { PlaceServicesForm, PlaceServicesCRUD },
	mixins: [validationMixin],
	data() {
		return {
			form: {
				name: '',
				rut: '',
				services: [],
			},
			servicesSheet: false,
			selectedPlace: {},
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
		},
	},
	methods: {
		onsubmit() {
			// validations
			this.$v.$touch();
			if (this.$v.$invalid) {
				this.errors = true;
			} else {
				this.createPlace(this.form);
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
		pushService(service) {
			const nameExist = this.checkRepeatedServiceName(service.name);
			if (!nameExist) {
				this.form.services.push(service);
			} else {
				this.$toasted.error('No se permiten nombres duplicados');
			}
		},
		removeService(targetService) {
			this.form.services = this.form.services.filter(service => service !== targetService);
		},
		checkRepeatedServiceName(name) {
			const found = this.form.services.find(service => service.name === name);
			if (found) return true;
			else return false;
		},
		manageServices(place) {
			this.servicesSheet = true;
			this.selectedPlace = place;
		},
		...mapActions({
			fetchPlace: 'Place/fetchPlace',
			createPlace: 'Place/createPlace',
			deletePlace: 'Place/deletePlace',
		}),
		...mapMutations({
			selectPlace: 'Place/selectPlace',
			filterPlace: 'Place/filterPlace',
			setPlaceForServices: 'Place/setPlaceForServices',
		}),
	},
};
</script>
