<template lang="html">
	<b-container>
		<b-row class="justify-content-center">
			<b-col md="5">
				<b-card>
					<b-card-title>Ingreso</b-card-title>
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
									v-model.trim="loginData.password"
									type="password"
									required
									placeholder="Ingresa la contraseña"
								></b-form-input>
							</b-form-group>
							<!--SUBMIT-->
							<b-button type="submit" variant="primary"> Ingresar</b-button>
						</b-form>
					</b-card-body>
					<b-card-footer>
						<p>
							¿No tienes una cuenta?
							<router-link to="/register">registrate</router-link>
						</p>
						<a href="#">¿Olvidaste tu contraseña?</a>
					</b-card-footer>
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
			loginData: {
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
