<template lang="html">
	<div v-if="isLogged">
		<p>Esta Logeado y este es el usuario</p>
		<p>Nombre: {{ user.nombre }}</p>
		<p>rol: {{ user.role }}</p>
		<p>id: {{ user.id }}</p>
	</div>
	<div v-else>
		No esta logeado // Invitado
		{{ isLogged }}
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	computed: {
		...mapGetters({
			isLogged: 'Auth/isLogged',
			user: 'Auth/user',
		}),
	},
};
</script>

<style lang="css" scoped></style>
