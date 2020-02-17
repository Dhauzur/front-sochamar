<template lang="html">
	<b-navbar-nav v-if="isLogged" class="ml-auto">
		<b-nav-text class="mr-sm-3 pt-4" right v-text="fullName"> </b-nav-text>
		<b-nav-item-dropdown text="Lang" no-caret right>
			<template v-slot:button-content>
				<b-img alt="" rounded="circle" v-bind="mainProps" :src="profileAvatar"></b-img>
			</template>

			<b-dropdown-item to="/profile">Perfil </b-dropdown-item>
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
	data() {
		return {
			mainProps: { blank: false, blankColor: '#777', width: 50, height: 50, class: 'm1' },
		};
	},
	computed: {
		fullName() {
			return this.profile.name + ' ' + this.profile.lastName;
		},
		profileAvatar() {
			return this.profile.img;
		},
		...mapGetters({
			isLogged: 'Auth/isLogged',
			profile: 'User/profile',
		}),
	},
	methods: {
		...mapMutations({ logout: 'Auth/logout' }),
	},
};
</script>

<style lang="css" scoped></style>
