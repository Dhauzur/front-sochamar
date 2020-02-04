<template>
	<div class="list">
		<b-list-group v-for="(item, index) in passengers" :key="index">
			<b-list-group-item @click="() => selectedPassenger(item)">
				<b-row>
					<b-col cols="10" class="text-left"
						>{{ item.firstName }} {{ item.lastName }} - {{ item.appointment }}/{{
							item.function
						}}</b-col
					>
					<b-col cols="2" class="text-danger" @click="deleteOne(item._id)">X</b-col>
				</b-row>
			</b-list-group-item>
		</b-list-group>
	</div>
</template>

<script>
export default {
	props: {
		selectedPassenger: {
			type: Function,
			required: false,
		},
		getAllPassengers: {
			type: Function,
			required: false,
		},
		passengers: {
			type: Array,
			required: false,
		},
		deleteOne: {
			type: Function,
			required: false,
		},
	},
};
</script>

<style lang="scss" scoped>
.list {
	max-height: 150px;
	overflow-y: scroll;
}
</style>
