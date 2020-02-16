<template>
	<div>
		<h3 class="my-4">Recuperar Contraseña</h3>
		<b-form @submit.prevent="handleSubmit">
			<!--EMAIL-->
			<b-form-group
				id="password-recover"
				label="Correo electronico:"
				label-for="password-email"
			>
				<b-form-input
					id="password-email"
					v-model.trim="email"
					type="email"
					required
					placeholder="Ingrese el correo"
				></b-form-input>
			</b-form-group>
			<!--SUBMIT-->
			<!--Aca esta el problema de espaciado con los botones-->
			<b-form-row>
				<b-col md="2">
					<b-button variant="secondary" @click="disablePasswordRecover(false)">
						Cancelar</b-button
					>
				</b-col>
				<b-col md="6">
					<b-button v-if="!loading" type="submit" variant="primary">
						Enviar Recuperación</b-button
					>
				</b-col>
			</b-form-row>
		</b-form>
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
