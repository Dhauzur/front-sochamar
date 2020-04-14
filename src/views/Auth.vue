<template>
	<v-row class="fill-height">
		<v-btn
			v-if="step === 1"
			absolute
			top
			right
			text
			small
			depressed
			color="primary"
			@click="step = 3"
		>
			¿No tienes una cuenta? registrate
		</v-btn>
		<v-btn
			v-if="step === 3"
			absolute
			top
			right
			text
			small
			depressed
			color="primary"
			@click="step = 1"
		>
			¿Tienes cuenta? Ingresa ya
		</v-btn>
		<v-col class="bg hidden-sm-and-down">
			<v-container class="fill-height">
				<v-row justify="center" align="center">
					<v-col cols="12">
						<span class="white--text headline mx-auto">PHLAIN</span>
					</v-col>
					<v-col cols="10">
						<v-list-item v-for="(item, i) in checkList" :key="i">
							<v-icon color="success">mdi-check-bold</v-icon>
							<span class="ml-2 white--text subtitle-2">
								{{ item.text }}
							</span>
						</v-list-item>
					</v-col>
				</v-row>
			</v-container>
		</v-col>
		<v-col>
			<v-container class="fill-height">
				<v-row align="center" justify="center">
					<v-col cols="12" sm="8" md="8" lg="7" xl="5">
						<Logo style="max-height: 30vh;" />
						<v-window v-model="step">
							<v-window-item :value="1">
								<v-card flat>
									<v-form>
										<v-card-text>
											<v-text-field
												id="email-input"
												v-model.trim="loginData.email"
												label="Correo electronico"
												name="login"
												prepend-icon="mdi-account"
												dense
												filled
												outlined
												type="text"
												required
											/>
											<v-text-field
												id="password-input"
												v-model.trim="loginData.password"
												:append-icon="
													showPassword ? 'mdi-eye' : 'mdi-eye-off'
												"
												label="Contraseña"
												name="password"
												prepend-icon="mdi-lock"
												dense
												filled
												outlined
												:type="showPassword ? 'text' : 'password'"
												required
												@click:append="showPassword = !showPassword"
											/>
										</v-card-text>
									</v-form>
									<v-card-actions>
										<v-spacer />
										<v-btn
											block
											:loading="loading"
											small
											color="primary"
											@click="onSubmit"
										>
											Ingresar
										</v-btn>
									</v-card-actions>
									<v-card-actions>
										<v-spacer />
										<GoogleButton class="my-3" />
										<v-spacer />
									</v-card-actions>
									<v-card-actions>
										<v-btn block text x-small color="primary" @click="step = 2">
											¿Olvidaste tu contraseña?
										</v-btn>
									</v-card-actions>
								</v-card>
							</v-window-item>
							<v-window-item :value="2">
								<PasswordRecover :back="() => (step = 1)"></PasswordRecover>
							</v-window-item>
							<v-window-item :value="3">
								<Register />
							</v-window-item>
						</v-window>
					</v-col>
				</v-row>
			</v-container>
		</v-col>
	</v-row>
</template>

<script>
import Logo from '@/assets/logo';
import { mapActions } from 'vuex';
import { login } from '@/service/auth';
import GoogleButton from '@/components/auth/GoogleButton';

export default {
	components: {
		PasswordRecover: () => import('@/components/auth/PasswordRecover'),
		Register: () => import('@/components/auth/Register'),
		GoogleButton,
		Logo,
	},
	data() {
		return {
			loading: false,
			showPassword: false,
			loginData: {
				email: '',
				password: '',
			},
			passwordRecover: false,
			step: 1,
			checkList: [
				{
					text:
						'Configuración de turnos: Full time, part time, subidas, bajadas, vacaciones, ausencias, etc',
				},
				{ text: 'Administración de contratos, documentos, checklist de faenas' },
				{ text: 'Gestión estadías, alimentación y hospedajes de trabajadores' },
				{ text: 'Gestión de pagos de residenciales' },
				{ text: 'Notificación SMS para tus trabajadores' },
			],
		};
	},
	created() {
		this.$vuetify.theme.dark = false;
	},
	methods: {
		async onSubmit() {
			try {
				this.loading = !this.loading;
				await login(this.loginData);
				const profile = await this.fetchProfile();
				profile.role === 'admin'
					? this.$router.replace({ name: 'home' })
					: this.$router.replace({ name: 'profile' });
			} catch (error) {
				this.$toasted.show('Usuario o contraseña incorrectos', {
					type: 'error',
				});
			} finally {
				this.loading = !this.loading;
			}
		},
		...mapActions({
			fetchProfile: 'User/fetchProfile',
		}),
	},
};
</script>

<style lang="scss">
.bg {
	background: linear-gradient(
		90deg,
		rgba(213, 47, 143, 0.861782212885154) 0%,
		rgba(106, 49, 255, 0.8701855742296919) 100%
	);
}
</style>
