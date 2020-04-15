<template>
	<v-card flat>
		<v-card-text>
			<v-text-field
				id="password-email"
				v-model.trim="email"
				outlined
				dense
				filled
				label="Correo Electronico"
				type="email"
				prepend-icon="mdi-account"
				required
			/>
		</v-card-text>
		<v-card-actions hide-details>
			<v-btn text color="primary" small @click="back">
				Regresar
			</v-btn>
			<v-spacer></v-spacer>
			<v-btn :loading="loading" small color="primary" @click="onSubmit">
				Solicitar recuperación
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import { requestPasswordRecoverEmail } from '@/service/auth';

export default {
	props: {
		back: {
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
