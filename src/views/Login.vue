<template lang="html">
	<b-container class="bg-danger">
		<b-row>
			<b-col md="9" class="bg-info">
				<b-card>
					<b-card-title>Ingresa!!</b-card-title>
					<b-card-body>
						<b-form @submit.prevent="login(loginData)">
							<!--EMAIL-->
							<b-form-group
								id="input-group-1"
								label="Correo electronico:"
								label-for="email-input"
							>
								<b-form-input
									id="email-input"
									v-model="loginData.email"
									type="email"
									required
									placeholder="Ingresa el correo"
								></b-form-input>
							</b-form-group>
							<!--PASSWORD-->
							<b-form-group
								id="input-group-2"
								label="Contraseña:"
								label-for="password-input"
							>
								<b-form-input
									id="email-input"
									v-model="loginData.password"
									type="password"
									required
									placeholder="Ingresa la contraseña"
								></b-form-input>
							</b-form-group>
							<!--SUBMIT-->
							<b-button type="submit" variant="primary"> Ingresa!</b-button>
						</b-form>
					</b-card-body>
					<b-card-footer>
						<p>¿No tienes una cuenta? <a href="#">Registrate</a></p>
						<a href="#">¿Olvidaste tu contraseña?</a>
					</b-card-footer>
				</b-card>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import { mapActions } from 'vuex';

export default {
	data() {
		return {
			loginData: {
				email: 'prueba@prueba.cl',
				password: 'asd',
			},
		};
	},
	methods: {
		...mapActions({
			login: 'Auth/login',
		}),
	},
};
</script>

<style lang="css" scoped></style>
