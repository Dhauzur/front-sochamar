<template>
	<v-card flat>
		<Logo style="max-height: 30vh;" />
		<v-card-subtitle>
			Recuperar contraseña
		</v-card-subtitle>
		<v-card-text>
			<v-form>
				<v-text-field
					id="password-email"
					v-model.trim="email"
					outlined
					dense
					label="Correo Electronico"
					type="email"
					prepend-icon="mdi-account"
					required
				/>
			</v-form>
		</v-card-text>
		<v-card-actions>
			<v-btn text color="primary" small @click="disablePasswordRecover(false)">
				Cancelar
			</v-btn>
			<v-spacer />
			<v-btn :loading="loading" small color="primary" @click="onSubmit">
				Enviar Recuperación
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import Logo from '@/assets/logo';
import { requestPasswordRecoverEmail } from '@/service/auth';

export default {
	components: {
		Logo,
	},
	props: {
		disablePasswordRecover: {
			type: Function,
			required: true,
		},
	},
	data() {
		return {
			loading: false,
			email: '',
		};
	},
	methods: {
		async onSubmit() {
			try {
				this.loading = !this.loading;
				await requestPasswordRecoverEmail(this.email);
				this.disablePasswordRecover(false);
				this.$toasted.show('Correo de recuperación enviado con exito', {
					type: 'success',
				});
			} catch (error) {
				this.$toasted.show('Ese correo no existe en sistema', {
					type: 'error',
				});
			}
			this.loading = !this.loading;
		},
	},
};
</script>

<style scoped></style>
