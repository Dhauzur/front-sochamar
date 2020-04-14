<template>
	<div>
		<!-- global appbar -->
		<v-app-bar :flat="flatAppbar" app dense clipped-right>
			<v-app-bar-nav-icon dense @click.stop="drawer = !drawer" />
			<v-toolbar-title>{{ $route.meta.title }}</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-tooltip bottom>
				<template v-slot:activator="{ on }">
					<v-btn icon v-on="on" @click="toggleTheme">
						<v-icon>mdi-theme-light-dark</v-icon>
					</v-btn>
				</template>
				<span>Activar o desactivar modo oscuro</span>
			</v-tooltip>
			<v-tooltip bottom>
				<template v-slot:activator="{ on }">
					<v-btn icon v-on="on" @click="quit">
						<v-icon v-on="on">mdi-logout</v-icon>
					</v-btn>
				</template>
				<span>Salir</span>
			</v-tooltip>
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
			<v-list>
				<Logo style="max-height: 80px;" />
			</v-list>
			<v-divider></v-divider>
			<v-list v-if="isAdmin" nav dense>
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
								<div v-on="on">
									<avatar
										icon
										:name="profile.name"
										:last-name="profile.lastName"
										:url="profile.img"
									/>
								</div>
							</template>
							<v-list>
								<v-list-item link to="/profile">
									<span>Perfil</span>
								</v-list-item>
								<v-list-item link @click="quit">
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
import { mapGetters, mapActions } from 'vuex';
import { isAuthenticated, logout } from '../service/auth';
import Logo from '../assets/logo';
import Avatar from '@/components/ui/Avatar';
export default {
	name: 'Layout',
	components: {
		Logo,
		Avatar,
	},
	data() {
		return {
			oauthJWT: '',
			drawer: true,
			showAvatar: false,
		};
	},
	computed: {
		flatAppbar() {
			return this.$route.name === 'management';
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
