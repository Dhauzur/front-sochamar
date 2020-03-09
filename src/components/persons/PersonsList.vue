<template>
	<div class="list ">
		<b-list-group v-for="(item, index) in persons" :key="index" class="list-passanger">
			<b-list-group-item
				class="list-passangers "
				:class="{ 'list-passanger-select': item._id == person._id }"
				@click="selectedPerson(item)"
			>
				<b-row>
					<b-col cols="10" class="text-left">
						<div v-if="item.avatar" class="d-inline-block">
							<b-link :href="setAvatarlist(item.avatar)" target="_blank">
								<b-img
									v-bind="mainProps"
									rounded="circle"
									style="border: 1px solid #6bb2a0"
									alt="Circle image"
									:src="setAvatarlist(item.avatar)"
								></b-img>
							</b-link>
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
<style lang="css">
.list-passanger-select {
	background-color: black !important;
	color: white;
}
.modal-content {
	background-image: linear-gradient(80deg, #676b76, #676b76de, #676b76);
	font-family: 'Poppins', sans-serif;
	color: black;
}
.list-group {
	margin-bottom: 5px !important;
}
.list-passangers {
	border: none;
	border-radius: 0px 35px 0px 35px !important;
	background-color: #c1c5d1;
}
.list {
	max-height: 200px;
	overflow-y: scroll;
}
label,
h4,
h5,
h6,
h3 {
	color: white !important;
}
</style>
