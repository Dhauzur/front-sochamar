<template>
	<div class="position-relative">
		<!-- list passenger -->
		<b-row>
			<b-col v-if="passengersList.length > 0">
				<h5 class="text-secondary">Listado de pasajeros</h5>
				<ListPassengers
					:api="api"
					:selected-passenger="selectedPassenger"
					:delete-one="deleteOne"
					:passengers="passengersList"
					:get-all-passengers="getAllPassengers"
				/>
			</b-col>
		</b-row>
		<b-dropdown-divider v-if="passengersList.length > 0" />
		<b-form>
			<b-row>
				<!-- avatar -->
				<b-col class="mt-3">
					<h5 class="text-secondary">
						{{ editMode ? 'Editar pasajero' : 'Crear nuevo pasajero' }}
					</h5>
					<label for="upload">
						<b-img
							class="pointer"
							for
							v-bind="mainProps"
							rounded="circle"
							alt="avatar"
							:src="srcImageAvatar"
						></b-img>
					</label>
					<b-form-file
						id="upload"
						ref="avatar"
						class="d-none"
						accept="image/jpeg, image/png, image/gif, image/jpg"
						:placeholder="editMode ? 'Actualizar imagen' : 'Agrega una imagen'"
						drop-placeholder="Arrastrar aqui..."
						@change="e => (passenger.passenger = e.target.files[0])"
					></b-form-file>
				</b-col>
				<b-col cols="12">
					<label for="upload" class="pointer text-secondary">{{
						typeof passenger.passenger === 'string' ? 'Cambiar avatar' : 'Subir avatar'
					}}</label>
				</b-col>
				<!-- button for change view to new passenger -->
				<div v-if="editMode" class="text-right position-absolute" style="top: 0; right: 0;">
					<Button class="btn btn-secondary btn-sm" @click="clearInputs">Nuevo </Button>
				</div>
				<!-- firstName -->
				<b-col cols="6">
					<b-row>
						<b-col cols="12" class="text-left text-secondary"
							><label for="firstName" class="mb-0 mt-2">Nombre</label>
						</b-col>
						<b-col cols="12" class="text-right">
							<b-input id="firstName" v-model.trim="$v.passenger.firstName.$model" />
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
						<b-col cols="12" class="text-right">
							<b-input
								id="age"
								v-model.number="$v.passenger.age.$model"
								type="number"
							></b-input>
							<div v-if="$v.passenger.age.$dirty">
								<small v-if="!$v.passenger.age.required" class="text-danger">
									Campo requerido
								</small>
								<small v-if="!$v.passenger.age.between" class="text-danger">
									Escriba una edad correcta
								</small>
							</div>
						</b-col>
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
				<b-col cols="6">
					<b-row>
						<b-col cols="12" class="text-left text-secondary"
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
							</div>
						</b-col>
					</b-row>
				</b-col>
				<!-- appointment -->
				<b-col cols="6">
					<b-row>
						<b-col cols="12" class="text-left text-secondary"
							><label for="appointment" class="mb-0 mt-2">Cargo</label></b-col
						>
						<b-col cols="12">
							<b-input
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
						</b-col>
					</b-row>
				</b-col>
			</b-row>
			<!-- function -->
			<b-row>
				<b-col cols="12" class="text-left text-secondary"
					><label for="function" class="mb-0 mt-2">Función</label>
				</b-col>
				<b-col cols="6">
					<b-input id="function" v-model="$v.passenger.function.$model"></b-input>
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
			<!-- documents -->
			<b-row>
				<b-col cols="12" class="mt-2">
					<small
						v-if="!passenger.documents && !passenger.documents[0] && editMode"
						class="text-secondary"
						>Sin Documentos</small
					>
					<div v-if="editMode && typeof passenger.documents[0] === 'string'">
						<b-badge
							v-for="(item, index) in passenger.documents"
							:key="index"
							pill
							variant="secondary"
							:href="`${api}/${item}`"
							target="_blank"
							>Documento {{ index + 1 }}
						</b-badge>
					</div>
				</b-col>
				<b-col cols="12" class="mt-2">
					<b-form-file
						ref="document"
						multiple
						:file-name-formatter="formatNames"
						:placeholder="
							editMode
								? 'Cambiar todos los documentos'
								: 'Agrega un Documento, maximo 5'
						"
						drop-placeholder="Arrastrar aqui..."
						@change="setDocuments"
					></b-form-file>
				</b-col>
			</b-row>
			<b-row>
				<b-col class="mt-4">
					<b-button
						:disabled="disabled"
						block
						class="btn btn-primary d-block"
						@click.prevent="submitForm"
						>Guardar
					</b-button>
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
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { api_absolute } from '@/config/index.js';
import avatarDefault from '@/assets/user-icon.png';

export default {
	components: { ListPassengers },
	mixins: [validationMixin],
	data() {
		return {
			api: api_absolute,
			mainProps: { blank: false, blankColor: '#777', width: 75, height: 75, class: 'm1' },
			form: new FormData(),
			disabled: false,
			editMode: false,
			selected: {},
			formTouched: false,
			uiState: 'submit not clicked',
			errors: false,
			empty: true,
			success: '',
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
		srcImageAvatar() {
			if (typeof this.passenger.passenger === 'string') {
				return `${this.api}/${this.passenger.passenger}`;
			} else if (this.passenger.passenger) {
				return URL.createObjectURL(this.passenger.passenger);
			} else {
				return avatarDefault;
			}
		},
		...mapGetters({
			passengersList: 'Passengers/passengers',
			errorMessage: 'Passengers/errorMessage',
		}),
	},
	created() {
		this.getAllPassengers();
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
			// validations
			this.$v.$touch();
			if (this.$v.$invalid) {
				this.errors = true;
			} else {
				// disable button for request to api
				this.disabled = true;
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
					// show success message success or error
					this.showMessageToasted('Pasagero editado con exito');
					// update list passenger
					this.getAllPassengers();
				} else {
					// Save the passenger
					await this.savePassenger(this.form);
					// show success message or error
					this.showMessageToasted('Pasagero guardado con exito');
					// update list passenger
					this.getAllPassengers();
					// clear inputs
					this.clearInputs();
				}
				// disable button for request to api
				this.disabled = false;
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
			this.$refs['document'].reset();
			this.$refs['avatar'].reset();
			this.editMode = true;
			this.passenger = passenger;
		},
		clearInputs() {
			this.$refs['document'].reset();
			this.$refs['avatar'].reset();
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
			this.$v.$reset();
		},
		deleteOne(id) {
			this.deleteOnePassenger(id).then(() => this.getAllPassengers());
			this.showMessageToasted('Eliminado exitosamente');
		},
		showMessageToasted(msg) {
			if (this.errorMessage !== '') {
				this.$toasted.show(this.errorMessage, { type: 'error' });
				this.setErrorMessage('');
			} else {
				this.$toasted.show(msg, {
					type: 'success',
				});
			}
		},
		formatNames(files) {
			if (files.length === 1) {
				return files[0].name;
			} else {
				return `${files.length} files selected`;
			}
		},
		...mapActions({
			getAllPassengers: 'Passengers/fetchAllPassengers',
			savePassenger: 'Passengers/savePassenger',
			editPassenger: 'Passengers/editPassenger',
			deleteOnePassenger: 'Passengers/deleteOnePassenger',
		}),
		...mapMutations({ setErrorMessage: 'Passengers/setErrorMessage' }),
	},
};
</script>

<style scoped>
.pointer {
	cursor: pointer;
}
</style>
