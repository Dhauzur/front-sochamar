<template>
	<div>
		<v-card outlined>
			<v-toolbar color="primary" dark flat>
				<v-toolbar-title>Recuperar contraseña</v-toolbar-title>
			</v-toolbar>
			<v-card-text>
				<v-form>
					<v-text-field
						id="password-email"
						v-model.trim="email"
						label="Correo Electronico"
						type="email"
						prepend-icon="mdi-account"
						required
					/>
				</v-form>
			</v-card-text>
			<v-card-actions>
				<v-btn
					:loading="loading"
					color="error"
					rounded
					@click="disablePasswordRecover(false)"
				>
					Cancelar
				</v-btn>
				<v-btn :loading="loading" color="primary" rounded @click="handleSubmit">
					Enviar Recuperación
				</v-btn>
			</v-card-actions>
		</v-card>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
	props: {
		disablePasswordRecover: {
			type: Function,
			required: true,
		},
	},
	data() {
		return {
			email: '',
		};
	},
	computed: {
		...mapGetters({
			loading: 'Auth/loading',
		}),
	},
	methods: {
		...mapActions({
			requestPasswordRecoverEmail: 'Auth/requestPasswordRecoverEmail',
		}),
		handleSubmit() {
			this.requestPasswordRecoverEmail(this.email).then(() =>
				this.disablePasswordRecover(false)
			);
		},
	},
};
</script>

<style scoped></style>
