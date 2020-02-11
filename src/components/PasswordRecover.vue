<template>
	<div>
		<h3 class="my-4">Recuperar Contraseña</h3>
		<b-form @submit.prevent="requestPasswordRecoverEmail(email)">
			<!--EMAIL-->
			<b-form-group id="input-group-1" label="Correo electronico:" label-for="email-input">
				<b-form-input
					id="email-input"
					v-model.trim="email"
					type="email"
					required
					placeholder="Ingresa el correo"
				></b-form-input>
			</b-form-group>
			<!--SUBMIT-->
			<b-button type="submit" variant="secondary" @click="disablePasswordRecover(false)">
				Cancelar</b-button
			>
			<b-button v-if="!loading" type="submit" variant="primary">
				Enviar Recuperación</b-button
			>
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
			message: 'Auth/message',
			loading: 'Auth/loading',
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
			requestPasswordRecoverEmail: 'Auth/requestPasswordRecoverEmail',
		}),
	},
};
</script>

<style scoped></style>
