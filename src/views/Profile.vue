<template>
	<div>
		<template v-if="loadingInitial">
			<v-sheet elevation="24">
				<v-skeleton-loader
					type="list-item-two-line, list-item-three-line, list-item-three-line,  card-heading"
				></v-skeleton-loader>
			</v-sheet>
		</template>
		<template v-else>
			<v-row v-if="isAdmin" justify="center">
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
						<v-card-text class="text-left">
							{{ profile.role }}
						</v-card-text>
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
							<v-btn :loading="loading" color="primary" @click="submitForm">
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
								:error-messages="newPasswordErrors"
								@input="$v.securityData.newPassword.$touch()"
								@blur="$v.securityData.newPassword.$touch()"
							></v-text-field>
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn :disabled="loading" color="primary" @click="submitNewPassword"
								>Actualizar contraseña
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-col>
			</v-row>
			<v-row v-if="isPerson">
				<v-app-bar dense>
					<v-tabs v-model="tab" color="primary" centered>
						<v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
					</v-tabs>
				</v-app-bar>
				<v-container>
					<v-row justify="center">
						<v-col v-if="tab === 0" cols="12" lg="8" xl="6">
							<Form
								:edit-mode="Boolean(person)"
								:selected="userSelected"
								:update-user="updateUser"
								:toast="toast"
							/>
						</v-col>
						<v-col v-if="tab === 1" cols="12" class="p-0">
							<v-row justify="center">
								<v-col cols="12" sm="8" md="6" xl="5">
									<v-card outlined>
										<template v-if="hasIdCompany">
											<v-card-text>
												Actualmente perteneces a un equipo
												<v-btn
													text
													color="error"
													small
													@click="unsubscribe"
												>
													Salir del equipo
												</v-btn>
											</v-card-text>
											<v-card-text v-if="hasIdCompany" class="overline">
												*Solo puedes unirte a un equipo
											</v-card-text>
										</template>
										<v-divider v-if="hasIdCompany && hasRequest" class="mx-4" />
										<v-card-text v-if="hasRequest">
											<div v-for="(item, i) in person.request" :key="i">
												<requests
													:item="item"
													:person="person"
													:toast="toast"
													:update-person="updatePerson"
												/>
											</div>
										</v-card-text>
										<v-card-text
											v-if="!hasRequest && !hasIdCompany"
											class="overline"
										>
											*Ahora no tienes solicitudes para unirte a un equipo
										</v-card-text>
									</v-card>
								</v-col>
								<v-col v-if="hasIdCompany" cols="12" sm="8" md="4" xl="3">
									<v-card outlined height="calc(100vh - 140px)">
										<messages :id="person._id" :sender="person.firstName" />
									</v-card>
								</v-col>
							</v-row>
						</v-col>
					</v-row>
				</v-container>
			</v-row>
		</template>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { validationMixin } from 'vuelidate';
import Avatar from '@/components/ui/Avatar';
import { minLength, maxLength, required } from 'vuelidate/lib/validators';
import { getPerson, createPerson, pathRequest } from '@/service/persons';

export default {
	components: {
		Avatar,
		Form: () => import('@/components/persons/Form'),
		Messages: () => import('@/components/persons/Messages'),
		Requests: () => import('@/components/persons/Requests'),
	},
	mixins: [validationMixin],
	data() {
		return {
			tab: null,
			person: null,
			loadingInitial: true,
			selected: 0,
			items: ['Perfil', 'Mi equipo', 'Leer politicas'],
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
		hasRequest() {
			return (
				Boolean(this.person) &&
				Array.isArray(this.person.request) &&
				this.person.request.length
			);
		},
		hasIdCompany() {
			return this.person.idCompany;
		},
		avatarMessage() {
			return this.profileData.img.length > 0 ? 'Cambiar avatar' : 'Subir avatar';
		},
		isAdmin() {
			return this.profile.role === 'admin';
		},
		isPerson() {
			return this.profile.role === 'person';
		},
		userSelected() {
			return this.person
				? this.person
				: { firstName: this.profile.name, email: this.profile.email };
		},
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
		newPasswordErrors() {
			const errors = [];
			if (!this.$v.securityData.newPassword.$dirty) return errors;
			!this.$v.securityData.newPassword.minLength && errors.push('Minimo 5 Caracteres');
			!this.$v.securityData.newPassword.maxLength && errors.push('Maximo 100 Caracteres');
			return errors;
		},
		...mapGetters({
			profile: 'User/profile',
			message: 'User/message',
			loading: 'User/loading',
		}),
	},
	watch: {
		message(newVal) {
			if (this.isAdmin) {
				this.toast(newVal.type, newVal.text);
			}
		},
	},
	created() {
		this.initialFetch();
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
		async initialFetch() {
			const profile = await this.fetchProfile();
			if (profile.role === 'person')
				if (profile.idPerson) {
					this.person = await getPerson(profile.idPerson);
				} else {
					createPerson({ firstName: profile.name, email: profile.email }).then(res =>
						this.updateUser(res)
					);
				}
			this.profileData = profile;
			this.loadingInitial = !this.loadingInitial;
		},
		updatePerson(data) {
			this.person = data;
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
		unsubscribe() {
			let data = { email: this.person.email, unsubscribe: true };
			confirm('Estas seguro de que quieres salirte del equipo?') &&
				pathRequest(data).then(response => (this.person = response.person));
		},
		updateUser(person) {
			let data = {
				...this.profile,
				idPerson: person._id,
				name: person.firstName,
				lastName: person.lastName,
				img: person.avatar,
			};
			delete data._id;
			this.updateProfile(data).then(() => (this.person = person));
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
		toast(type, text) {
			this.$toasted.show(text, {
				type,
			});
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
