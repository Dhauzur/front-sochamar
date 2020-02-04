<template>
	<div>
		<b-form>
			<b-row>
				<b-col v-if="editMode" cols="12" class="text-right"
					><Button class="btn btn-secondary btn-sm" @click="clearInputs"
						>Nuevo</Button
					></b-col
				>
				<!-- firstName -->
				<b-col cols="6">
					<b-row>
						<b-col cols="12" class="text-left text-secondary"
							><label for="firstName" class="mb-0 mt-2">Nombre</label>
						</b-col>
						<b-col cols="12" class="text-right"
							><b-input id="firstName" v-model.trim="$v.passenger.firstName.$model" />
							<div v-if="$v.passenger.firstName.$dirty">
								<small v-if="!$v.passenger.firstName.required" class="text-danger">
									Campo requerido
								</small>
								<small v-if="!$v.passenger.firstName.minLength" class="text-danger">
									Minimo 3 Caracteres
								</small>
							</div>
						</b-col>
					</b-row>
				</b-col>
				<!-- lastName -->
				<b-col cols="6">
					<b-row>
						<b-col cols="12" class="text-left text-secondary"
							><label for="lastName" class="mb-0 mt-2">Apellido</label>
						</b-col>
						<b-col cols="12" class="text-right">
							<b-input
								id="lastName"
								v-model.trim="$v.passenger.lastName.$model"
							></b-input>
							<div v-if="$v.passenger.lastName.$dirty">
								<small v-if="!$v.passenger.lastName.required" class="text-danger">
									Campo requerido
								</small>
								<small v-if="!$v.passenger.lastName.minLength" class="text-danger">
									Minimo 3 Caracteres
								</small>
							</div>
						</b-col>
					</b-row>
				</b-col>
			</b-row>
			<b-row>
				<!-- age -->
				<b-col cols="6">
					<b-row>
						<b-col cols="12" class="text-left text-secondary"
							><label for="age" class="mb-0 mt-2">Edad</label>
						</b-col>
						<b-col cols="12" class="text-right"
							><b-input
								id="age"
								v-model="$v.passenger.age.$model"
								type="number"
							></b-input>
							<div v-if="$v.passenger.age.$dirty">
								<small v-if="!$v.passenger.age.required" class="text-danger">
									Campo requerido
								</small>
								<small v-if="!$v.passenger.age.between" class="text-danger">
									Escriba una edad correcta
								</small>
							</div></b-col
						>
					</b-row>
				</b-col>
				<!-- state -->
				<b-col cols="6">
					<b-row>
						<b-col cols="12" class="text-left text-secondary"
							><label for="state" class="mb-0 mt-2">Estado</label>
						</b-col>
						<b-col cols="12">
							<b-form-select
								id="state"
								v-model="$v.passenger.state.$model"
								:options="['soltero', 'casado']"
							></b-form-select>
							<div v-if="$v.passenger.state.$dirty" class="text-right">
								<small v-if="!$v.passenger.state.required" class="text-danger">
									Campo requerido
								</small>
							</div>
						</b-col>
					</b-row>
				</b-col>
			</b-row>
			<b-row>
				<!-- birthdate -->
				<b-col cols="6"
					><b-row
						><b-col cols="12" class="text-left text-secondary"
							><label for="birthdate" class="mb-0 mt-2">Fecha nacimiento</label>
						</b-col>
						<b-col cols="12">
							<b-form-group id="birthdate" label-for="input-1" class="pb-0 mb-0">
								<b-form-input
									id="input-1"
									v-model="$v.passenger.birthdate.$model"
									type="date"
								/>
							</b-form-group>
							<div v-if="$v.passenger.birthdate.$dirty" class="text-right">
								<small v-if="!$v.passenger.birthdate.required" class="text-danger">
									Campo requerido
								</small>
							</div></b-col
						>
					</b-row></b-col
				>
				<!-- appointment -->
				<b-col cols="6"
					><b-row
						><b-col cols="12" class="text-left text-secondary"
							><label for="appointment" class="mb-0 mt-2">Cargo</label> </b-col
						><b-col cols="12"
							><b-input
								id="appointment"
								v-model="$v.passenger.appointment.$model"
							></b-input>
							<div v-if="$v.passenger.appointment.$dirty" class="text-right">
								<small
									v-if="!$v.passenger.appointment.required"
									class="text-danger"
								>
									Campo requerido
								</small>
								<small
									v-if="!$v.passenger.appointment.minLength"
									class="text-danger"
								>
									Minimo 4 Caracteres
								</small>
							</div>
						</b-col></b-row
					></b-col
				>
			</b-row>
			<!-- function -->
			<b-row>
				<b-col cols="12" class="text-left text-secondary"
					><label for="function" class="mb-0 mt-2">Función</label>
				</b-col>
				<b-col cols="6"
					><b-input id="function" v-model="$v.passenger.function.$model"></b-input>
					<div v-if="$v.passenger.function.$dirty" class="text-right">
						<small v-if="!$v.passenger.function.required" class="text-danger">
							Campo requerido
						</small>
						<small v-if="!$v.passenger.function.minLength" class="text-danger">
							Minimo 4 Caracteres
						</small>
					</div>
				</b-col>
			</b-row>
			<!-- avatar -->
			<b-row>
				<b-col v-if="editMode" cols="12" class="mt-2">
					<b-badge pill variant="secondary">{{ passenger.passenger }}</b-badge>
					<small v-if="!passenger.passenger" class="text-secondary">Sin avatar</small>
				</b-col>
				<b-col cols="12" :class="!editMode ? 'mt-4' : 'mt-2'">
					<b-form-file
						accept="image/jpeg, image/png, image/gif, image/jpg"
						:placeholder="editMode ? 'Actualizar imagen' : 'Agrega una imagen'"
						drop-placeholder="Arrastrar aqui..."
						@change="e => (passenger.passenger = e.target.files[0])"
					></b-form-file>
				</b-col>
			</b-row>
			<!-- documents -->
			<b-row>
				<b-col v-if="editMode" cols="12" class="mt-2">
					<b-badge
						v-for="(item, index) in passenger.documents"
						:key="index"
						pill
						variant="secondary"
						>{{ item.name || item }}</b-badge
					>
				</b-col>
				<b-col cols="12" :class="!editMode ? 'mt-4' : 'mt-2'"
					><b-form-file
						multiple
						:placeholder="
							editMode ? 'Cambiar documentos' : 'Agrega un Documento, maximo 5'
						"
						drop-placeholder="Arrastrar aqui..."
						@change="setDocuments"
					></b-form-file>
				</b-col>
			</b-row>
			<b-dropdown-divider v-if="passengersList.length > 0" />
			<!-- list passenger -->
			<b-row>
				<b-col v-if="passengersList.length > 0" class="mt-4">
					<ListPassengers
						:selected-passenger="selectedPassenger"
						:delete-one="deleteOne"
						:passengers="passengersList"
						:get-all-passengers="getAllPassengers"
					/>
				</b-col>
			</b-row>
			<!-- submit -->
			<b-row>
				<b-col class="mt-4">
					<b-button block class="btn btn-primary d-block" @click.prevent="submitForm"
						>Guardar</b-button
					>
					<small v-if="errors" class="mt-2 d-block text-danger">
						Debe llenar el formulario correctamente
					</small>
				</b-col>
			</b-row>
		</b-form>
	</div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, minLength, between } from 'vuelidate/lib/validators';
import ListPassengers from './ListPassengers';
import { mapActions, mapGetters } from 'vuex';

export default {
	components: { ListPassengers },
	mixins: [validationMixin],
	data() {
		return {
			form: new FormData(),
			editMode: false,
			selected: {},
			formTouched: false,
			uiState: 'submit not clicked',
			errors: false,
			empty: true,
			passenger: {
				_id: null,
				passenger: null,
				documents: [],
				firstName: '',
				lastName: '',
				state: '',
				age: '',
				birthdate: '',
				appointment: '',
				function: '',
			},
		};
	},
	computed: {
		...mapGetters({ passengersList: 'Passengers/passengers' }),
	},
	created() {
		this.getAllPassengers();
	},
	mounted() {
		console.log(this.$v);
	},
	validations: {
		passenger: {
			firstName: {
				required,
				minLength: minLength(3),
			},
			lastName: {
				required,
				minLength: minLength(3),
			},
			state: {
				required,
			},
			age: {
				required,
				between: between(1, 130),
			},
			birthdate: {
				required,
			},
			appointment: {
				required,
				minLength: minLength(4),
			},
			function: {
				required,
				minLength: minLength(4),
			},
		},
	},
	methods: {
		async submitForm() {
			console.log(this.$v);
			// validations
			this.$v.$touch();
			if (this.$v.$invalid) {
				this.errors = true;
			} else {
				// set data for send
				for (let index = 0; index < this.passenger.documents.length; index++) {
					this.form.append('documents', this.passenger.documents[index]);
				}
				this.form.append('passenger', this.passenger.passenger);
				this.form.set('firstName', this.passenger.firstName.toLowerCase());
				this.form.set('lastName', this.passenger.lastName.toLowerCase());
				this.form.set('age', this.passenger.age.toString());
				this.form.set('birthdate', this.passenger.birthdate.toLowerCase());
				this.form.set('appointment', this.passenger.appointment.toLowerCase());
				this.form.set('function', this.passenger.function.toLowerCase());
				this.form.set('state', this.passenger.state.toLowerCase());

				// put passenger or cretae a new passenger
				if (this.editMode) {
					await this.editPassenger({
						payload: this.form,
						id: this.passenger._id,
					});
					// update list passenger
					this.getAllPassengers();
				} else {
					// Save the passenger
					await this.savePassenger(this.form);
					// update list passenger
					this.getAllPassengers();
				}
			}
		},
		setDocuments(e) {
			this.passenger.documents = [];
			let files = e.target.files;
			if (!files.length) {
				return false;
			}
			for (let index = 0; index < files.length; index++) {
				this.passenger.documents.push(files[index]);
			}
		},
		selectedPassenger(passenger) {
			this.editMode = true;
			this.passenger = passenger;
		},
		clearInputs() {
			this.passenger = {
				_id: null,
				passenger: null,
				documents: [],
				firstName: '',
				lastName: '',
				state: '',
				age: '',
				birthdate: '',
				appointment: '',
				function: '',
			};
			this.editMode = false;
		},
		deleteOne(id) {
			this.deleteOnePassenger(id).then(() => this.getAllPassengers());
		},
		...mapActions({
			getAllPassengers: 'Passengers/fetchAllPassengers',
			savePassenger: 'Passengers/savePassenger',
			editPassenger: 'Passengers/editPassenger',
			deleteOnePassenger: 'Passengers/deleteOnePassenger',
		}),
	},
};
</script>
