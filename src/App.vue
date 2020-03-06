<template>
	<div id="app">
		<div class="shadoNavBar">
			<b-navbar toggleable="sm">
				<b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>
				<b-navbar-brand>Sochamar</b-navbar-brand>
				<b-collapse id="nav-text-collapse" is-nav>
					<b-navbar-nav>
						<b-nav-text class="mr-3">
							<router-link to="/lodgings">
								Actividades
							</router-link>
							<!-- <router-link to="/home">
								Ver registros de trabajo
							</router-link> -->
						</b-nav-text>
						<!-- <b-nav-text class="mr-3">
							<router-link to="/mantenimiento">
								Enviar trabajo
							</router-link>
						</b-nav-text> -->
						<b-nav-text class="mr-3">
							<router-link to="/reports">
								Enviar informe
							</router-link>
						</b-nav-text>
					</b-navbar-nav>
					<UserBar />
				</b-collapse>
			</b-navbar>
		</div>
		<router-view />
	</div>
</template>

<script>
import UserBar from './components/auth/UserBar';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
	components: { UserBar },
	data() {
		return {
			oauthJWT: '',
		};
	},
	computed: {
		...mapGetters({
			isLogged: 'Auth/isLogged',
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
		...mapMutations({ setToken: 'Auth/setToken' }),
		...mapActions({ fetchProfile: 'User/fetchProfile' }),
		deleteQueryFromRoute() {
			this.$router.replace({ query: null });
		},
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
	// font-family: 'Kanit', sans-serif;
	// font-family: 'Righteous', cursive;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #ffffff;
	overflow-x: hidden;
	// background-image: linear-gradient(10deg, #adadad, #f3f3f3, white);
	background-color: transparent;
	background-image: linear-gradient(80deg, #676b76, #676b76de, #676b76);
	height: 100vh;
	a,
	.navbar-brand {
		text-decoration: none;
		color: #ffffff;
	}
	a:hover {
		color: #ecb099;
	}
}

#nav {
	padding: 30px;
	a {
		font-weight: bold;
		color: #ffffff;
		&.router-link-exact-active {
			color: #ecb099;
		}
	}
}
::placeholder {
	color: #b7b3b3 !important;
}
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
	opacity: 0;
}

.borderModule {
	border-radius: 30px;
	box-shadow: 0px 0px 20px -8px rgb(0, 0, 0);
}

input {
	background: #56565666 !important;
	border: none !important;
	color: white !important;
	text-align: center;
	text-align-last: center;
	font-weight: bold;
}
input:focus {
	outline-width: 0;
	border-bottom: 3px solid #676b769e !important;
}

.shadoNavBar {
	background-color: transparent !important;
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
.background-into-module {
	box-shadow: inset 0px -15px 20px -25px rgba(0, 0, 0, 0.75);
}

.background-module {
	// background-color: #c1c5d1;
	border-radius: 20px;
	max-height: 80vh !important;
	overflow-y: auto;
	padding-bottom: 20px;
}

.btn {
	border-radius: 20px !important;
	margin: 10px;
	margin-left: 0px;
}

.btn-secondary {
	background-color: #4c4a4a7a !important;
	border: none !important;
	color: white !important;
	transition: all ease-in-out 0.9s;
}
.btn-secondary:hover {
	background-image: linear-gradient(10deg, #ecb099, #ff591b);
	transition: all ease-in-out 1.9s;
}
.pointer {
	cursor: pointer;
}
</style>
