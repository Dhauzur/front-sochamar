<template>
	<div>
		<Header />
		<v-row v-if="seeTimeline">
			<v-col cols="12">
				<Timeline />
			</v-col>
		</v-row>
		<v-row v-else>
			<v-col cols="12" sm="6" md="3">
				<List />
			</v-col>
			<v-col cols="12" sm="6" md="9">
				<Edit />
			</v-col>
		</v-row>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
	components: {
		List: () => import('@/components/lodgings/List'),
		Edit: () => import('@/components/lodgings/Edit'),
		Header: () => import('@/components/lodgings/Header'),
		Timeline: () => import('@/components/lodgings/Timeline'),
	},
	computed: {
		...mapGetters({
			seeTimeline: 'Lodging/seeTimeline',
		}),
	},
	created() {
		this.fetchPlace();
		this.fetchLodgings();
	},
	methods: {
		...mapActions({
			fetchLodgings: 'Lodging/fetchLodgings',
			fetchPlace: 'Lodging/fetchPlace',
		}),
	},
};
</script>
