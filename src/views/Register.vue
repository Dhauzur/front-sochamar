<template lang="html">
	<v-container class="fill-height" fluid>
		<v-row align="center" justify="center">
			<v-col cols="12" sm="6" md="4" lg="3">
				<Logo style="max-height: 30vh;" />
				<v-form>
					<!-- name -->
					<v-text-field
						id="name-input"
						v-model.trim="$v.formData.name.$model"
						placeholder="Ej: Mauro Pérez"
						label="Nombre"
						dense
						outlined
						required
						:error-messages="nameErrors"
						@input="$v.formData.name.$touch()"
						@blur="$v.formData.name.$touch()"
					/>
					<!-- email -->
					<v-text-field
						id="email-input"
						v-model.trim="$v.formData.email.$model"
						type="email"
						placeholder="Ej: mauro@prueba.cl"
						label="Correo Electronico"
						dense
						outlined
						required
						:error-messages="emailErrors"
						@input="$v.formData.email.$touch()"
						@blur="$v.formData.email.$touch()"
					/>
					<!-- password -->

					<v-text-field
						id="email-password"
						v-model.trim="$v.formData.password.$model"
						type="password"
						label="Contraseña"
						dense
						outlined
						required
						:error-messages="passwordErrors"
						hide-details
						@input="$v.formData.password.$touch()"
						@blur="$v.formData.password.$touch()"
					/>
					<v-radio-group v-model="formData.role" hide-details row>
						<v-radio label="Administrador" value="admin"></v-radio>
						<v-radio label="Persona" value="person"></v-radio>
					</v-radio-group>
					<v-switch
						v-model="formData.analyst"
						color="primary"
						label="Analista"
					></v-switch>
					<v-btn :loading="loading" block color="primary" small @click="submit">
						Finalizar Registro
					</v-btn>
					<div class="text--secondary pt-2">¿Ya tienes una cuenta?</div>
					<v-btn block text color="primary" small to="/login">
						Ingresa ya
					</v-btn>
				</v-form>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators';
import Logo from '@/assets/logo';

export default {
	components: {
		Logo,
	},
	mixins: [validationMixin],
	data() {
		return {
			formData: {
				name: '',
				email: '',
				password: '',
				role: 'admin',
				analyst: false,
			},
		};
	},
	computed: {
		emailErrors() {
			const errors = [];
			if (!this.$v.formData.email.$dirty) return errors;
			!this.$v.formData.email.required && errors.push('El Correo electronico es querido');
			!this.$v.formData.email.email && errors.push('Escriba un email valido');
			return errors;
		},
		nameErrors() {
			const errors = [];
			if (!this.$v.formData.name.$dirty) return errors;
			!this.$v.formData.name.required && errors.push('El monto es querido');
			!this.$v.formData.name.maxLength && errors.push('Maximo 200 caracteres');
			!this.$v.formData.name.minLength && errors.push('Minimo 3 caracteres');
			return errors;
		},
		passwordErrors() {
			const errors = [];
			if (!this.$v.formData.name.$dirty) return errors;
			!this.$v.formData.password.required && errors.push('La contraseña es querida');
			!this.$v.formData.password.maxLength && errors.push('Maximo 200 caracteres');
			!this.$v.formData.password.minLength && errors.push('Minimo 3 caracteres');
			return errors;
		},
		...mapGetters({
			message: 'Auth/message',
			loading: 'Auth/loading',
			profile: 'User/profile',
		}),
	},
	validations: {
		formData: {
			name: {
				required,
				minLength: minLength(3),
				maxLength: maxLength(200),
			},
			email: { required, email },
			password: {
				required,
				minLength: minLength(5),
				maxLength: maxLength(100),
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
	methods: {
		submit() {
			this.$v.$touch();
			if (!this.$v.$invalid) {
				this.register(this.formData).then(() =>
					this.profile.role === 'admin'
						? this.$router.push('/')
						: this.$router.push('/profile')
				);
			}
		},
		...mapActions({
			register: 'Auth/register',
		}),
	},
};
</script>
