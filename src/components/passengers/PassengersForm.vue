<template>
	<div>
		<b-form>
			<b-row>
				<!-- firstname -->
				<b-col cols="6">
					<b-row>
						<b-col cols="12" class="text-left text-secondary"
							><label for="firstname" class="mb-0 mt-2">Nombre</label>
						</b-col>
						<b-col cols="12" class="text-right"
							><b-input id="firstname" v-model.trim="$v.passenger.firstname.$model" />
							<small v-if="errors" class="text-danger">
								<span v-if="!$v.passenger.firstname.minLength"
									>Minimo 4 caracteres</span
								>
							</small>
						</b-col>
					</b-row>
				</b-col>
				<!-- lastname -->
				<b-col cols="6">
					<b-row>
						<b-col cols="12" class="text-left text-secondary"
							><label for="lastname" class="mb-0 mt-2">Apellido</label>
						</b-col>
						<b-col cols="12" class="text-right">
							<b-input
								id="lastname"
								v-model.trim="$v.passenger.lastname.$model"
							></b-input>
							<small v-if="errors" class="text-danger">
								<span v-if="!$v.passenger.lastname.minLength"
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
							><b-input id="age" v-model="passenger.age"></b-input
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
								:options="['Soltero', 'Casado']"
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
									style="text-align: center; text-align-last:center;"
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
			<b-row>
				<b-col cols="12" class="text-left text-secondary"
					><label for="function" class="mb-0 mt-2">Función</label>
				</b-col>
				<b-col cols="6"><b-input id="function" v-model="passenger.func"></b-input> </b-col>
			</b-row>
			<b-row>
				<b-col cols="12" class="mt-4">
					<b-form-file
						placeholder="Agrega una imagen"
						drop-placeholder="Drop file here..."
						@change="e => (passenger.passenger = e.target.files[0])"
					></b-form-file>
				</b-col>
			</b-row>
			<b-row>
				<b-col cols="12" class="mt-4 mb-2"
					><b-form-file
						multiple
						placeholder="Agrega Documentos max 5"
						drop-placeholder="Drop file here..."
						@change="setDocuments"
					></b-form-file>
				</b-col>
			</b-row>
			<b-dropdown-divider />
			<!-- list passenger -->
			<b-row>
				<b-col class="mt-4">
					<ListPassengers />
				</b-col>
			</b-row>
			<!-- submit -->
			<b-row>
				<b-col class="mt-4">
					<b-button block class="btn btn-secondary d-block" @click.prevent="submitForm"
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
import { mapActions } from 'vuex';

export default {
	components: { ListPassengers },
	mixins: [validationMixin],
	data() {
		return {
			form: new FormData(),
			selected: {},
			formTouched: false,
			uiState: 'submit not clicked',
			errors: false,
			empty: true,
			passenger: {
				passenger: null,
				documents: [],
				firstname: '',
				lastname: '',
				state: '',
				age: '',
				birthdate: '',
				appointment: '',
				func: '',
			},
		};
	},
	created() {
		this.getAllPassengers();
	},
	validations: {
		passenger: {
			firstname: {
				required,
				minLength: minLength(4),
			},
			passenger: {
				required,
				minLength: minLength(4),
			},
			lastname: {
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
			func: {
				between: between(0, 120),
			},
		},
	},
	methods: {
		submitForm() {
			for (let index = 0; index < this.passenger.documents.length; index++) {
				this.form.append('documents', this.passenger.documents[index]);
			}
			this.formTouched = !this.$v.passenger.$anyDirty;
			this.errors = this.$v.passenger.$anyError;
			this.uiState = 'submit clicked';
			if (this.errors === false && this.formTouched === false) {
				//this is where you send the responses
				this.uiState = 'form submitted';

				this.form.set('firstName', this.passenger.firstname);
				this.form.set('lastName', this.passenger.lastname);
				this.form.set('age', this.passenger.age);
				this.form.set('birthdate', this.passenger.birthdate);
				this.form.set('appointment', this.passenger.appointment);
				this.form.set('function', this.passenger.func);
				this.form.set('state', this.passenger.state);
				this.form.append('passenger', this.passenger.passenger);
				console.log(this.passenger);

				this.savePassenger(this.form);
			}
		},
		setDocuments(e) {
			let files = e.target.files;
			if (!files.length) {
				return false;
			}
			for (let index = 0; index < files.length; index++) {
				this.passenger.documents.push(files[index]);
			}
		},
		selectedPassenger() {},
		...mapActions({
			getAllPassengers: 'Passengers/fetchAllPassengers',
			savePassenger: 'Passengers/savePassenger',
		}),
	},
};
</script>
