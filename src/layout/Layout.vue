<template>
	<div>
		<!-- global appbar -->
		<v-app-bar :flat="flatAppbar" app dense clipped-right>
			<v-app-bar-nav-icon dense @click.stop="drawer = !drawer" />
			<v-toolbar-title>{{ $route.meta.title }}</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn icon @click="toggleTheme">
				<v-icon>mdi-theme-light-dark</v-icon>
			</v-btn>
			<span class="hidden-sm-and-down">{{ fullName }}</span>
		</v-app-bar>
		<v-navigation-drawer
			v-model="drawer"
			app
			mini-variant
			mini-variant-width="62"
			mobile-break-point="768"
			color="secondary"
		>
			<v-list> <Logo style="max-height: 80px;"/></v-list>
			<v-divider></v-divider>
			<v-list nav dense>
				<v-list-item active-class="accent--text" link to="/">
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-icon v-on="on">mdi-home</v-icon>
						</template>
						<span>Inicio</span>
					</v-tooltip>
					<v-list-item-title>Inicio</v-list-item-title>
				</v-list-item>
				<v-list-item active-class="accent--text" link to="/management">
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-icon v-on="on">mdi-widgets</v-icon>
						</template>
						<span>Administrar actividades</span>
					</v-tooltip>
					<v-list-item-title>Administrar</v-list-item-title>
				</v-list-item>
				<v-list-item active-class="accent--text" link to="/reports">
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-icon v-on="on">mdi-file-settings</v-icon>
						</template>
						<span>Enviar informes</span>
					</v-tooltip>
					<v-list-item-title>Enviar informes</v-list-item-title>
				</v-list-item>
			</v-list>
			<template v-slot:append>
				<v-list>
					<v-list-item class="px-2">
						<v-menu bottom left>
							<template v-slot:activator="{ on }">
								<v-list-item-avatar icon v-on="on">
									<v-img :src="profileAvatar"></v-img>
								</v-list-item-avatar>
							</template>
							<v-list>
								<v-list-item link to="/profile">
									<span>Perfil</span>
								</v-list-item>
								<v-list-item link @click="logout">
									<span>Salir</span>
								</v-list-item>
							</v-list>
						</v-menu>
					</v-list-item>
				</v-list>
			</template>
		</v-navigation-drawer>
		<v-content>
			<router-view />
		</v-content>
	</div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import Logo from '../assets/logo';

export default {
	name: 'Layout',
	components: {
		Logo,
	},
	data() {
		return {
			oauthJWT: '',
			drawer: true,
		};
	},
	computed: {
		flatAppbar() {
			return this.$route.name === 'management';
		},
		profileAvatar() {
			return this.profile.img;
		},
		fullName() {
			return this.profile.name + ' ' + this.profile.lastName;
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
		const mode = localStorage.getItem('mode');
		if (mode === 'dark') {
			this.toggleTheme();
		}
	},
	methods: {
		toggleTheme() {
			this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
			this.$vuetify.theme.themes.dark.$card = '#192734';
			if (this.$vuetify.theme.isDark) {
				localStorage.setItem('mode', 'dark');
			} else {
				localStorage.setItem('mode', 'light');
			}
		},
		deleteQueryFromRoute() {
			this.$router.replace({ query: null });
		},
		...mapMutations({ logout: 'Auth/logout', setToken: 'Auth/setToken' }),
		...mapActions({ fetchProfile: 'User/fetchProfile' }),
	},
};
</script>
