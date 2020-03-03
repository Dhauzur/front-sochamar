<template>
	<div class="position-relative">
		<!-- list passenger -->
		<b-row>
			<b-col v-if="passengersList.length > 0">
				<h5 class="text-secondary">Listado de personas</h5>
				<ListPassengers
					:passenger="passenger"
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
						{{ editMode ? 'Editar persona' : 'Crear nueva persona' }}
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
							<b-input id="lastName" v-model.trim="passenger.lastName"></b-input>
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
								v-model.number="passenger.age"
								type="number"
							></b-input>
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
								v-model="passenger.state"
								:options="['soltero', 'casado']"
							></b-form-select>
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
									v-model="passenger.birthdate"
									type="date"
								/>
							</b-form-group>
						</b-col>
					</b-row>
				</b-col>
				<!-- appointment -->
				<b-col cols="6">
					<b-row>
						<b-col cols="12" class="text-left text-secondary"
							><label for="phone" class="mb-0 mt-2">Telefono</label>
							<b-input id="phone" v-model="passenger.phone"></b-input>
						</b-col>
					</b-row>
				</b-col>
			</b-row>
			<!-- function -->
			<b-row>
				<b-col cols="6" class="text-left text-secondary"
					><label for="function" class="mb-0 mt-2">Función</label>
					<b-input id="function" v-model="passenger.function"></b-input>
				</b-col>
				<b-col cols="6" class="text-left text-secondary">
					<label for="appointment" class="mb-0 mt-2">Cargo</label>
					<b-input id="appointment" v-model="passenger.appointment"></b-input>
				</b-col>
			</b-row>
			<!-- regions -->
			<b-row>
				<b-col cols="6" class="text-left text-secondary">
					<label for="regions" class="mb-0 mt-2">Region</label>
					<b-form-select
						id="regions"
						v-model="passenger.region"
						:options="regiones"
						@change="setComunas"
					></b-form-select>
				</b-col>
				<b-col cols="6" class="text-left text-secondary"
					><label for="comuna" class="mb-0 mt-2">Comuna</label>
					<b-form-select
						id="comuna"
						v-model="passenger.comuna"
						:options="comunas"
						:disabled="disableComunaInput"
					></b-form-select>
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
					<div
						v-if="
							editMode &&
								Array.isArray(passenger.documents) &&
								passenger.documents.length
						"
					>
						<b-badge
							v-for="(item, index) in passenger.documents"
							:key="index"
							class="p-2"
							pill
							variant="secondary"
							:href="item.url"
							target="_blank"
							>{{ cutText(item.name) }}
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
						:disabled="loading"
						block
						class="btn btn-primary d-block"
						@click.prevent="submitForm"
						>Guardar
						<b-spinner v-if="loading" small type="grow"></b-spinner>
					</b-button>
				</b-col>
			</b-row>
		</b-form>
	</div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';
import ListPassengers from './ListPassengers';
import { mapActions, mapGetters } from 'vuex';
import avatarDefault from '@/assets/user-icon.png';
import comunasRegiones from '@/data/comunas-regiones.json';

export default {
	components: { ListPassengers },
	mixins: [validationMixin],
	data() {
		return {
			regiones: [],
			comunas: [],
			disableComunaInput: true,
			mainProps: { blank: false, blankColor: '#777', width: 75, height: 75, class: 'm1' },
			form: new FormData(),
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
				phone: '',
				age: '',
				birthdate: '',
				appointment: '',
				function: '',
				region: '',
				comuna: '',
			},
		};
	},
	computed: {
		srcImageAvatar() {
			if (typeof this.passenger.passenger === 'string') {
				return this.passenger.passenger;
			} else if (this.passenger.passenger) {
				return URL.createObjectURL(this.passenger.passenger);
			} else {
				return avatarDefault;
			}
		},
		...mapGetters({
			loading: 'Passengers/loading',
			passengersList: 'Passengers/passengers',
			message: 'Passengers/message',
		}),
	},
	validations: {
		passenger: {
			firstName: {
				required,
				minLength: minLength(3),
			},
		},
	},
	watch: {
		message(newVal) {
			this.$toasted.show(newVal.text, {
				type: newVal.type,
			});
		},
	},
	mounted() {
		this.regiones = comunasRegiones.map(item => item.region);
	},
	methods: {
		async submitForm() {
			// validations
			this.$v.$touch();
			if (!this.$v.$invalid) {
				for (let index = 0; index < this.passenger.documents.length; index++) {
					this.form.append('documents', this.passenger.documents[index]);
				}
				this.form.set('firstName', this.passenger.firstName.toLowerCase());
				if (this.passenger.passenger)
					this.form.append('passenger', this.passenger.passenger);
				if (this.passenger.lastName)
					this.form.set('lastName', this.passenger.lastName.toLowerCase());
				if (this.passenger.age) this.form.set('age', this.passenger.age.toString());
				if (this.passenger.birthdate)
					this.form.set('birthdate', this.passenger.birthdate.toLowerCase());
				if (this.passenger.appointment)
					this.form.set('appointment', this.passenger.appointment.toLowerCase());
				if (this.passenger.function)
					this.form.set('function', this.passenger.function.toLowerCase());
				if (this.passenger.state)
					this.form.set('state', this.passenger.state.toLowerCase());
				if (this.passenger.phone)
					this.form.set('phone', this.passenger.phone.toLowerCase());
				if (this.passenger.region) this.form.set('region', this.passenger.region);
				if (this.passenger.comuna) this.form.set('comuna', this.passenger.comuna);
				if (this.editMode) {
					await this.editPassenger({
						payload: this.form,
						id: this.passenger._id,
					});
					this.getAllPassengers();
				} else {
					await this.savePassenger(this.form);
					this.getAllPassengers();
					this.clearInputs();
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
			this.$refs['document'].reset();
			this.$refs['avatar'].reset();
			this.editMode = true;
			this.passenger = passenger;
			if (this.passenger.region === undefined) {
				this.disableComunaInput = true;
			} else {
				this.setComunas();
			}
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
				region: '',
				comuna: '',
			};
			this.editMode = false;
			this.$v.$reset();
		},
		deleteOne(id) {
			this.deleteOnePassenger(id).then(() => this.getAllPassengers());
		},
		formatNames(files) {
			if (files.length === 1) {
				return files[0].name;
			} else {
				return `${files.length} files selected`;
			}
		},
		cutText(text) {
			const extencion = text.split('.').pop();
			if (text.length > 10) {
				return `${text.split('.')[0].substr(0, 10)}...${extencion}`;
			}
			return text;
		},
		setComunas() {
			let temp = comunasRegiones.filter(item => item.region === this.passenger.region);
			this.comunas = temp[0].comunas;
			this.disableComunaInput = false;
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
