<template>
	<div>
		<!-- global appbar desktop-->
		<v-app-bar
			:flat="flatAppbar"
			app
			clipped-right
			class="appBar"
			:class="{ bgDark: $vuetify.theme.isDark, bgLight: !$vuetify.theme.isDark }"
			absolute
		>
			<v-tooltip bottom>
				<template v-slot:activator="{ on }">
					<router-link to="/" v-on="on">
						<v-avatar tile color="transparent" size="57">
							<Logo style="max-height: 70px;" />
						</v-avatar>
					</router-link>
				</template>
				<span>Phlain</span>
			</v-tooltip>
			<v-btn v-if="isAdmin" class="ma-2 primary--text" to="/management" text>
				Administrar
			</v-btn>
			<v-btn v-if="isAdmin" class="ma-2 primary--text" text to="/reports">
				Enviar informes
			</v-btn>
			<v-spacer></v-spacer>
			<v-btn class="ma-1 primary--text" text icon @click="toggleTheme">
				<v-icon>mdi-theme-light-dark</v-icon>
			</v-btn>
			<v-btn v-if="isAdmin" class="ma-1 primary--text" fab text to="/profile">
				<v-icon>mdi-cog-outline</v-icon>
			</v-btn>
			<v-btn text class="primary--text" @click="quit">Cerrar sesión</v-btn>
		</v-app-bar>
		<!-- global appbar/drawer mobile -->
		<v-app-bar
			absolute
			:flat="flatAppbar"
			app
			clipped-right
			:class="{ bgDark: $vuetify.theme.isDark, bgLight: !$vuetify.theme.isDark }"
			class="appBar hidden-sm-and-up mx-auto"
		>
			<v-app-bar-nav-icon dense @click.stop="drawer = !drawer" />
			<router-link to="/" class="mx-auto">
				<v-avatar color="transparent">
					<Logo style="max-height: 80px;" />
				</v-avatar>
			</router-link>
		</v-app-bar>
		<v-navigation-drawer
			v-model="drawer"
			app
			disable-resize-watcher
			:class="{ bgDark: $vuetify.theme.isDark, bgLight: !$vuetify.theme.isDark }"
		>
			<v-list>
				<Logo style="max-height: 80px;" />
			</v-list>
			<v-divider></v-divider>
			<v-list v-if="isAdmin" nav dense>
				<v-list-item active-class="primary--text" link to="/">
					<v-icon>mdi-home</v-icon>
					<v-list-item-title>Inicio</v-list-item-title>
				</v-list-item>
				<v-list-item active-class="primary--text" link to="/management">
					<v-icon>mdi-widgets</v-icon>
					<v-list-item-title>Administrar</v-list-item-title>
				</v-list-item>
				<v-list-item active-class="primary--text" link to="/reports">
					<v-icon>mdi-file-settings</v-icon>
					<v-list-item-title>Enviar informes</v-list-item-title>
				</v-list-item>
			</v-list>
			<template v-slot:append>
				<v-list>
					<v-list-item active-class="primary--text" link @click="toggleTheme">
						<v-icon>mdi-theme-light-dark</v-icon>
						<v-list-item-title>Tema</v-list-item-title>
					</v-list-item>
					<v-list-item v-if="isAdmin" active-class="primary--text" link to="/profile">
						<v-icon>mdi-cog-outline</v-icon>
						<v-list-item-title>Perfil</v-list-item-title>
					</v-list-item>
					<v-list-item active-class="primary--text" @click="quit">
						<v-icon>mdi-logout</v-icon>
						<v-list-item-title>Cerrar sesión</v-list-item-title>
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
import { mapGetters, mapActions } from 'vuex';
import { isAuthenticated, logout } from '../service/auth';
import Logo from '../assets/logo';

export default {
	name: 'Layout',
	components: {
		Logo,
	},
	data() {
		return {
			oauthJWT: '',
			drawer: false,
			showAvatar: false,
		};
	},
	computed: {
		flatAppbar() {
			return this.$route.name === 'management' || this.$route.name === 'profile';
		},
		fullName() {
			if (this.profile.name) return this.profile.name + ' ' + this.profile.lastName;
			return '';
		},
		isAdmin() {
			return this.profile.role === 'admin';
		},
		...mapGetters({
			profile: 'User/profile',
		}),
	},
	created() {
		if (isAuthenticated()) {
			this.fetchProfile();
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
		async quit() {
			await logout();
			this.$router.replace({ name: 'auth' });
		},
		...mapActions({ fetchProfile: 'User/fetchProfile' }),
	},
};
</script>

<style lang="scss" scoped>
.appBar {
	font-family: roboto;
}
</style>
