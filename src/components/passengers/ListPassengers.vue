<template>
	<div class="list">
		<b-list-group v-for="(item, index) in passengers" :key="index">
			<b-list-group-item>{{ item.firstName }} {{ item.lastName }}</b-list-group-item>
		</b-list-group>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
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
