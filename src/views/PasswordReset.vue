<template lang="html">
	<b-container>
		<b-row class="justify-content-center">
			<b-col md="5">
				<b-card>
					<b-card-title>Recuperar contraseña</b-card-title>
					<b-card-body>
						<b-form @submit.prevent="sendNewPassword">
							<!--CONTRASEÑA-->
							<b-form-group
								id="input-group-1"
								label="Nueva Contraseña:"
								label-for="email-input"
							>
								<b-form-input
									id="email-input"
									v-model.trim="formData.newPassword"
									type="password"
									required
									placeholder="Ingresa la contraseña"
								></b-form-input>
							</b-form-group>
							<!--NUEVA CONTRASEÑA-->
							<b-form-group
								id="input-group-2"
								label="Ingresala nuevamente:"
								label-for="email-input"
							>
								<b-form-input
									id="email-input"
									v-model.trim="formData.repeatedPassword"
									type="password"
									required
									placeholder="Ingresa la contraseña nuevamente"
								></b-form-input>
							</b-form-group>
							<!--SUBMIT-->
							<b-button v-if="!loading" type="submit" variant="primary"
								>Actualizar</b-button
							>
						</b-form>
					</b-card-body>
				</b-card>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
	data() {
		return {
			formData: {
				newPassword: '',
				repeatedPassword: '',
			},
			temporalJwt: '',
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
	created() {
		this.temporalJwt = this.$route.query.token;
		this.deleteQueryFromRoute();
	},
	methods: {
		...mapActions({
			updatePassword: 'Auth/updatePassword',
		}),
		sendNewPassword() {
			if (this.formData.repeatedPassword === this.formData.newPassword) {
				const recoverData = {
					token: this.temporalJwt,
					password: this.formData.newPassword,
				};
				this.updatePassword(recoverData);
			} else {
				this.$toasted.show('No coinciden las contraseñas', {
					type: 'error',
				});
			}
		},
		deleteQueryFromRoute() {
			this.$router.replace({ query: null });
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
