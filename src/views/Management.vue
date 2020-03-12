<template>
	<div>
		<v-app-bar flat dense>
			<v-tabs v-model="tab" background-color="#ebecee">
				<v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
			</v-tabs>
		</v-app-bar>
		<v-container>
			<template v-if="tab === 0"><lodgings /></template>
			<template v-if="tab === 1"><place /></template>
			<template v-if="tab === 2"><persons /></template>
			<template v-if="tab === 3"><periods :id-place="place"/></template>
			<template v-if="tab === 4"><rooms :id-place="place"/></template>
			<template v-if="tab === 5"><payments :id-place="place"/></template>
		</v-container>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	components: {
		Lodgings: () => import('@/components/lodgings/Lodging'),
		Payments: () => import('@/components/payments/Payments'),
		Place: () => import('@/components/place/Place'),
		Periods: () => import('@/components/periods/Periods'),
		Persons: () => import('@/components/persons/Persons'),
		Rooms: () => import('@/components/rooms/Rooms'),
	},
	data() {
		return {
			tab: null,
		};
	},
	computed: {
		items() {
			const tabs = ['Hospedajes', 'Lugares', 'Personas'];
			if (this.place) tabs.push('Turnos', 'Habitaciones', 'Pagos');
			return tabs;
		},
		...mapGetters({
			place: 'Lodging/place',
		}),
	},
};
</script>
