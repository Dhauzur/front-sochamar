<template>
	<v-app id="app">
		<component :is="layout">
			<router-view />
		</component>
	</v-app>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
	data() {
		return {
			oauthJWT: '',
			drawer: true,
		};
	},
	computed: {
		profileAvatar() {
			return this.profile.img;
		},
		fullName() {
			return `${this.profile.name} ${this.profile.lastName}`;
		},
		layout() {
			return this.$route.meta.layout || 'default';
		},
		...mapGetters({
			isLogged: 'Auth/isLogged',
			profile: 'User/profile',
		}),
	},
	created() {
		this.oauthJWT = this.$route.query.token;
		if (this.oauthJWT) {
			this.deleteQueryFromRoute();
			this.setToken(this.oauthJWT);
			this.fetchProfile();
			this.oauthJWT = '';
		} else {
			if (this.isLogged) {
				this.setToken(localStorage.getItem('token'));
				this.fetchProfile();
			}
		}
	},
	methods: {
		deleteQueryFromRoute() {
			this.$router.replace({ query: null });
		},
		...mapMutations({ setToken: 'Auth/setToken', logout: 'Auth/logout' }),
		...mapActions({ fetchProfile: 'User/fetchProfile' }),
	},
};
</script>

<style lang="css">
@import '../node_modules/vue2vis/dist/vue2vis.css';
</style>
<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Kanit|Poppins|Righteous&display=swap');
</style>
