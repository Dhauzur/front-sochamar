<template>
	<b-container>
		<b-row id="nav" class="justify-content-center">
			<b-col md="8" lg="6" class="background-module pb-3 px-4">
				<h3 class="my-4">Mi perfil</h3>
				<b-form @submit.prevent="submitForm">
					<b-row>
						<!-- avatar -->
						<b-col>
							<label for="upload">
								<b-img
									class="pointer"
									for
									v-bind="mainProps"
									rounded="circle"
									alt="avatar"
									:src="profileForm.img"
								></b-img>
							</label>
							<b-form-file
								id="upload"
								ref="avatar"
								class="d-none"
								accept="image/jpeg, image/png, image/gif, image/jpg"
								:placeholder="'Agrega una imagen'"
								drop-placeholder="Arrastrar aqui..."
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
								<b-form-input id="firstName" v-model.trim="profileForm.name" />
								<div v-if="$v.profileForm.name.$dirty">
									<small
										v-if="!$v.profileForm.name.minLength"
										class="text-danger"
									>
										Minimo 5 Caracteres
									</small>
									<small
										v-if="!$v.profileForm.name.maxLength"
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
								<b-form-input id="lastName" v-model.trim="profileForm.lastName" />
								<div v-if="$v.profileForm.lastName.$dirty">
									<small
										v-if="!$v.profileForm.lastName.minLength"
										class="text-danger"
									>
										Minimo 5 Caracteres
									</small>
									<small
										v-if="!$v.profileForm.lastName.maxLength"
										class="text-danger"
									>
										Maximo 100 Caracteres
									</small>
								</div>
							</b-form-group>
						</b-col>
						<!-- Observer -->
						<b-col cols="4">
							<h6>Observador: {{ isObserver }}</h6>
						</b-col>
					</b-row>
					<!--Submit-->
					<b-col>
						<b-button :disabled="loading" type="submit" variant="primary"
							>Guardar
						</b-button>
					</b-col>
				</b-form>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { validationMixin } from 'vuelidate';
import { minLength, maxLength } from 'vuelidate/lib/validators';

export default {
	mixins: [validationMixin],
	data() {
		return {
			form: new FormData(),
			profileForm: {
				name: '',
				lastName: '',
				img: '',
				observer: false,
				file: null,
			},
			mainProps: { blank: false, blankColor: '#777', width: 75, height: 75, class: 'm1' },
		};
	},
	computed: {
		isObserver() {
			return this.profileForm.observer ? 'Si' : 'No';
		},
		avatarMessage() {
			return this.profileForm.img.length > 0 ? 'Cambiar avatar' : 'Subir avatar';
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
		this.fetchProfile().then(this.fetchProfileForm);
	},
	validations: {
		profileForm: {
			name: {
				minLength: minLength(5),
				maxLength: maxLength(100),
			},
			lastName: {
				minLength: minLength(5),
				maxLength: maxLength(100),
			},
		},
	},
	methods: {
		fetchProfileForm() {
			this.profileForm = Object.assign(this.profileForm, this.profile);
		},
		setFormObject() {
			this.form.append('avatar', this.profileForm.file);
			this.form.set('name', this.profileForm.name.toLowerCase());
			this.form.set('lastName', this.profileForm.lastName.toLowerCase());
		},
		clearUpload() {
			this.$refs['avatar'].reset();
			this.form = new FormData();
		},
		submitForm() {
			this.$v.$touch();
			if (!this.$v.$invalid) {
				this.setFormObject();
				this.updateProfile(this.form)
					.then(this.fetchProfileForm)
					.then(this.clearUpload);
			}
		},
		onFileUpload(e) {
			this.profileForm.file = e.target.files[0];
		},
		...mapActions({
			fetchProfile: 'User/fetchProfile',
			updateProfile: 'User/updateProfile',
		}),
	},
};
</script>

<style scoped></style>
