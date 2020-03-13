<template lang="html">
	<v-container class="fill-height" fluid>
		<v-row align="center" justify="center">
			<v-col cols="12" sm="8" md="4">
				<v-card outlined>
					<v-toolbar color="secondary" dark flat>
						<v-toolbar-title>Registrate</v-toolbar-title>
					</v-toolbar>
					<v-card-text>
						<v-form>
							<!-- name -->
							<div>
								<v-text-field
									id="name-input"
									v-model.trim="formData.name"
									placeholder="Ej: Mauro Pérez"
									label="Nombre"
									required
								/>
								<div v-if="$v.formData.name.$dirty">
									<small v-if="!$v.formData.name.required" class="red--text">
										Campo requerido
									</small>
									<small v-if="!$v.formData.name.minLength" class="red--text">
										Minimo 3 caracteres
									</small>
									<small v-if="!$v.formData.name.maxLength" class="red--text">
										Maximo 200 caracteres
									</small>
								</div>
							</div>
							<!-- email -->
							<div>
								<v-text-field
									id="email-input"
									v-model.trim="formData.email"
									type="email"
									placeholder="Ej: mauro@prueba.cl"
									label="Correo Electronico"
									required
								/>
								<div v-if="$v.formData.email.$dirty">
									<small v-if="!$v.formData.email.required" class="text-danger">
										Campo requerido
									</small>
								</div>
							</div>
							<!-- password -->
							<div>
								<v-text-field
									id="email-password"
									v-model.trim="formData.password"
									type="password"
									label="Contraseña"
									required
								/>
								<div v-if="$v.formData.password.$dirty">
									<small
										v-if="!$v.formData.password.required"
										class="text-danger"
									>
										Campo requerido
									</small>
									<small
										v-if="!$v.formData.password.minLength"
										class="text-danger"
									>
										Minimo 3 caracteres
									</small>
									<small
										v-if="!$v.formData.password.maxLength"
										class="text-danger"
									>
										Maximo 100 caracteres
									</small>
								</div>
							</div>
							<v-checkbox v-model="formData.analyst" label="Analista"></v-checkbox>
						</v-form>
					</v-card-text>
					<v-card-actions>
						<v-btn
							:loading="loading"
							block
							color="primary"
							rounded
							small
							@click="submitForm"
						>
							Finalizar Registro
						</v-btn>
					</v-card-actions>
					<v-card-text>
						¿Ya tienes una cuenta?
						<v-btn block text color="primary" small to="/login">
							Ingresa ya
						</v-btn>
					</v-card-text>
					<small v-if="errors" class="mt-2 d-block text-danger">
						Debe rellenar el formulario correctamente
					</small>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
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
				analyst: false,
			},
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
