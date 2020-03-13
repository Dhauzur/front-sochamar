<template>
	<b-container>
		<b-row id="nav" class="justify-content-center">
			<b-col md="8" lg="6" class="background-module pb-3 px-4">
				<h3 class="my-4">Mi perfil</h3>
				<!-- Analyst -->
				<h6 v-if="profile.analyst">Analista</h6>
				<b-form @submit.prevent="submitForm">
					<b-row>
						<!-- avatar -->
						<b-col>
							<label v-if="profile.img" for="upload">
								<b-img
									class="pointer"
									for
									v-bind="mainProps"
									rounded="circle"
									alt="avatar"
									:src="profile.img"
								></b-img>
							</label>
							<b-form-file
								id="upload"
								ref="avatar"
								class="d-none"
								accept="image/jpeg, image/png, image/gif, image/jpg"
								:placeholder="'Agrega una imagen'"
								drop-placeholder="Arrastrar aqui..."
								:disabled="loading"
								@change="e => onFileUpload(e)"
							></b-form-file>
						</b-col>
						<b-col cols="12">
							<label
								for="upload"
								class="pointer text-secondary"
								v-text="avatarMessage"
							></label>
						</b-col>
						<!-- name -->
						<b-col cols="6">
							<b-form-group id="input-group-1" label="Nombre:" label-for="name-input">
								<b-form-input id="firstName" v-model.trim="profileData.name" />
								<div v-if="$v.profileData.name.$dirty">
									<small
										v-if="!$v.profileData.name.minLength"
										class="text-danger"
									>
										Minimo 5 Caracteres
									</small>
									<small
										v-if="!$v.profileData.name.maxLength"
										class="text-danger"
									>
										Maximo 100 Caracteres
									</small>
								</div>
							</b-form-group>
						</b-col>
						<!-- lastName -->
						<b-col cols="6">
							<b-form-group
								id="input-group-2"
								label="Apellido:"
								label-for="lastName-input"
							>
								<b-form-input id="lastName" v-model.trim="profileData.lastName" />
								<div v-if="$v.profileData.lastName.$dirty">
									<small
										v-if="!$v.profileData.lastName.minLength"
										class="text-danger"
									>
										Minimo 3 Caracteres
									</small>
									<small
										v-if="!$v.profileData.lastName.maxLength"
										class="text-danger"
									>
										Maximo 100 Caracteres
									</small>
								</div>
							</b-form-group>
						</b-col>
					</b-row>
					<!--Submit-->
					<b-col>
						<b-button :disabled="loading" type="submit" variant="primary"
							>Actualizar
						</b-button>
						<small v-if="profileErrors" class="mt-2 d-block text-danger">
							Debe rellenar el formulario correctamente
						</small>
					</b-col>
				</b-form>
			</b-col>
		</b-row>
		<b-row class="justify-content-center">
			<b-col md="8" lg="6" class="background-module pb-3 px-4">
				<h3 class="my-4">Seguridad</h3>
				<b-form @submit.prevent="submitNewPassword">
					<b-form-group
						id="new-password-group"
						label="Nueva contraseña:"
						label-for="newPassword-input"
					>
						<b-form-input
							id="new-password"
							v-model.trim="securityData.newPassword"
							type="password"
						/>
						<div v-if="$v.securityData.newPassword.$dirty">
							<small v-if="!$v.securityData.newPassword.required" class="text-danger">
								Campo Requerido
							</small>
							<small
								v-if="!$v.securityData.newPassword.minLength"
								class="text-danger"
							>
								Minimo 5 Caracteres
							</small>
							<small
								v-if="!$v.securityData.newPassword.maxLength"
								class="text-danger"
							>
								Maximo 100 Caracteres
							</small>
						</div>
					</b-form-group>

					<!--Submit-->
					<b-col>
						<b-button :disabled="loading" type="submit" variant="primary"
							>Actualizar contraseña
						</b-button>
						<small v-if="securityErrors" class="mt-2 d-block text-danger">
							Debe rellenar el formulario correctamente
						</small>
					</b-col>
				</b-form>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { validationMixin } from 'vuelidate';
import { minLength, maxLength, required } from 'vuelidate/lib/validators';

export default {
	mixins: [validationMixin],
	data() {
		return {
			profileData: {
				name: '',
				lastName: '',
				analyst: false,
				img: '',
			},
			securityData: {
				newPassword: '',
			},
			profileErrors: false,
			securityErrors: false,
			mainProps: { blank: false, blankColor: '#777', width: 75, height: 75, class: 'm1' },
		};
	},
	computed: {
		avatarMessage() {
			return this.profileData.img.length > 0 ? 'Cambiar avatar' : 'Subir avatar';
		},
		...mapGetters({
			profile: 'User/profile',
			message: 'User/message',
			loading: 'User/loading',
		}),
	},
	watch: {
		message(newVal) {
			this.$toasted.show(newVal.text, {
				type: newVal.type,
			});
		},
	},
	created() {
		this.fetchProfile().then(this.fetchprofileData);
	},
	validations: {
		profileData: {
			name: {
				minLength: minLength(5),
				maxLength: maxLength(100),
			},
			lastName: {
				minLength: minLength(3),
				maxLength: maxLength(100),
			},
		},
		securityData: {
			newPassword: {
				minLength: minLength(5),
				maxLength: maxLength(100),
				required,
			},
		},
	},
	methods: {
		fetchprofileData() {
			this.profileData = Object.assign(this.profileData, this.profile);
		},
		setAvatarObject(file) {
			const avatar = new FormData();
			avatar.append('avatar', file);
			return avatar;
		},
		clearUpload() {
			this.$refs['avatar'].reset();
		},
		submitForm() {
			this.$v.profileData.$touch();
			if (this.$v.profileData.$invalid) {
				this.profileErrors = true;
			} else {
				this.profileErrors = false;
				this.updateProfile(this.profileData).then(this.clearUpload);
			}
		},
		submitNewPassword() {
			this.$v.securityData.$touch();
			if (this.$v.securityData.$invalid) {
				this.securityErrors = true;
			} else {
				this.securityErrors = false;
				this.updatePassword(this.securityData.newPassword);
			}
		},
		onFileUpload(e) {
			const avatar = this.setAvatarObject(e.target.files[0]);
			this.updateAvatar(avatar).then(this.clearUpload);
		},
		...mapActions({
			fetchProfile: 'User/fetchProfile',
			updateProfile: 'User/updateProfile',
			updateAvatar: 'User/updateAvatar',
			updatePassword: 'User/updatePassword',
		}),
	},
};
</script>
