<template>
	<v-container style="height: 75vh; position: relative">
		<!-- list person -->
		<v-row>
			<v-col v-if="personsList.length > 0" cols="12">
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
		<!-- dialog -->
		<v-dialog v-model="dialog" persistent max-width="800px">
			<template v-slot:activator="{ on }">
				<v-btn absolute fab bottom right color="primary" v-on="on">
					<v-icon>mdi-plus</v-icon>
				</v-btn>
			</template>
			<v-card>
				<v-card-title>
					<span class="headline">Nueva Persona</span>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-row justify="center">
							<!-- avatar -->
							<v-col cols="12">
								<label for="avatar" class="d-flex justify-center">
									<v-img
										:clearable="true"
										v-bind="mainProps"
										rounded="circle"
										alt="avatar"
										class="pointer borderRadius"
										max-width="130px"
										:src="setAvatar"
										><div class="  textAvatar secondary">
											{{
												typeof person.avatar === 'string'
													? 'Cambiar avatar'
													: 'Subir avatar'
											}}
										</div>
									</v-img>
								</label>
								<v-file-input
									id="avatar"
									ref="avatar"
									v-model="person.avatar"
									class="pointer d-none"
									accept="image/jpeg, image/png, image/gif, image/jpg"
								/>
							</v-col>
							<!-- firstName -->
							<v-col cols="3">
								<v-text-field
									v-model.trim="$v.person.firstName.$model"
									outlined
									dense
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
							<!-- lastName -->
							<v-col cols="3">
								<v-text-field
									v-model.trim="person.lastName"
									outlined
									dense
									label="Apellido"
								></v-text-field>
							</v-col>
							<!-- age -->
							<v-col cols="2">
								<v-text-field
									v-model.number="person.age"
									outlined
									dense
									label="Edad"
									type="number"
								></v-text-field>
							</v-col>
							<!-- state -->
							<v-col cols="4">
								<v-select
									v-model="person.state"
									outlined
									dense
									label="Estado"
									:items="['soltero', 'casado']"
								></v-select>
							</v-col>
							<!-- birthdate -->
							<v-col cols="3">
								<v-menu
									ref="menu"
									v-model="menu"
									:close-on-content-click="false"
									:return-value.sync="person.birthdate"
									transition="scale-transition"
									offset-y
									min-width="290px"
								>
									<template v-slot:activator="{ on }">
										<v-text-field
											v-model="person.birthdate"
											label="Fecha de nacimiento"
											readonly
											outlined
											dense
											v-on="on"
										></v-text-field>
									</template>
									<v-date-picker
										v-model="person.birthdate"
										no-title
										scrollable
										locale="es"
										:show-current="false"
									>
										<v-spacer></v-spacer>
										<v-btn text color="primary" @click="menu = false"
											>Cerrar</v-btn
										>
										<v-btn
											text
											color="primary"
											@click="$refs.menu.save(person.birthdate)"
											>ok</v-btn
										>
									</v-date-picker>
								</v-menu>
							</v-col>
							<v-col cols="3">
								<v-text-field
									v-model="person.phone"
									outlined
									dense
									label="Teléfono"
								></v-text-field>
							</v-col>
							<v-col cols="3">
								<v-text-field
									v-model="person.function"
									outlined
									dense
									label="Función"
								></v-text-field>
							</v-col>
							<v-col cols="3">
								<v-text-field
									v-model="person.appointment"
									outlined
									dense
									label="Cargo"
								></v-text-field>
							</v-col>
							<v-col cols="3">
								<v-select
									v-model="person.region"
									label="Región"
									:items="regiones"
									outlined
									dense
									@change="setComunas"
								></v-select>
							</v-col>
							<v-col cols="3">
								<v-select
									v-model="person.comuna"
									label="Comuna"
									:items="comunas"
									outlined
									dense
									:disabled="disableComunaInput"
								></v-select>
							</v-col>
							<v-col cols="6">
								<v-file-input
									ref="document"
									:file-name-formatter="formatNames"
									:label="
										editMode
											? 'Cambiar todos los documentos'
											: 'Agrega un Documento, max. 5'
									"
									clearable
									multiple
									outlined
									dense
									@change="setDocuments"
								></v-file-input>
							</v-col>
							<v-col cols="12">
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
						</v-row>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn text @click="closeDialog">Cerrar</v-btn>
					<v-btn :loading="loading" color="primary" text @click.prevent="submitForm"
						>Guardar</v-btn
					>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script>
import PersonsList from '@/components/persons/PersonsList';
import axios from 'axios';
import avatarDefault from '@/assets/default.png';
import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';
import { mapActions, mapGetters } from 'vuex';
import { api_absolute } from '@/config/index.js';

export default {
	components: { PersonsList },
	mixins: [validationMixin],
	data() {
		return {
			menu: false,
			dialog: false,
			comunas: [],
			comunasRegiones: [],
			disableComunaInput: true,
			editMode: false,
			mainProps: { blank: false, blankColor: '#777', width: 75, height: 75, class: 'm1' },
			regiones: [],
			selected: {},
			success: '',
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
			let form = new FormData();
			// validations
			this.$v.$touch();
			if (!this.$v.$invalid) {
				for (let index = 0; index < this.person.documents.length; index++) {
					form.append('documents', this.person.documents[index]);
				}
				form.set('firstName', this.person.firstName.toLowerCase());
				if (this.person.avatar) form.append('avatar', this.person.avatar);
				if (this.person.lastName) form.set('lastName', this.person.lastName.toLowerCase());
				if (this.person.age) form.set('age', this.person.age.toString());
				if (this.person.birthdate)
					form.set('birthdate', this.person.birthdate.toLowerCase());
				if (this.person.appointment)
					form.set('appointment', this.person.appointment.toLowerCase());
				if (this.person.function) form.set('function', this.person.function.toLowerCase());
				if (this.person.state) form.set('state', this.person.state.toLowerCase());
				if (this.person.phone) form.set('phone', this.person.phone.toLowerCase());
				if (this.person.region) form.set('region', this.person.region);
				if (this.person.comuna) form.set('comuna', this.person.comuna);
				if (this.editMode) {
					await this.editPerson({
						payload: form,
						id: this.person._id,
					});
					this.getAllPersons();
				} else {
					await this.savePerson(form);
					this.getAllPersons();
					this.closeDialog();
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
			this.editMode = true;
			this.person = person;
			if (this.person.region === undefined) {
				this.disableComunaInput = true;
			} else {
				this.setComunas();
			}
		},
		closeDialog() {
			this.clearInputs();
			this.dialog = false;
		},
		clearInputs() {
			this.person = {
				_id: null,
				avatar: null,
				documents: [],
				age: '',
				appointment: '',
				birthdate: '',
				comuna: '',
				firstName: '',
				function: '',
				lastName: '',
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

<style>
.borderRadius {
	border-radius: 10px !important;
}

.inputAvatar {
	height: 150px;
	width: 150px;
	margin-left: -75px;
	top: -25px;
	opacity: 0;
	position: absolute;
}
.textAvatar {
	margin-top: 50px;
}
</style>
