<template lang="html">
	<b-container>
		<b-row id="nav" class="justify-content-center">
			<b-col md="8" lg="6" class="background-module pb-3 px-4">
				<h3 class="my-4">Registrate</h3>
				<b-form @submit.prevent="submitForm">
					<!--Name-->
					<b-form-group id="input-group-1" label="Nombre" label-for="name-input">
						<b-form-input
							id="name-input"
							v-model.trim="formData.name"
							placeholder="Ej: Mauro Pérez"
						></b-form-input>
						<div v-if="$v.formData.name.$dirty">
							<small v-if="!$v.formData.name.required" class="text-danger">
								Campo requerido
							</small>
							<small v-if="!$v.formData.name.minLength" class="text-danger">
								Minimo 3 caracteres
							</small>
							<small v-if="!$v.formData.name.maxLength" class="text-danger">
								Minimo 200 caracteres
							</small>
						</div>
					</b-form-group>

					<!--EMAIL-->
					<b-form-group
						id="input-group-2"
						label="Correo electronico"
						label-for="email-input"
					>
						<b-form-input
							id="email-input"
							v-model.trim="formData.email"
							type="email"
							placeholder="Ej: mauro@prueba.cl"
						></b-form-input>
						<div v-if="$v.formData.email.$dirty">
							<small v-if="!$v.formData.email.required" class="text-danger">
								Campo requerido
							</small>
						</div>
					</b-form-group>
					<!--PASSWORD-->
					<b-form-group id="input-group-3" label="Contraseña" label-for="password-input">
						<b-form-input
							id="password-input"
							v-model.trim="formData.password"
							type="password"
							placeholder="Ej: 123456"
						></b-form-input>
						<div v-if="$v.formData.password.$dirty">
							<small v-if="!$v.formData.password.required" class="text-danger">
								Campo requerido
							</small>
							<small v-if="!$v.formData.password.minLength" class="text-danger">
								Minimo 5 caracteres
							</small>
							<small v-if="!$v.formData.password.maxLength" class="text-danger">
								Minimo 100 caracteres
							</small>
						</div>
					</b-form-group>
					<!--SUBMIT-->
					<b-button type="submit" variant="primary"> Finalizar registro</b-button>
					<small v-if="errors" class="mt-2 d-block text-danger">
						Debe rellenar el formulario correctamente
					</small>
				</b-form>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators';

export default {
	mixins: [validationMixin],
	data() {
		return {
			formData: {
				name: '',
				email: '',
				password: '',
			},
			errors: false,
		};
	},
	computed: {
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
		submitForm() {
			this.$v.$touch();
			if (this.$v.$invalid) {
				this.errors = true;
			} else {
				this.register(this.formData);
			}
		},
		...mapActions({
			register: 'Auth/register',
		}),
	},
};
</script>

<style lang="css" scoped></style>
