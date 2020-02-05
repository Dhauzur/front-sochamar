<template lang="html">
	<b-container>
		<b-row class="justify-content-center">
			<b-col md="5">
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
									v-model.trim="loginData.email"
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
						<p>
							¿No tienes una cuenta?
							<router-link to="/register">Registrate!</router-link>
						</p>
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

<style lang="css" scoped>
.test {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
</style>
