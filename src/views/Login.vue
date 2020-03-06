<template lang="html">
	<b-container>
		<b-row id="nav" class="justify-content-center">
			<b-col v-if="!passwordRecover" md="8" lg="6" class="background-module pb-3 px-4">
				<h3 class="my-4">Ingresa a Sochamar</h3>
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
					<b-form-group id="input-group-2" label="Contraseña:" label-for="password-input">
						<b-form-input
							id="password-input"
							v-model.trim="loginData.password"
							type="password"
							required
							placeholder="Ingresa la contraseña"
						></b-form-input>
					</b-form-group>
					<!--SUBMIT-->
					<b-button :disabled="loading" class="mt-2" type="submit" variant="primary">
						Ingresar
						<b-spinner v-if="loading" small type="grow"></b-spinner>
					</b-button>
				</b-form>
				<GoogleButton></GoogleButton>
				<p>
					¿No tienes una cuenta?
					<router-link to="/register">registrate</router-link>
				</p>
				<a href="#" @click="controlPasswordRecover(true)">¿Olvidaste tu contraseña?</a>
			</b-col>
			<b-col v-else md="8" lg="6" class="background-module pb-3 px-4">
				<PasswordRecover
					:disable-password-recover="controlPasswordRecover"
				></PasswordRecover>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import PasswordRecover from '../components/auth/PasswordRecover';
import GoogleButton from '../components/auth/GoogleButton';

export default {
	components: {
		PasswordRecover,
		GoogleButton,
	},
	data() {
		return {
			loginData: {
				email: '',
				password: '',
			},
			passwordRecover: false,
		};
	},
	computed: {
		...mapGetters({
			message: 'Auth/message',
			loading: 'Auth/loading',
		}),
	},
	watch: {
		message(newVal) {
			this.toastedMessage(newVal);
		},
	},
	methods: {
		toastedMessage(newVal) {
			this.$toasted.show(newVal.text, {
				type: newVal.type,
			});
		},
		controlPasswordRecover(value) {
			this.passwordRecover = value;
		},
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
