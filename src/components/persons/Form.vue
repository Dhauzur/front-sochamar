<template>
	<v-card elevation="24">
		<v-card-title>
			<span class="headline">{{ title }}</span>
		</v-card-title>
		<v-card-text>
			<v-container>
				<v-row justify="center">
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
								><div class="textAvatar secondary">
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
					<!-- firstName -->
					<v-col cols="12" md="4">
						<v-text-field
							v-model.trim="$v.person.firstName.$model"
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
							label="Rut"
							type="number"
						></v-text-field>
					</v-col>
					<!-- state -->
					<v-col cols="12" md="4">
						<v-select
							v-model="person.state"
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
							outlined
							dense
							label="Edad"
							type="number"
						></v-text-field>
					</v-col>
					<!-- birthdate -->
					<v-col cols="12" md="4">
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
					<!-- phone -->
					<v-col cols="12" md="4">
						<v-text-field
							v-model="person.phone"
							outlined
							dense
							label="Teléfono"
						></v-text-field>
					</v-col>
					<!-- function -->
					<v-col cols="12" md="4">
						<v-text-field
							v-model="person.function"
							outlined
							dense
							label="Función"
						></v-text-field>
					</v-col>
					<!-- appointment -->
					<v-col cols="12" md="4">
						<v-text-field
							v-model="person.appointment"
							outlined
							dense
							label="Cargo"
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
							:disabled="disableComunaInput"
						></v-select>
					</v-col>
					<!-- documents -->
					<v-col cols="12" offset-md="6" md="6">
						<v-file-input
							ref="document"
							v-model="person.documents"
							clearable
							multiple
							outlined
							dense
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
			<v-btn :loading="saving" :disabled="saving" color="primary" text @click="submit">
				Guardar
			</v-btn>
		</v-card-actions>
	</v-card>
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
		title: {
			type: String,
			required: true,
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
							})
							.catch(error => this.toast('error', error.message));
					} else {
						createPerson(this.person)
							.then(() => {
								this.getPersons();
								this.toast('success', 'Guardado exitosamente');
								this.closeDialog();
							})
							.catch(error => this.toast('error', error.message));
					}
				} else {
					putPerson(this.person, this.person._id)
						.then(res => {
							this.updateUser(res);
							this.toast('success', 'Actualizado exitosamente');
						})
						.catch(error => this.toast('error', error.message));
				}
				this.saving = false;
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
