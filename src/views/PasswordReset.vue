<template lang="html">
	<b-container>
		<b-row id="nav" class="justify-content-center">
			<b-col md="8" lg="6" class="background-module pb-3 px-4">
				<h3 class="my-4">Restaurar contraseña</h3>
				<b-form @submit.prevent="sendNewPassword">
					<!--NUEVA CONTRASEÑA-->
					<b-form-group
						id="input-group-1"
						label="Nueva Contraseña:"
						label-for="email-input"
					>
						<b-form-input
							id="email-input"
							v-model.trim="formData.newPassword"
							type="password"
							placeholder="Ingresa la contraseña"
						></b-form-input>
						<div v-if="$v.formData.newPassword.$dirty">
							<small v-if="!$v.formData.newPassword.required" class="text-danger">
								Campo requerido
							</small>
							<small v-if="!$v.formData.newPassword.minLength" class="text-danger">
								Minimo 5 caracteres
							</small>
							<small v-if="!$v.formData.newPassword.maxLength" class="text-danger">
								Minimo 100 caracteres
							</small>
						</div>
					</b-form-group>
					<!--REPETIR CONTRASEÑA-->
					<b-form-group
						id="input-group-2"
						label="Ingresala nuevamente:"
						label-for="email-input"
					>
						<b-form-input
							id="email-input"
							v-model.trim="formData.repeatedPassword"
							type="password"
							placeholder="Ingresa la contraseña nuevamente"
						></b-form-input>
						<div v-if="$v.formData.repeatedPassword.$dirty">
							<small
								v-if="!$v.formData.repeatedPassword.sameAsPassword"
								class="text-danger"
							>
								Las contraseñas no son iguales
							</small>
						</div>
					</b-form-group>
					<!--SUBMIT-->
					<b-button v-if="!loading" class="mt-2" type="submit" variant="primary"
						>Actualizar</b-button
					>
					<small v-if="errors" class="mt-2 d-block text-danger">
						Debe rellenar el formulario correctamente
					</small>
				</b-form>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength, sameAs } from 'vuelidate/lib/validators';

export default {
	mixins: [validationMixin],
	data() {
		return {
			formData: {
				newPassword: '',
				repeatedPassword: '',
			},
			temporalJwt: '',
			errors: false,
		};
	},
	computed: {
		...mapGetters({
			message: 'Auth/message',
			loading: 'Auth/loading',
		}),
	},
	validations: {
		formData: {
			newPassword: {
				required,
				minLength: minLength(5),
				maxLength: maxLength(100),
			},
			repeatedPassword: {
				sameAsPassword: sameAs('newPassword'),
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
	created() {
		this.temporalJwt = this.$route.query.token;
		this.deleteQueryFromRoute();
	},
	methods: {
		sendNewPassword() {
			this.$v.$touch();
			if (this.$v.$invalid) {
				this.errors = true;
			} else {
				const recoverData = {
					token: this.temporalJwt,
					password: this.formData.newPassword,
				};
				this.updatePassword(recoverData);
			}
		},
		deleteQueryFromRoute() {
			this.$router.replace({ query: null });
		},
		...mapActions({
			updatePassword: 'Auth/updatePassword',
		}),
	},
};
</script>

<style lang="css" scoped></style>
