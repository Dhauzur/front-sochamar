<template lang="html">
	<b-button @click="login(loginData)">Probemos el login con credenciales ya definidas</b-button>
</template>

<script>
import { mapActions } from 'vuex';

export default {
	data() {
		return {
			loginData: {
				email: 'prueba@prueba.cl',
				password: 'asd',
			},
		};
	},
	methods: {
		...mapActions({
			login: 'Auth/login',
		}),
	},
};
</script>

<style lang="css" scoped></style>
