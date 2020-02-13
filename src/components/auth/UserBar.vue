<template lang="html">
	<b-navbar-nav v-if="isLogged" class="ml-auto">
		<b-nav-text class="mr-sm-3 pt-4" right>
			{{ user.name }}
		</b-nav-text>
		<b-nav-item-dropdown text="Lang" no-caret right>
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
		</b-nav-item-dropdown>
	</b-navbar-nav>
	<b-navbar-nav v-else class="ml-auto">
		<b-nav-text class="mr-3" right @click="$router.push('register')">
			<a>Registrarte</a>
		</b-nav-text>
		<b-nav-text class="mr-3 " right @click="$router.push('login')">
			<a>Ingresa</a>
		</b-nav-text>
	</b-navbar-nav>
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
