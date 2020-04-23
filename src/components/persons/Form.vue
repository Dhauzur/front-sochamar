<template>
	<div>
		<v-stepper v-if="isDialog" v-model="stepper" class="elevation-12">
			<v-stepper-header>
				<v-stepper-step :complete="stepper > 1" step="1">
					Datos
				</v-stepper-step>
				<v-divider></v-divider>
				<v-stepper-step :complete="stepper > 2" step="2">
					Contacto
				</v-stepper-step>
				<v-divider></v-divider>
				<v-stepper-step :complete="stepper > 3" step="3">
					Rol y documentos
				</v-stepper-step>
			</v-stepper-header>
			<v-stepper-items>
				<v-stepper-content step="1">
					<v-row>
						<!-- firstName -->
						<v-col cols="12" md="4">
							<v-text-field
								v-model.trim="$v.person.firstName.$model"
								:disabled="editMode"
								filled
								outlined
								dense
								label="Nombre*"
								:error-messages="nameErrors"
								@input="$v.person.firstName.$touch()"
								@blur="$v.person.firstName.$touch()"
							/>
						</v-col>
						<!-- lastName -->
						<v-col cols="12" md="4">
							<v-text-field
								v-model.trim="person.lastName"
								filled
								outlined
								dense
								label="Apellido"
							></v-text-field>
						</v-col>
						<!-- email -->
						<v-col cols="12" md="4">
							<v-text-field
								v-model.trim="person.email"
								:disabled="!isDialog"
								outlined
								dense
								filled
								type="email"
								label="Correo electronico"
							></v-text-field>
						</v-col>
						<!-- rut -->
						<v-col cols="12" md="4">
							<v-text-field
								v-model.trim="person.rut"
								outlined
								dense
								filled
								label="Rut"
							></v-text-field>
						</v-col>
						<!-- state -->
						<v-col cols="12" md="4">
							<v-select
								v-model="person.state"
								filled
								outlined
								dense
								label="Estado"
								:items="['soltero', 'casado']"
							></v-select>
						</v-col>
						<!-- age -->
						<v-col cols="12" md="4">
							<v-text-field
								v-model.number="person.age"
								filled
								outlined
								dense
								label="Edad"
								type="number"
							></v-text-field>
						</v-col>
						<!-- birthdate -->
						<v-col cols="4">
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
										filled
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
									<v-btn text color="primary" @click="menu = false">Cerrar</v-btn>
									<v-btn
										text
										color="primary"
										@click="$refs.menu.save(person.birthdate)"
										>ok</v-btn
									>
								</v-date-picker>
							</v-menu>
						</v-col>
						<v-col cols="12">
							<v-btn class="ma-2" small text @click="closeDialog">
								Cancelar
							</v-btn>
							<v-btn class="ma-2" small color="primary" @click="stepper = 2">
								Continuar
							</v-btn>
							<v-btn class="ma-2" small color="success" @click="submit">
								<v-icon>mdi-content-save</v-icon><span>Guardar</span>
							</v-btn>
						</v-col>
					</v-row>
				</v-stepper-content>
				<v-stepper-content step="2">
					<v-row>
						<!-- phone -->
						<v-col cols="12" md="4">
							<v-text-field
								v-model="person.phone"
								outlined
								dense
								filled
								label="Teléfono"
							></v-text-field>
						</v-col>
						<!-- region -->
						<v-col cols="12" md="4">
							<v-select
								v-model="person.region"
								label="Región"
								:items="regiones"
								outlined
								dense
								filled
								@change="setComunas"
							></v-select>
						</v-col>
						<!-- comuna -->
						<v-col cols="12" md="4">
							<v-select
								v-model="person.comuna"
								label="Comuna"
								:items="comunas"
								outlined
								eager
								dense
								filled
								:disabled="disableComunaInput"
							></v-select>
						</v-col>
						<v-col cols="12">
							<v-btn class="ma-2" small text @click="closeDialog">
								Cancelar
							</v-btn>
							<v-btn class="ma-2" small color="primary" @click="stepper = 3">
								Continuar
							</v-btn>
							<v-btn class="ma-2" small color="success" @click="submit">
								<v-icon>mdi-content-save</v-icon><span>Guardar</span>
							</v-btn>
						</v-col>
					</v-row>
				</v-stepper-content>
				<v-stepper-content step="3">
					<v-row>
						<!-- function -->
						<v-col cols="12" md="4">
							<v-text-field
								v-model="person.function"
								outlined
								dense
								filled
								label="Función"
							></v-text-field>
						</v-col>
						<!-- appointment -->
						<v-col cols="12" md="4">
							<v-text-field
								v-model="person.appointment"
								outlined
								dense
								filled
								label="Cargo"
							></v-text-field>
						</v-col>
						<!-- documents -->
						<v-col cols="12" md="4">
							<v-file-input
								ref="document"
								v-model="person.documents"
								clearable
								multiple
								outlined
								dense
								filled
								label="Agrega documentos, max. 5"
							>
							</v-file-input>
						</v-col>
						<v-col cols="12">
							<v-btn small text @click="closeDialog">
								Cancelar
							</v-btn>
							<v-btn small color="success" @click="submit">
								<v-icon>mdi-content-save</v-icon><span>Guardar</span>
							</v-btn>
						</v-col>
					</v-row>
				</v-stepper-content>
			</v-stepper-items>
		</v-stepper>
		<v-card v-else outlined>
			<v-card-text>
				<v-container>
					<v-row justify="start">
						<!-- avatar -->
						<v-col cols="12">
							<label for="avatar" class="d-flex justify-center">
								<v-img
									v-bind="mainProps"
									rounded="circle"
									alt="avatar"
									class="pointer borderRadius"
									max-width="130px"
									:src="urlAvatar"
									><div class="textAvatar success">
										Actualiza avatar
									</div>
								</v-img>
							</label>
							<v-file-input
								id="avatar"
								ref="avatar"
								class="pointer d-none"
								accept="image/jpeg, image/png, image/gif, image/jpg"
								@change="setAvatar"
							/>
						</v-col>
						<v-col cols="12" class="text-left">
							<p class="headline">Datos personales</p>
						</v-col>
						<!-- firstName -->
						<v-col cols="12" md="4">
							<v-text-field
								v-model.trim="$v.person.firstName.$model"
								:disabled="editMode"
								filled
								outlined
								dense
								label="Nombre*"
								:error-messages="nameErrors"
								@input="$v.person.firstName.$touch()"
								@blur="$v.person.firstName.$touch()"
							/>
						</v-col>
						<!-- lastName -->
						<v-col cols="12" md="4">
							<v-text-field
								v-model.trim="person.lastName"
								filled
								outlined
								dense
								label="Apellido"
							></v-text-field>
						</v-col>
						<!-- email -->
						<v-col cols="12" md="4">
							<v-text-field
								v-model.trim="person.email"
								:disabled="!isDialog"
								outlined
								dense
								filled
								type="email"
								label="Correo electronico"
							></v-text-field>
						</v-col>
						<!-- rut -->
						<v-col cols="12" md="4">
							<v-text-field
								v-model.trim="person.rut"
								outlined
								dense
								filled
								label="Rut"
							></v-text-field>
						</v-col>
						<!-- state -->
						<v-col cols="12" md="4">
							<v-select
								v-model="person.state"
								filled
								outlined
								dense
								label="Estado"
								:items="['soltero', 'casado']"
							></v-select>
						</v-col>
						<!-- age -->
						<v-col cols="12" md="4">
							<v-text-field
								v-model.number="person.age"
								filled
								outlined
								dense
								label="Edad"
								type="number"
							></v-text-field>
						</v-col>
						<!-- birthdate -->
						<v-col cols="4">
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
										filled
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
									<v-btn text color="primary" @click="menu = false">Cerrar</v-btn>
									<v-btn
										text
										color="primary"
										@click="$refs.menu.save(person.birthdate)"
										>ok</v-btn
									>
								</v-date-picker>
							</v-menu>
						</v-col>
						<v-col cols="12" class="text-left">
							<p class="headline">Contacto y ubicación</p>
						</v-col>
						<!-- phone -->
						<v-col cols="12" md="4">
							<v-text-field
								v-model="person.phone"
								outlined
								dense
								filled
								label="Teléfono"
							></v-text-field>
						</v-col>
						<!-- region -->
						<v-col cols="12" md="4">
							<v-select
								v-model="person.region"
								label="Región"
								:items="regiones"
								outlined
								dense
								filled
								@change="setComunas"
							></v-select>
						</v-col>
						<!-- comuna -->
						<v-col cols="12" md="4">
							<v-select
								v-model="person.comuna"
								label="Comuna"
								:items="comunas"
								outlined
								eager
								dense
								filled
								:disabled="disableComunaInput"
							></v-select>
						</v-col>
						<v-col cols="12" class="text-left">
							<p class="headline">Rol</p>
						</v-col>
						<!-- function -->
						<v-col cols="12" md="4">
							<v-text-field
								v-model="person.function"
								outlined
								dense
								filled
								label="Función"
							></v-text-field>
						</v-col>
						<!-- appointment -->
						<v-col cols="12" md="4">
							<v-text-field
								v-model="person.appointment"
								outlined
								dense
								filled
								label="Cargo"
							></v-text-field>
						</v-col>
						<v-col cols="12" class="text-left">
							<p class="headline">Documentos</p>
						</v-col>
						<!-- documents -->
						<v-col cols="12" md="6">
							<v-file-input
								ref="document"
								v-model="person.documents"
								clearable
								multiple
								outlined
								dense
								filled
								label="Agrega documentos, max. 5"
							>
							</v-file-input>
						</v-col>
					</v-row>
					<small>*Campo requerido</small>
				</v-container>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn v-if="isDialog" text @click="closeDialog">Cerrar</v-btn>
				<v-btn small :loading="saving" :disabled="saving" color="primary" @click="submit">
					<v-icon>mdi-content-save</v-icon><span>Guardar</span>
				</v-btn>
			</v-card-actions>
		</v-card>
	</div>
</template>

<script>
import axios from 'axios';
import avatarDefault from '@/assets/default.png';
import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';
import { createPerson, putPerson } from '@/service/persons';
import { api_absolute } from '@/config/index.js';

export default {
	mixins: [validationMixin],
	props: {
		editMode: {
			type: Boolean,
			required: true,
		},
		selected: {
			type: Object,
			required: false,
			default: null,
		},
		close: {
			type: Function,
			default: () => {},
		},
		updateUser: {
			type: Function,
			default: () => {},
		},
		isDialog: {
			type: Boolean,
			default: false,
		},
		idCompany: {
			type: String,
			default: null,
		},
		getPersons: {
			type: Function,
			default: () => null,
		},
		toast: {
			type: Function,
			required: true,
		},
	},
	data() {
		return {
			stepper: 1,
			saving: false,
			urlAvatar: avatarDefault,
			isActive: false,
			filteredWord: '',
			list: [],
			comunas: [],
			comunasRegiones: [],
			dialog: false,
			disableComunaInput: true,
			mainProps: { blank: false, blankColor: '#777', width: 75, height: 75, class: 'm1' },
			menu: false,
			regiones: [],
			success: '',
			person: { firstName: '' },
		};
	},
	computed: {
		nameErrors() {
			const errors = [];
			if (!this.$v.person.firstName.$dirty) return errors;
			!this.$v.person.firstName.required && errors.push('El nombre es querido');
			return errors;
		},
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
		selected() {
			this.person = this.selected;
		},
	},
	mounted() {
		if (this.selected) this.person = this.selected;
		this.person.avatar && (this.urlAvatar = this.person.avatar);
		this.fetchRegions();
	},
	methods: {
		setAvatar(file) {
			this.person.avatar = file;
			this.urlAvatar = URL.createObjectURL(file);
		},
		async fetchRegions() {
			const response = await axios.get(`${api_absolute}/comunas-regiones.json`);
			this.comunasRegiones = response.data;
			this.regiones = this.comunasRegiones.map(item => item.region);
		},
		submit() {
			this.$v.$touch();
			if (!this.$v.$invalid) {
				this.saving = true;
				this.person.idCompany = this.idCompany;
				if (this.isDialog) {
					if (this.editMode) {
						putPerson(this.person, this.person._id)
							.then(() => {
								this.getPersons();
								this.toast('success', 'Actualizado exitosamente');
								this.closeDialog();
								this.saving = false;
							})
							.catch(error => {
								this.toast('error', error.message);
								this.saving = false;
							});
					} else {
						createPerson(this.person)
							.then(() => {
								this.getPersons();
								this.toast('success', 'Guardado exitosamente');
								this.closeDialog();
								this.saving = false;
							})
							.catch(error => {
								this.toast('error', error.message);
								this.saving = false;
							});
					}
				} else {
					putPerson(this.person, this.person._id)
						.then(res => {
							this.updateUser(res);
							this.toast('success', 'Actualizado exitosamente');
							this.saving = false;
						})
						.catch(error => {
							this.toast('error', error.message);
							this.saving = false;
						});
				}
			}
		},
		closeDialog() {
			this.clearInputs();
			this.close();
		},
		clearInputs() {
			this.urlAvatar = avatarDefault;
			this.person = { firstName: '' };
			this.$v.$reset();
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
