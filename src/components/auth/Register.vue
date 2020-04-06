<template>
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
			hide-details
			:error-messages="passwordErrors"
			@input="$v.formData.password.$touch()"
			@blur="$v.formData.password.$touch()"
		/>
		<v-radio-group
			v-model="$v.formData.role.$model"
			hide-details
			row
			:error-messages="roleErrors"
			@input="$v.formData.role.$touch()"
			@blur="$v.formData.role.$touch()"
		>
			<v-radio label="Administrador" value="admin"></v-radio>
			<v-radio label="Persona" value="person"></v-radio>
		</v-radio-group>
		<div>
			<p class="error--text text-left caption ma-2">{{ roleErrors[0] }}</p>
		</div>
		<v-switch v-model="formData.analyst" color="primary" label="Analista"></v-switch>
		<v-btn :loading="loading" block color="primary" small @click="onSubmit">
			Finalizar Registro
		</v-btn>
	</v-form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { register } from '@/service/auth';
import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators';

export default {
	mixins: [validationMixin],
	data() {
		return {
			loading: false,
			formData: {
				name: '',
				email: '',
				password: '',
				role: '',
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
			!this.$v.formData.name.required && errors.push('El nombre es querido');
			!this.$v.formData.name.maxLength && errors.push('Maximo 200 caracteres');
			!this.$v.formData.name.minLength && errors.push('Minimo 3 caracteres');
			return errors;
		},
		roleErrors() {
			const errors = [];
			if (!this.$v.formData.role.$dirty) return errors;
			!this.$v.formData.role.required && errors.push('Por favor seleccione');
			return errors;
		},
		passwordErrors() {
			const errors = [];
			if (!this.$v.formData.password.$dirty) return errors;
			!this.$v.formData.password.required && errors.push('La contraseña es querida');
			!this.$v.formData.password.maxLength && errors.push('Maximo 200 caracteres');
			!this.$v.formData.password.minLength && errors.push('Minimo 3 caracteres');
			return errors;
		},
		...mapGetters({
			message: 'Auth/message',
		}),
	},
	validations: {
		formData: {
			name: {
				required,
				minLength: minLength(3),
				maxLength: maxLength(200),
			},
			role: { required },
			email: { required, email },
			password: {
				required,
				minLength: minLength(5),
				maxLength: maxLength(100),
			},
		},
	},
	methods: {
		async onSubmit() {
			this.$v.$touch();
			if (!this.$v.$invalid) {
				try {
					this.loading = !this.loading;
					await register(this.formData);
					const profile = await this.fetchProfile();
					profile.role === 'admin'
						? this.$router.replace({ name: 'home' })
						: this.$router.replace({ name: 'profile' });
				} catch (error) {
					this.$toasted.show(error.message, {
						type: 'error',
					});
				}
				this.loading = !this.loading;
			}
		},
		...mapActions({
			fetchProfile: 'User/fetchProfile',
		}),
	},
};
</script>
