<template>
	<div>
		<v-navigation-drawer
			v-model="drawer"
			color="secondary"
			mini-variant
			app
			clipped
			mobile-break-point="768"
		>
			<v-list>
				<v-list-item class="px-2" link to="/profile">
					<v-list-item-avatar>
						<v-img :src="profileAvatar"></v-img>
					</v-list-item-avatar>
				</v-list-item>
			</v-list>
			<v-divider></v-divider>
			<v-list nav dense>
				<v-list-item link to="/">
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-icon color="white" dark v-on="on">mdi-home</v-icon>
						</template>
						<span>Inicio</span>
					</v-tooltip>
					<v-list-item-title>Inicio</v-list-item-title>
				</v-list-item>
				<v-list-item link to="/management/lodgings">
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-icon color="white" dark v-on="on">mdi-widgets</v-icon>
						</template>
						<span>Administrar Hospedajes</span>
					</v-tooltip>
					<v-list-item-title>Administrar</v-list-item-title>
				</v-list-item>
				<v-list-item link to="/reports">
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-icon color="white" dark v-on="on">mdi-file-settings-outline</v-icon>
						</template>
						<span>Enviar informes</span>
					</v-tooltip>
					<v-list-item-title>Enviar informes</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>
		<v-app-bar dense>
			<v-app-bar-nav-icon dense @click.stop="drawer = !drawer" />
			<v-toolbar-title>{{ $route.meta.title }}</v-toolbar-title>
			<v-spacer></v-spacer>
			{{ fullName }}
			<v-menu bottom left>
				<template v-slot:activator="{ on }">
					<v-btn icon v-on="on">
						<v-icon>mdi-dots-vertical</v-icon>
					</v-btn>
				</template>

				<v-list>
					<v-list-item @click="logout">
						<v-list-item-title>Salir</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
		</v-app-bar>
		<v-content>
			<router-view />
		</v-content>
	</div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
	name: 'Layout',
	data() {
		return {
			drawer: true,
		};
	},
	computed: {
		profileAvatar() {
			return this.profile.img;
		},
		fullName() {
			return this.profile.name + ' ' + this.profile.lastName;
		},
		...mapGetters({
			profile: 'User/profile',
		}),
	},
	methods: {
		...mapMutations({ logout: 'Auth/logout' }),
		...mapActions({ fetchProfile: 'User/fetchProfile' }),
	},
};
</script>
