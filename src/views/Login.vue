<template lang="html">
	<b-container>
		<b-row id="nav" class="justify-content-center">
			<b-col md="8" lg="6" class="background-module pb-3 px-4">
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
					<b-button class="mt-2" type="submit" variant="primary"> Ingresar</b-button>
				</b-form>
				<p>
					¿No tienes una cuenta?
					<router-link to="/register">registrate</router-link>
				</p>
				<a href="#">¿Olvidaste tu contraseña?</a>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
	data() {
		return {
			loginData: {
				email: '',
				password: '',
			},
		};
	},
	computed: {
		...mapGetters({
			messageAuth: 'Auth/message',
			messageRoom: 'Room/message',
			messageCompany: 'Company/message',
		}),
	},
	watch: {
		messageAuth(newVal) {
			this.toastedMessage(newVal);
		},
		messageRoom(newVal) {
			this.toastedMessage(newVal);
		},
		messageCompany(newVal) {
			this.toastedMessage(newVal);
		},
	},
	mounted() {
		this.toastedMessage(this.messageAuth);
		this.toastedMessage(this.messageRoom);
		this.toastedMessage(this.messageCompany);
	},
	methods: {
		...mapActions({
			login: 'Auth/login',
		}),
		toastedMessage(newVal) {
			this.$toasted.show(newVal.text, {
				type: newVal.type,
			});
		},
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
