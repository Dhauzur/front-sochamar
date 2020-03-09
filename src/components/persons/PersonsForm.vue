<template>
	<div class="position-relative">
		<!-- list person -->
		<b-row>
			<b-col v-if="personsList.length > 0">
				<h5>Listado de personas</h5>
				<persons-list
					:passenger="passenger"
					:delete-one="deleteOne"
					:get-all-persons="getAllPersons"
					:person="person"
					:persons="personsList"
					:selected-person="selectedPerson"
				/>
			</b-col>
		</b-row>
		<b-dropdown-divider v-if="personsList.length > 0" />
		<b-form>
			<b-row>
				<!-- avatar -->
				<b-col class="mt-3">
					<h5>
						{{ editMode ? 'Editar persona' : 'Crear nueva persona' }}
					</h5>
					<label for="upload">
						<b-img
							class="pointer"
							for
							v-bind="mainProps"
							rounded="circle"
							alt="avatar"
							:src="setAvatar"
						></b-img>
					</label>
					<b-form-file
						id="upload"
						ref="avatar"
						class="d-none"
						accept="image/jpeg, image/png, image/gif, image/jpg"
						:placeholder="editMode ? 'Actualizar imagen' : 'Agrega una imagen'"
						drop-placeholder="Arrastrar aqui..."
						@change="e => (person.avatar = e.target.files[0])"
					></b-form-file>
				</b-col>
				<b-col cols="12">
					<label for="upload" class="pointer">{{
						typeof person.avatar === 'string' ? 'Cambiar avatar' : 'Subir avatar'
					}}</label>
				</b-col>
				<!-- button for change view to new person -->
				<div v-if="editMode" class="text-right position-absolute" style="top: 0; right: 0;">
					<b-button @click="clearInputs">Nuevo </b-button>
				</div>
				<!-- firstName -->
				<b-col cols="6">
					<b-row>
						<b-col cols="12" class="text-left"
							><label for="firstName" class="mb-0 mt-2">Nombre</label>
						</b-col>
						<b-col cols="12" class="text-right">
							<b-input id="firstName" v-model.trim="$v.person.firstName.$model" />
							<div v-if="$v.person.firstName.$dirty">
								<small v-if="!$v.person.firstName.required" class="text-danger">
									Campo requerido
								</small>
								<small v-if="!$v.person.firstName.minLength" class="text-danger">
									Minimo 3 Caracteres
								</small>
							</div>
						</b-col>
					</b-row>
				</b-col>
				<!-- lastName -->
				<b-col cols="6">
					<b-row>
						<b-col cols="12" class="text-left "
							><label for="lastName" class="mb-0 mt-2">Apellido</label>
						</b-col>
						<b-col cols="12" class="text-right">
							<b-input id="lastName" v-model.trim="person.lastName"></b-input>
						</b-col>
					</b-row>
				</b-col>
			</b-row>
			<b-row>
				<!-- age -->
				<b-col cols="6">
					<b-row>
						<b-col cols="12" class="text-left "
							><label for="age" class="mb-0 mt-2">Edad</label>
						</b-col>
						<b-col cols="12" class="text-right">
							<b-input id="age" v-model.number="person.age" type="number"></b-input>
						</b-col>
					</b-row>
				</b-col>
				<!-- state -->
				<b-col cols="6">
					<b-row>
						<b-col cols="12" class="text-left "
							><label for="state" class="mb-0 mt-2">Estado</label>
						</b-col>
						<b-col cols="12">
							<b-form-select
								id="state"
								v-model="person.state"
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
						<b-col cols="12" class="text-left "
							><label for="birthdate" class="mb-0 mt-2">Fecha nacimiento</label>
						</b-col>
						<b-col cols="12">
							<b-form-group id="birthdate" label-for="input-1" class="pb-0 mb-0">
								<b-form-input id="input-1" v-model="person.birthdate" type="date" />
							</b-form-group>
						</b-col>
					</b-row>
				</b-col>
				<!-- appointment -->
				<b-col cols="6">
					<b-row>
						<b-col cols="12" class="text-left "
							><label for="phone" class="mb-0 mt-2">Telefono</label>
							<b-input id="phone" v-model="person.phone"></b-input>
						</b-col>
					</b-row>
				</b-col>
			</b-row>
			<!-- function -->
			<b-row>
				<b-col cols="6" class="text-left "
					><label for="function" class="mb-0 mt-2">Función</label>
					<b-input id="function" v-model="person.function"></b-input>
				</b-col>
				<b-col cols="6" class="text-left ">
					<label for="appointment" class="mb-0 mt-2">Cargo</label>
					<b-input id="appointment" v-model="person.appointment"></b-input>
				</b-col>
			</b-row>
			<!-- regions -->
			<b-row>
				<b-col cols="6" class="text-left ">
					<label for="regions" class="mb-0 mt-2">Region</label>
					<b-form-select
						id="regions"
						v-model="person.region"
						:options="regiones"
						@change="setComunas"
					></b-form-select>
				</b-col>
				<b-col cols="6" class="text-left "
					><label for="comuna" class="mb-0 mt-2">Comuna</label>
					<b-form-select
						id="comuna"
						v-model="person.comuna"
						:options="comunas"
						:disabled="disableComunaInput"
					></b-form-select>
				</b-col>
			</b-row>
			<!-- documents -->
			<b-row>
				<b-col cols="12" class="mt-2">
					<small v-if="!person.documents && !person.documents[0] && editMode"
						>Sin Documentos</small
					>
					<div
						v-if="
							editMode && Array.isArray(person.documents) && person.documents.length
						"
					>
						<b-badge
							v-for="(item, index) in person.documents"
							:key="index"
							class="p-2"
							pill
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
import PersonsList from './PersonsList';
import axios from 'axios';
import avatarDefault from '@/assets/user-icon.png';
import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';
import { mapActions, mapGetters } from 'vuex';
import { api_absolute } from '@/config/index.js';

export default {
	components: { PersonsList },
	mixins: [validationMixin],
	data() {
		return {
			comunas: [],
			comunasRegiones: [],
			disableComunaInput: true,
			editMode: false,
			empty: true,
			errors: false,
			form: new FormData(),
			formTouched: false,
			mainProps: { blank: false, blankColor: '#777', width: 75, height: 75, class: 'm1' },
			regiones: [],
			selected: {},
			success: '',
			uiState: 'submit not clicked',
			person: {
				_id: null,
				age: '',
				appointment: '',
				birthdate: '',
				comuna: '',
				documents: [],
				firstName: '',
				function: '',
				lastName: '',
				avatar: null,
				phone: '',
				region: '',
				state: '',
			},
		};
	},
	computed: {
		setAvatar() {
			if (typeof this.person.avatar === 'string') {
				return this.person.avatar;
			} else if (this.person.avatar) {
				return URL.createObjectURL(this.person.avatar);
			} else {
				return avatarDefault;
			}
		},
		...mapGetters({
			loading: 'Persons/loading',
			personsList: 'Persons/persons',
			message: 'Persons/message',
		}),
	},
	validations: {
		person: {
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
		this.fetchRegions();
	},
	methods: {
		async fetchRegions() {
			const response = await axios.get(`${api_absolute}/comunas-regiones.json`);
			this.comunasRegiones = response.data;
			this.regiones = this.comunasRegiones.map(item => item.region);
		},
		async submitForm() {
			// validations
			this.$v.$touch();
			if (!this.$v.$invalid) {
				for (let index = 0; index < this.person.documents.length; index++) {
					this.form.append('documents', this.person.documents[index]);
				}
				this.form.set('firstName', this.person.firstName.toLowerCase());
				if (this.person.avatar) this.form.append('avatar', this.person.avatar);
				if (this.person.lastName)
					this.form.set('lastName', this.person.lastName.toLowerCase());
				if (this.person.age) this.form.set('age', this.person.age.toString());
				if (this.person.birthdate)
					this.form.set('birthdate', this.person.birthdate.toLowerCase());
				if (this.person.appointment)
					this.form.set('appointment', this.person.appointment.toLowerCase());
				if (this.person.function)
					this.form.set('function', this.person.function.toLowerCase());
				if (this.person.state) this.form.set('state', this.person.state.toLowerCase());
				if (this.person.phone) this.form.set('phone', this.person.phone.toLowerCase());
				if (this.person.region) this.form.set('region', this.person.region);
				if (this.person.comuna) this.form.set('comuna', this.person.comuna);
				if (this.editMode) {
					await this.editPerson({
						payload: this.form,
						id: this.person._id,
					});
					this.getAllPersons();
				} else {
					await this.savePerson(this.form);
					this.getAllPersons();
					this.clearInputs();
				}
			}
		},
		setDocuments(e) {
			this.person.documents = [];
			let files = e.target.files;
			if (!files.length) {
				return false;
			}
			for (let index = 0; index < files.length; index++) {
				this.person.documents.push(files[index]);
			}
		},
		selectedPerson(person) {
			this.$refs['document'].reset();
			this.$refs['avatar'].reset();
			this.editMode = true;
			this.person = person;
			if (this.person.region === undefined) {
				this.disableComunaInput = true;
			} else {
				this.setComunas();
			}
		},
		clearInputs() {
			this.$refs['document'].reset();
			this.$refs['avatar'].reset();
			this.person = {
				_id: null,
				age: '',
				appointment: '',
				birthdate: '',
				comuna: '',
				documents: [],
				firstName: '',
				function: '',
				lastName: '',
				person: null,
				region: '',
				state: '',
			};
			this.editMode = false;
			this.$v.$reset();
		},
		deleteOne(id) {
			this.deleteOnePerson(id).then(() => this.getAllPersons());
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
			let temp = this.comunasRegiones.filter(item => item.region === this.person.region);
			this.comunas = temp[0].comunas;
			this.disableComunaInput = false;
		},
		...mapActions({
			deleteOnePerson: 'Persons/deleteOnePerson',
			editPerson: 'Persons/editPerson',
			getAllPersons: 'Persons/fetchAllPersons',
			savePerson: 'Persons/savePerson',
		}),
	},
};
</script>
