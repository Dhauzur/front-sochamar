<template lang="html">
	<div v-if="isLogged">
		<b-row>
			<h2 v-text="user.nombre" class=""></h2>
			<b-col>
				<b-dropdown variant="link" no-caret>
					<template v-slot:button-content>
						<b-img
							rounded="circle"
							alt="Circle image"
							width="50"
							src="https://picsum.photos/125/125/?image=58"
						></b-img>
					</template>
					<b-dropdown-item href="#">Perfil</b-dropdown-item>
					<b-dropdown-item href="#" @click="logout">Salir</b-dropdown-item>
				</b-dropdown>
			</b-col>
		</b-row>
	</div>
	<div v-else>
		Hola Invitado, <router-link to="/register">Registrate!</router-link> o
		<router-link to="/login">Ingresa!</router-link>
	</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
	computed: {
		...mapGetters({
			isLogged: 'Auth/isLogged',
			user: 'Auth/user',
		}),
	},
	methods: {
		...mapMutations({ logout: 'Auth/logout' }),
	},
};
</script>

<style lang="css" scoped></style>
