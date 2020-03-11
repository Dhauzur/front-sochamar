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
@import '../node_modules/placeholder-loading/src/scss/placeholder-loading';
@import url('https://fonts.googleapis.com/css?family=Kanit|Poppins|Righteous&display=swap');
#app {
	font-family: 'Poppins', sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	overflow-x: hidden;
	background-color: #ebecee;
	height: 100vh;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
	opacity: 0;
}

/* width */
::-webkit-scrollbar {
	width: 4px;
}

/* Track */
::-webkit-scrollbar-track {
	background: transparent;
}

/* Handle */
::-webkit-scrollbar-thumb {
	background: transparent;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
	background: transparent;
}

.pointer {
	cursor: pointer;
}
</style>
