<template>
	<div class="list ">
		<b-list-group v-for="(item, index) in passengers" :key="index" class="list-passanger">
			<b-list-group-item
				class="background-module-color "
				:class="{ 'list-passanger-select': item._id == passenger._id }"
				@click="selectedPassenger(item)"
			>
				<b-row>
					<b-col cols="10" class="text-left">
						<div v-if="item.passenger" class="d-inline-block">
							<b-link :href="setAvatarlist(item.passenger)" target="_blank">
								<b-img
									v-bind="mainProps"
									rounded="circle"
									style="border: 1px solid #6bb2a0"
									alt="Circle image"
									:src="setAvatarlist(item.passenger)"
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
		passenger: {
			type: Object,
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
	methods: {
		setAvatarlist(element) {
			if (typeof element === 'string') return element;
			return URL.createObjectURL(element);
		},
	},
};
</script>
<style lang="css">
.list-passanger-select {
	background-color: black !important;
	color: white;
}
.modal-content {
	background-image: linear-gradient(50deg, #adadad, #f3f3f3, white, white);
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	color: black;
}
.list-group {
	margin-bottom: 5px !important;
}
.background-module-color {
	border: none;
	border-radius: 0px 35px 35px 0px !important;
	background-color: white;
}
.list {
	max-height: 200px;
	overflow-y: scroll;
}
</style>
