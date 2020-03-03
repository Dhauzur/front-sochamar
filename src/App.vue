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
import cookie from 'js-cookie';

export default {
	components: { UserBar },
	computed: {
		...mapGetters({
			isLogged: 'Auth/isLogged',
			company: 'Lodging/company',
		}),
	},
	created() {
		if (this.isLogged) {
			if (cookie.get('auth_jwt')) this.setToken(cookie.get('auth_jwt'));
			else this.setToken(localStorage.getItem('token'));
			this.fetchProfile();
		}
	},
	methods: {
		...mapMutations({ setToken: 'Auth/setToken' }),
		...mapActions({ fetchProfile: 'User/fetchProfile' }),
	},
};
</script>

<style lang="css">
@import '../node_modules/vue2vis/dist/vue2vis.css';
</style>
<style lang="scss">
@import '../node_modules/placeholder-loading/src/scss/placeholder-loading';
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #111213;
	overflow-x: hidden !important;
	// background-image: linear-gradient(-125deg, #e8f0f9, #295173, #192835);
	// background-image: linear-gradient(50deg, #502d55, #502d55, #8e4b71, #e7c8b7);
	// background-image: linear-gradient(50deg, #7b77c1, #908ac7d9, #dcccf173, #f5e9f38a);
	// background-image: linear-gradient(50deg, #2c6975, #6bb2a0, #edecde, #edecde, white, white);
	// background-image: linear-gradient(50deg, #8EC5FC, #9FACE6);
	// background-image: linear-gradient(50deg, #6ed8cc#0f5076, );
	background-image: linear-gradient(10deg, #adadad, #f3f3f3, white);
	height: 100vh;
	a {
		text-decoration: none;
	}
	a:hover {
		color: #8483e0;
	}
}

#nav {
	padding: 30px;
	a {
		font-weight: bold;
		color: #2c3e50;
		&.router-link-exact-active {
			color: #42b983;
		}
	}
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
	background-color: #f3f3f347;
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
	background-color: white !important;
	border: 1px solid #111213 !important;
	color: #111213 !important;
}
</style>
