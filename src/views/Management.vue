<template>
	<div>
		<v-toolbar dark color="secondary">
			<v-btn icon @click="() => $router.back()">
				<v-icon>mdi-arrow-left</v-icon>
			</v-btn>
			<v-toolbar-title>{{ $route.meta.subtitle }}</v-toolbar-title>
			<template v-slot:extension>
				<v-tabs align-with-title>
					<v-tab :to="{ name: 'lodgings' }">Hospedajes</v-tab>
					<v-tab :to="{ name: 'places' }">Lugares</v-tab>
					<v-tab :to="{ name: 'persons' }">Personas</v-tab>
					<v-tab v-if="place" :to="{ name: 'periods', params: { placeId: place } }"
						>Turnos</v-tab
					>
					<v-tab v-if="place" :to="{ name: 'payments', params: { place: place } }"
						>Pagos</v-tab
					>
				</v-tabs>
			</template>
		</v-toolbar>
		<router-view></router-view>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	computed: {
		...mapGetters({
			place: 'Lodging/place',
		}),
	},
};
</script>
