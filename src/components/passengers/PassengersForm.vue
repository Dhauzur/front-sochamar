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
							<small v-if="errors" class="text-danger">
								<span v-if="!$v.passenger.firstName.minLength"
									>Minimo 4 caracteres</span
								>
							</small>
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
							<small v-if="errors" class="text-danger">
								<span v-if="!$v.passenger.lastName.minLength"
									>Minimo 4 caracteres</span
								>
							</small>
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
						<b-col cols="12"
							><b-input id="age" v-model="passenger.age" type="number"></b-input
						></b-col>
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
								v-model="passenger.state"
								:options="['soltero', 'casado']"
							></b-form-select>
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
							<b-form-group id="birthdate" label-for="input-1">
								<b-form-input
									id="input-1"
									v-model="passenger.birthdate"
									type="date"
									class="col-xs-2"
								/> </b-form-group
						></b-col> </b-row
				></b-col>
				<!-- appointment -->
				<b-col cols="6"
					><b-row
						><b-col cols="12" class="text-left text-secondary"
							><label for="appointment" class="mb-0 mt-2">Cargo</label> </b-col
						><b-col cols="12"
							><b-input
								id="appointment"
								v-model="passenger.appointment"
							></b-input> </b-col></b-row
				></b-col>
			</b-row>
			<!-- function -->
			<b-row>
				<b-col cols="12" class="text-left text-secondary"
					><label for="function" class="mb-0 mt-2">Función</label>
				</b-col>
				<b-col cols="6"
					><b-input id="function" v-model="passenger.function"></b-input>
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
						drop-placeholder="Arrastra imagen aqui..."
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
					<small v-if="!passenger.documents.length > 0" class="text-secondary"
						>Sin documentos</small
					>
				</b-col>
				<b-col cols="12" :class="!editMode ? 'mt-4' : 'mt-2'"
					><b-form-file
						multiple
						:placeholder="
							editMode ? 'Cambiar documentos' : 'Agrega un Documento maximo 5'
						"
						drop-placeholder="Arrastra documento aqui..."
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
						:delete-one="deleteOnePassenger"
						:passengers="passengersList"
					/>
				</b-col>
			</b-row>
			<!-- submit -->
			<b-row>
				<b-col class="mt-4">
					<b-button block class="btn btn-info d-block" @click.prevent="submitForm"
						>Guardar</b-button
					>
					<small
						v-if="formTouched && uiState === 'submit clicked'"
						class="mt-2 d-block text-danger"
					>
						Debe llenar el formulario
					</small>
					<small v-else-if="uiState === 'form submitted'" class="text-success">
						submit
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
	validations: {
		passenger: {
			firstName: {
				required,
				minLength: minLength(4),
			},
			passenger: {
				required,
				minLength: minLength(4),
			},
			lastName: {
				required,
				minLength: minLength(4),
			},
			state: {
				required,
				minLength: minLength(4),
			},
			age: {
				required,
				minLength: minLength(4),
			},
			birthdate: {
				required,
				minLength: minLength(4),
			},
			appointment: {
				required,
				minLength: minLength(4),
			},
			function: {
				between: between(0, 120),
			},
		},
	},
	methods: {
		async submitForm() {
			// validations
			this.formTouched = !this.$v.passenger.$anyDirty;
			this.errors = this.$v.passenger.$anyError;
			this.uiState = 'submit clicked';

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
				if (this.errors === false && this.formTouched === false) {
					await this.editPassenger({
						payload: this.form,
						id: this.passenger._id,
					});
					// update list passenger
					this.getAllPassengers();
				}
			} else {
				if (this.errors === false && this.formTouched === false) {
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
		...mapActions({
			getAllPassengers: 'Passengers/fetchAllPassengers',
			savePassenger: 'Passengers/savePassenger',
			editPassenger: 'Passengers/editPassenger',
			deleteOnePassenger: 'Passengers/deleteOnePassenger',
		}),
	},
};
</script>
