<template>
	<div>
		<v-app-bar dense>
			<v-tabs v-model="tab" color="accent">
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
		Lodgings: () => import('@/components/lodgings/Lodging'),
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
			const tabs = ['Actividades', 'Lugares', 'Personas'];
			return tabs;
		},
		...mapGetters({
			place: 'Lodging/place',
		}),
	},
};
</script>
