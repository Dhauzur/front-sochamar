<template lang="html">
	<v-container class="fill-height" fluid>
		<v-row align="center" justify="center">
			<v-col v-if="!passwordRecover" cols="12" sm="8" md="4" lg="3">
				<v-card outlined light style="position: relative">
					<!-- reemplazar imagen del logo -->
					<v-img
						src="https://bccic.ca/wp-content/uploads/2016/12/example-logo-660x330.png"
						height="170px"
					></v-img>
					<v-card-subtitle>
						Ingresar
					</v-card-subtitle>
					<v-card-text>
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
								label="Contraseña"
								name="password"
								prepend-icon="mdi-lock"
								type="password"
								required
							/>
						</v-form>
					</v-card-text>
					<v-card-actions>
						<v-btn
							:loading="loading"
							block
							small
							color="primary"
							rounded
							@click="onSubmit"
						>
							Ingresar
						</v-btn>
					</v-card-actions>
					<v-card-actions>
						<v-spacer /><GoogleButton></GoogleButton><v-spacer />
					</v-card-actions>
					<v-card-text>
						¿No tienes una cuenta?
						<v-btn text small to="/register" color="primary">registrate</v-btn>
						<v-btn text small color="primary" @click="controlPasswordRecover(true)">
							¿Olvidaste tu contraseña?
						</v-btn>
					</v-card-text>
				</v-card>
			</v-col>
			<v-col v-else cols="12" sm="8" md="4">
				<PasswordRecover
					:disable-password-recover="controlPasswordRecover"
				></PasswordRecover>
			</v-col>
		</v-row>
	</v-container>
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
