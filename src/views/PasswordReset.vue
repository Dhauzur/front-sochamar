<template>
	<v-container class="fill-height" fluid>
		<v-row align="center" justify="center">
			<v-col cols="12" sm="8" md="4" lg="3">
				<h3 class="title my-4">Restaurar contraseña</h3>
				<!-- password -->
				<v-text-field
					id="password-input"
					v-model.trim="$v.formData.newPassword.$model"
					type="password"
					dense
					outlined
					placeholder="Nueva contraseña"
					:error-messages="newPasswordErrors"
					@input="$v.formData.newPassword.$touch()"
					@blur="$v.formData.newPassword.$touch()"
				></v-text-field>
				<!-- repet password -->
				<v-text-field
					id="email-input"
					v-model.trim="$v.formData.repeatedPassword.$model"
					type="password"
					dense
					outlined
					placeholder="Repita la contraseña"
					:error-messages="repetPasswordErrors"
					@input="$v.formData.repeatedPassword.$touch()"
					@blur="$v.formData.repeatedPassword.$touch()"
				></v-text-field>
				<!-- submit -->
				<v-btn
					:disabled="loading"
					:loading="loading"
					block
					color="primary"
					class="mt-2"
					type="submit"
					variant="primary"
					@click="onSubmit"
				>
					Actualizar
				</v-btn>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength, sameAs } from 'vuelidate/lib/validators';
import { updatePassword } from '@/service/auth';

export default {
	mixins: [validationMixin],
	data() {
		return {
			loading: false,
			formData: {
				newPassword: '',
				repeatedPassword: '',
			},
			temporalJwt: '',
		};
	},
	computed: {
		newPasswordErrors() {
			const errors = [];
			if (!this.$v.formData.newPassword.$dirty) return errors;
			!this.$v.formData.newPassword.required && errors.push('Campo querido');
			!this.$v.formData.newPassword.maxLength && errors.push('Maximo 100 caracteres');
			!this.$v.formData.newPassword.minLength && errors.push('Minimo 5 caracteres');
			return errors;
		},
		repetPasswordErrors() {
			const errors = [];
			if (!this.$v.formData.repeatedPassword.$dirty) return errors;
			!this.$v.formData.repeatedPassword.required && errors.push('Campo querido');
			!this.$v.formData.repeatedPassword.sameAsPassword &&
				errors.push('Las contraseñas no son iguales');
			return errors;
		},
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
	created() {
		this.temporalJwt = this.$route.query.token;
		this.deleteQueryFromRoute();
	},
	methods: {
		async onSubmit() {
			this.$v.$touch();
			if (!this.$v.$invalid) {
				try {
					this.loading = !this.loading;
					await updatePassword(this.temporalJwt, this.formData.newPassword);
					this.$toasted.show('Contraseña cambiada con exito', {
						type: 'success',
					});
					this.$router.replace({ name: 'login' });
				} catch (error) {
					this.$toasted.show('Expiro el tiempo para cambiar la contraseña', {
						type: 'error',
					});
				}
				this.loading = !this.loading;
			}
		},
		deleteQueryFromRoute() {
			this.$router.replace({ query: null });
		},
	},
};
</script>
