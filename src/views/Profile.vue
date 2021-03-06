<template>
	<v-container fluid>
		<v-row justify="center">
			<v-col cols="12">
				<v-card class="mx-auto" max-width="600">
					<v-card-title>
						<v-tooltip bottom>
							<template v-slot:activator="{ on }">
								<label for="upload" class="pointer" v-on="on">
									<avatar
										:name="profile.name"
										:last-name="profile.lastName"
										:url="profile.img"
										:loading="loadingUpload"
									/>
								</label>
								<v-file-input
									id="upload"
									ref="avatar"
									v-model="avatar"
									class="d-none"
									dense
									accept="image/jpeg, image/png, image/gif, image/jpg"
									placeholder="Agrega una imagen"
									drop-placeholder="Arrastrar aqui..."
									@change="onFileUpload"
								></v-file-input>
							</template>
							<span>Sube o cambia la imagen</span>
						</v-tooltip>
						<v-card-title primary-title>
							{{ `${profile.name} ${profile.lastName && profile.lastName}` }}
						</v-card-title>
					</v-card-title>
					<v-card-text v-if="profile.analyst" class="text-left pt-0 mt-0">
						Analista
					</v-card-text>
					<v-card-text class="pb-0 mb-0">
						<form>
							<v-text-field
								id="firstname"
								v-model.trim="profileData.name"
								dense
								outlined
								label="Nombre"
								:error-messages="nameErrors"
								@input="$v.profileData.name.$touch()"
								@blur="$v.profileData.name.$touch()"
							></v-text-field>
							<v-text-field
								id="lastname"
								v-model.trim="profileData.lastName"
								dense
								outlined
								label="Apellido"
								:error-messages="lastnameErrors"
								@input="$v.profileData.lastName.$touch()"
								@blur="$v.profileData.lastName.$touch()"
							></v-text-field>
						</form>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn :loading="loading" text color="primary" @click="submitForm">
							Actualizar
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
			<v-col cols="12">
				<v-card class="mx-auto" max-width="600">
					<v-card-title class="text-left">
						Seguridad
					</v-card-title>
					<v-card-text class="pb-0 mb-0">
						<v-text-field
							id="new-password"
							v-model.trim="securityData.newPassword"
							type="password"
							dense
							outlined
							label="Nueva contraseña"
							:error-messages="lastnameErrors"
							@input="$v.securityData.newPassword.$touch()"
							@blur="$v.securityData.newPassword.$touch()"
						></v-text-field>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn :disabled="loading" text color="primary" @click="submitNewPassword"
							>Actualizar contraseña
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { validationMixin } from 'vuelidate';
import Avatar from '@/components/ui/Avatar';
import { minLength, maxLength, required } from 'vuelidate/lib/validators';

export default {
	components: {
		Avatar,
	},
	mixins: [validationMixin],
	data() {
		return {
			avatar: null,
			loadingUpload: false,
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
		lastnameErrors() {
			const errors = [];
			if (!this.$v.profileData.lastName.$dirty) return errors;
			!this.$v.profileData.lastName.minLength && errors.push('Minimo 3 Caracteres');
			!this.$v.profileData.lastName.maxLength && errors.push('Maximo 100 Caracteres');
			return errors;
		},
		nameErrors() {
			const errors = [];
			if (!this.$v.profileData.name.$dirty) return errors;
			!this.$v.profileData.name.minLength && errors.push('Minimo 5 Caracteres');
			!this.$v.profileData.name.maxLength && errors.push('Maximo 100 Caracteres');
			return errors;
		},
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
			this.avatar = null;
			this.loadingUpload = false;
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
		onFileUpload() {
			this.loadingUpload = true;
			const avatar = this.setAvatarObject(this.avatar);
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
