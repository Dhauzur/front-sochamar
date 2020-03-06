<template lang="html">
	<b-navbar-nav v-if="isLogged" class="ml-auto">
		<b-nav-text class="mr-sm-3 pt-4 text-white" right v-text="fullName"></b-nav-text>
		<b-nav-item-dropdown text="Lang" no-caret right>
			<template v-slot:button-content>
				<b-img alt="" rounded="circle" v-bind="mainProps" :src="profileAvatar"></b-img>
			</template>
			<b-dropdown-item to="/profile">
				<span class="text-secondary">Perfil</span>
			</b-dropdown-item>
			<b-dropdown-item href="#" @click="logout">
				<span class="text-secondary">Salir</span>
			</b-dropdown-item>
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
			if (this.profile.name) return `${this.profile.name} ${this.profile.lastName}`;
			return '';
		},
		profileAvatar() {
			if (this.profile.img) return this.profile.img;
			return '';
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
