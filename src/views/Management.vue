<template>
	<div>
		<v-app-bar dense>
			<v-tabs
				v-model="tab"
				color="primary"
				:class="{ bgDark: $vuetify.theme.isDark, bgLight: !$vuetify.theme.isDark }"
				centered
			>
				<v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
			</v-tabs>
		</v-app-bar>
		<v-container>
			<template v-if="tab === 0"><lodgings /></template>
			<template v-if="tab === 1"><place /></template>
			<template v-if="tab === 2"><persons /></template>
		</v-container>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	components: {
		Lodgings: () => import('@/components/lodgings/Lodging2'),
		Place: () => import('@/components/place/Place'),
		Persons: () => import('@/components/persons/Persons'),
	},
	data() {
		return {
			tab: null,
		};
	},
	computed: {
		items() {
			return ['Actividades', 'Lugares', 'Personas'];
		},
		...mapGetters({
			place: 'Lodging/place',
		}),
	},
};
</script>
