<template>
	<div class="list">
		<b-list-group v-for="(item, index) in passengers" :key="index">
			<b-list-group-item @click="() => selectedPassenger(item)"
				>{{ item.firstName }} {{ item.lastName }}</b-list-group-item
			>
			<span class="text-danger" @click="deleteOne(item._id)">X</span>
		</b-list-group>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	props: {
		selectedPassenger: {
			type: Function,
			required: false,
		},
		deleteOne: {
			type: Function,
			required: false,
		},
	},
	computed: {
		...mapGetters({ passengers: 'Passengers/passengers' }),
	},
};
</script>

<style lang="scss" scoped>
.list {
	max-height: 150px;
	overflow-y: scroll;
}
</style>
