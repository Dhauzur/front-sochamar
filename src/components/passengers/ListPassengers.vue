<template>
	<div class="list ">
		<b-list-group v-for="(item, index) in passengers" :key="index" class="list-passanger">
			<b-list-group-item class="background-module-color " @click="selectedPassenger(item)">
				<b-row>
					<b-col cols="10" class="text-left">
						<div v-if="item.passenger" class="d-inline-block">
							<b-link :href="`${api}/${item.passenger}`" target="_blank">
								<b-img
									v-bind="mainProps"
									rounded="circle"
									style="border: 1px solid #6bb2a0"
									alt="Circle image"
									:src="`${api}/${item.passenger}`"
								></b-img>
							</b-link>
						</div>
						<div class="d-inline-block ml-1">
							<span>{{ item.firstName }} {{ item.lastName }}</span>
							<span v-if="item.appointment || item.function">
								- {{ item.appointment
								}}<span v-if="item.appointment && item.function">/</span
								>{{ item.function }}</span
							>
						</div>
					</b-col>
					<b-col cols="2">
						<b-button variant="danger" @click="deleteOne(item._id)">
							X
						</b-button>
					</b-col>
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

<style lang="css" scoped>
.list-passanger {
	margin-bottom: 5px;
}
.background-module-color {
	border: none !important;
	background-image: linear-gradient(10deg, #6bb2a0, #cde0c9, #cde0c9, #edecde, #edecde);
	border-radius: 35px !important;
}
.list {
	max-height: 150px;
	overflow-y: scroll;
}
</style>
