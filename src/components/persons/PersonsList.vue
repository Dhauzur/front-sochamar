<template>
	<div class="list ">
		<v-list-group v-for="(item, index) in persons" :key="index" class="list-passanger">
			<v-list-group-item
				class="list-passangers "
				:class="{ 'list-passanger-select': item._id == person._id }"
				@click="selectedPerson(item)"
			>
				<v-row>
					<v-col cols="10" class="text-left">
						<div v-if="item.avatar" class="d-inline-block">
							<v-link :href="setAvatarlist(item.avatar)" target="_blank">
								<v-img
									v-bind="mainProps"
									rounded="circle"
									style="border: 1px solid #6bb2a0"
									alt="Circle image"
									:src="setAvatarlist(item.avatar)"
								></v-img>
							</v-link>
						</div>
						<div class="d-inline-block ml-1">
							<span>{{ item.firstName }} {{ item.lastName }}</span>
							<span v-if="item.appointment || item.function">
								- {{ item.appointment }}
								<span v-if="item.appointment && item.function">
									/
								</span>
								{{ item.function }}
							</span>
						</div>
					</v-col>
					<v-col cols="2">
						<v-button variant="danger" @click="deleteOne(item._id)">
							X
						</v-button>
					</v-col>
				</v-row>
			</v-list-group-item>
		</v-list-group>
	</div>
</template>

<script>
export default {
	props: {
		deleteOne: {
			type: Function,
			required: false,
		},
		getAllpersons: {
			type: Function,
			required: false,
		},
		persons: {
			type: Array,
			required: false,
		},
		person: {
			type: Object,
			required: false,
		},
		selectedPerson: {
			type: Function,
			required: false,
		},
	},
	data() {
		return {
			mainProps: {
				blank: false,
				blankColor: '#777',
				class: 'm1',
				height: 30,
				width: 30,
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
<style lang="css" scoped>
.modal-content {
	font-family: 'Poppins', sans-serif;
}
.list-group {
	margin-bottom: 5px !important;
}
.list-passangers {
	border: none;
	border-radius: 0px 35px 0px 35px !important;
}
.list {
	max-height: 200px;
	overflow-y: scroll;
}
</style>
