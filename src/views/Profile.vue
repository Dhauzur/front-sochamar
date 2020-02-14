<template>
	<div>
		{{ profile }}
		<b-form @submit.prevent="submitForm">
			<b-row>
				<!-- avatar -->
				<b-col>
					<label for="upload">
						<b-img
							class="pointer"
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
					></b-form-file>
				</b-col>
				<b-col cols="12">
					<label for="upload" class="pointer text-secondary">{{
						typeof profileForm.img === 'string' ? 'Cambiar avatar' : 'Subir avatar'
					}}</label>
				</b-col>
				<!-- name -->
				<b-input id="firstName" v-model.trim="profileForm.name" />
				<div v-if="$v.profileForm.name.$dirty">
					<small v-if="!$v.profileForm.name.minLength" class="text-danger">
						Minimo 5 Caracteres
					</small>
					<small v-if="!$v.profileForm.name.maxLength" class="text-danger">
						Maximo 100 Caracteres
					</small>
				</div>
				<!-- lastName -->
				<b-input id="lastName" v-model.trim="profileForm.lastName"></b-input>
				<div v-if="$v.profileForm.lastName.$dirty">
					<small v-if="!$v.profileForm.lastName.minLength" class="text-danger">
						Minimo 5 Caracteres
					</small>
					<small v-if="!$v.profileForm.lastName.maxLength" class="text-danger">
						Maximo 100 Caracteres
					</small>
				</div>
			</b-row>
			<!--Submit-->
			<b-row>
				<b-col class="mt-4">
					<b-button block class="btn btn-primary d-block" type="submit"
						>Guardar
					</b-button>
				</b-col>
			</b-row>
		</b-form>
	</div>
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
			},
		};
	},
	computed: {
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
		submitForm() {
			this.$v.$touch();
			if (this.$v.$invalid) {
				console.log('erroresss');
			} else {
				this.form.set('name', this.profileForm.name.toLowerCase());
				this.form.set('lastName', this.profileForm.lastName.toLowerCase());
				this.updateProfile(this.form).then(this.fetchProfileForm);
			}
		},
		...mapActions({
			fetchProfile: 'User/fetchProfile',
			updateProfile: 'User/updateProfile',
		}),
	},
};
</script>

<style scoped></style>
