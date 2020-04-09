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
			<v-btn :loading="loading" small color="primary" @click="handleSubmit">
				Enviar Recuperación
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Logo from '@/assets/logo';

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
