<template>
	<div id="app">
		<div class="shadoNavBar">
			<b-navbar toggleable="sm">
				<b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>
				<b-navbar-brand>Sochamar</b-navbar-brand>
				<b-collapse id="nav-text-collapse" is-nav>
					<b-navbar-nav>
						<b-nav-text class="mr-3">
							<router-link to="/">
								Hospedajes
							</router-link>
							<router-link to="/home">
								Ver registros de trabajo
							</router-link>
						</b-nav-text>
						<b-nav-text class="mr-3">
							<router-link to="/mantenimiento">
								Enviar trabajo
							</router-link>
						</b-nav-text>
						<b-nav-text class="mr-3">
							<router-link to="/informe">
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
import UserBar from './components/UserBar';
import { mapGetters, mapMutations } from 'vuex';

export default {
	components: { UserBar },
	computed: {
		...mapGetters({
			isLogged: 'Auth/isLogged',
		}),
	},
	created() {
		if (this.isLogged) {
			this.setToken(localStorage.getItem('token'));
		}
	},
	methods: {
		...mapMutations({ setToken: 'Auth/setToken' }),
	},
};
</script>

<style lang="css">
@import '../node_modules/vue2vis/dist/vue2vis.css';
</style>
<style lang="scss">
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	overflow-x: hidden !important;
	// background-image: linear-gradient(-125deg, #e8f0f9, #295173, #192835);
	// background-image: linear-gradient(50deg, #502d55, #502d55, #8e4b71, #e7c8b7);
	// background-image: linear-gradient(50deg, #7b77c1, #908ac7d9, #dcccf173, #f5e9f38a);
	background-image: linear-gradient(50deg, #6266e2d4, #8b8ac7d9, #e5dce673, #e9ecf58a);
	// background-image: linear-gradient(50deg, #8EC5FC, #9FACE6);
	// background-image: linear-gradient(50deg, #6ed8cc#0f5076, );
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
	box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
	background-color: white !important;
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
	background-color: #c4c1dc61;
	border-radius: 20px;
	max-height: 80vh !important;
	overflow-y: auto;
}
</style>
