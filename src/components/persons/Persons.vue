<template>
	<div class="container">
		<div class="position-relative">
			<!-- list person -->
			<v-row>
				<v-col v-if="personsList.length > 0">
					<h5>Listado de personas</h5>
					<persons-list
						:delete-one="deleteOne"
						:get-all-persons="getAllPersons"
						:person="person"
						:persons="personsList"
						:selected-person="selectedPerson"
					/>
				</v-col>
			</v-row>
			<v-divider v-if="personsList.length > 0" />
			<v-form>
				<v-row>
					<!-- avatar -->
					<v-col class="p-auto">
						<h5>
							{{ editMode ? 'Editar persona' : 'Crear nueva persona' }}
						</h5>
						<v-img
							for
							v-bind="mainProps"
							rounded="circle"
							alt="avatar"
							:src="setAvatar"
						></v-img>
						<v-file-input
							ref="avatar"
							accept="image/jpeg, image/png, image/gif, image/jpg"
							:placeholder="editMode ? 'Actualizar imagen' : 'Agrega una imagen'"
							drop-placeholder="Arrastrar aqui..."
							@change="e => (person.avatar = e.target.files[0])"
						></v-file-input>
					</v-col>
					<v-col cols="12">
						<label for="upload" class="pointer">{{
							typeof person.avatar === 'string' ? 'Cambiar avatar' : 'Subir avatar'
						}}</label>
					</v-col>
					<!-- button for change view to new person -->
					<div
						v-if="editMode"
						class="text-right position-absolute"
						style="top: 0; right: 0;"
					>
						<v-btn @click="clearInputs">Nuevo </v-btn>
					</div>
					<!-- firstName -->
					<v-col cols="6">
						<v-row>
							<v-col cols="12" class="text-right">
								<v-text-field
									v-model.trim="$v.person.firstName.$model"
									label="Nombre"
								/>
								<div v-if="$v.person.firstName.$dirty">
									<small v-if="!$v.person.firstName.required" class="text-danger">
										Campo requerido
									</small>
									<small
										v-if="!$v.person.firstName.minLength"
										class="text-danger"
									>
										Minimo 3 Caracteres
									</small>
								</div>
							</v-col>
						</v-row>
					</v-col>
					<!-- lastName -->
					<v-col cols="6">
						<v-row>
							<v-col cols="12" class="text-right">
								<v-text-field
									v-model.trim="person.lastName"
									label="Apellido"
								></v-text-field>
							</v-col>
						</v-row>
					</v-col>
				</v-row>
				<v-row>
					<!-- age -->
					<v-col cols="6">
						<v-row>
							<v-col cols="12" class="text-right">
								<v-text-field
									v-model.number="person.age"
									label="Edad"
									type="number"
								></v-text-field>
							</v-col>
						</v-row>
					</v-col>
					<!-- state -->
					<v-col cols="6">
						<v-select
							v-model="person.state"
							label="Estado"
							:items="['soltero', 'casado']"
						></v-select>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="6">
						<v-row>
							<v-col cols="12">
								<v-text-field
									v-model="person.birthdate"
									label="Fecha nacimiento"
									type="date"
								/>
							</v-col>
						</v-row>
					</v-col>
					<v-col cols="6">
						<v-row>
							<v-col cols="12">
								<v-text-field
									v-model="person.phone"
									label="Teléfono"
								></v-text-field>
							</v-col>
						</v-row>
					</v-col>
				</v-row>
				<!-- function -->
				<v-row>
					<v-col cols="6">
						<v-text-field v-model="person.function" label="Función"></v-text-field>
					</v-col>
					<v-col cols="6">
						<v-text-field v-model="person.appointment" label="Cargo"></v-text-field>
					</v-col>
				</v-row>
				<!-- regions -->
				<v-row>
					<v-col cols="6">
						<v-select
							v-model="person.region"
							label="Región"
							:items="regiones"
							@change="setComunas"
						></v-select>
					</v-col>
					<v-col cols="6">
						<v-select
							v-model="person.comuna"
							label="Comuna"
							:items="comunas"
							:disabled="disableComunaInput"
						></v-select>
					</v-col>
				</v-row>
				<!-- documents -->
				<v-row>
					<v-col cols="12" class="mt-2">
						<small v-if="!person.documents && !person.documents[0] && editMode"
							>Sin Documentos</small
						>
						<div
							v-if="
								editMode &&
									Array.isArray(person.documents) &&
									person.documents.length
							"
						>
							<v-badge
								v-for="(item, index) in person.documents"
								:key="index"
								class="p-2"
								pill
								:href="item.url"
								target="_blank"
								>{{ cutText(item.name) }}
							</v-badge>
						</div>
					</v-col>
					<v-col cols="12" class="mt-2">
						<v-file-input
							ref="document"
							:file-name-formatter="formatNames"
							:placeholder="
								editMode
									? 'Cambiar todos los documentos'
									: 'Agrega un Documento, maximo 5'
							"
							drop-placeholder="Arrastrar aqui..."
							multiple
							show-size
							label="File input"
							@change="setDocuments"
						></v-file-input>
					</v-col>
				</v-row>
				<v-row>
					<v-col class="mt-4">
						<v-btn
							:disabled="loading"
							block
							class="btn btn-primary d-block"
							@click.prevent="submitForm"
							>Guardar
							<v-spinner v-if="loading" small type="grow"></v-spinner>
						</v-btn>
					</v-col>
				</v-row>
			</v-form>
		</div>
	</div>
</template>

<script>
import PersonsList from '@/components/persons/PersonsList';
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
