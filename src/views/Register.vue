<template lang="html">
	<b-container>
		<b-row class="justify-content-center">
			<b-col md="5">
				<b-card>
					<b-card-title>Registro</b-card-title>
					<b-card-body>
						<b-form @submit.prevent="register(formData)">
							<!--Name-->
							<b-form-group id="input-group-1" label="Nombre:" label-for="name-input">
								<b-form-input
									id="name-input"
									v-model.trim="formData.name"
									required
									placeholder="Ingresa tu nombre"
								></b-form-input>
							</b-form-group>
							<!--EMAIL-->
							<b-form-group
								id="input-group-2"
								label="Correo electronico:"
								label-for="email-input"
							>
								<b-form-input
									id="email-input"
									v-model.trim="formData.email"
									type="email"
									required
									placeholder="Ingresa el correo"
								></b-form-input>
							</b-form-group>
							<!--PASSWORD-->
							<b-form-group
								id="input-group-3"
								label="Contraseña:"
								label-for="password-input"
							>
								<b-form-input
									id="email-input"
									v-model="formData.password"
									type="password"
									required
									placeholder="Ingresa la contraseña"
								></b-form-input>
							</b-form-group>
							<!--SUBMIT-->
							<b-button type="submit" variant="primary"> Registrar</b-button>
						</b-form>
					</b-card-body>
				</b-card>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
	data() {
		return {
			formData: {
				name: '',
				email: '',
				password: '',
			},
		};
	},
	computed: {
		...mapGetters({
			message: 'Auth/message',
		}),
	},
	watch: {
		message(newVal) {
			this.$toasted.show(newVal.text, {
				type: newVal.type,
			});
		},
	},
	methods: {
		...mapActions({
			register: 'Auth/register',
		}),
	},
};
</script>

<style lang="css" scoped></style>
