<template lang="html">
	<v-container class="fill-height" fluid>
		<v-row align="center" justify="center">
			<v-col v-if="!passwordRecover" cols="12" sm="6" md="4" lg="3" class="pb-5">
				<Logo style="max-height: 30vh;" />
				<v-form>
					<v-text-field
						id="email-input"
						v-model.trim="loginData.email"
						label="Correo electronico"
						name="login"
						prepend-icon="mdi-account"
						type="text"
						required
					/>

					<v-text-field
						id="password-input"
						v-model.trim="loginData.password"
						:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
						label="Contraseña"
						name="password"
						prepend-icon="mdi-lock"
						:type="showPassword ? 'text' : 'password'"
						required
						@click:append="showPassword = !showPassword"
					/>
				</v-form>
				<v-btn :loading="loading" block small color="primary" @click="onSubmit">
					Ingresar
				</v-btn>
				<v-spacer /><GoogleButton class="my-3"></GoogleButton><v-spacer />
				¿No tienes una cuenta?
				<v-btn text small to="/register" color="primary">registrate</v-btn>
				<v-btn text small color="primary" @click="controlPasswordRecover(true)">
					¿Olvidaste tu contraseña?
				</v-btn>
			</v-col>
			<v-col v-else cols="12" sm="8" md="4" lg="3">
				<PasswordRecover
					:disable-password-recover="controlPasswordRecover"
				></PasswordRecover>
			</v-col>
			<v-col cols="12" style="min-height: 10vh;"></v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import PasswordRecover from '../components/auth/PasswordRecover';
import GoogleButton from '../components/auth/GoogleButton';
import Logo from '@/assets/logo';

export default {
	components: {
		PasswordRecover,
		GoogleButton,
		Logo,
	},
	data() {
		return {
			showPassword: false,
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
		onSubmit() {
			this.login(this.loginData);
		},
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
