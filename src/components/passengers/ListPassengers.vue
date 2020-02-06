<template>
	<div class="list">
		<b-list-group v-for="(item, index) in passengers" :key="index">
			<b-list-group-item @click="selectedPassenger(item)">
				<b-row>
					<b-col cols="10" class="text-left">
						<div v-if="item.passenger" class="d-inline-block">
							<b-link :href="`${api}${item.passenger}`" target="_blank">
								<b-img
									v-bind="mainProps"
									rounded="circle"
									alt="Circle image"
									:src="`${api}${item.passenger}`"
								></b-img>
							</b-link>
						</div>
						<div class="d-inline-block ml-1">
							{{ item.firstName }} {{ item.lastName }} - {{ item.appointment }}/{{
								item.function
							}}
						</div></b-col
					>
					<b-col cols="2" class="text-danger pointer" @click="deleteOne(item._id)"
						>X</b-col
					>
				</b-row>
			</b-list-group-item>
		</b-list-group>
	</div>
</template>

<script>
export default {
	props: {
		api: {
			type: String,
			required: false,
		},
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
	data() {
		return {
			mainProps: {
				blank: false,
				blankColor: '#777',
				width: 30,
				height: 30,
				class: 'm1',
			},
		};
	},
};
</script>

<style lang="scss" scoped>
.list {
	max-height: 150px;
	overflow-y: scroll;
}
.pointer {
	cursor: pointer;
}
</style>
