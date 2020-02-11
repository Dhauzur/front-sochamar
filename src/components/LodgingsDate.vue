<template>
	<!-- date lodgings -->
	<b-form-group
		id="input-group-1"
		:label="label"
		label-for="input-1"
		description="Selecione la fecha que desea cambiar."
	>
		<b-form-input
			id="input-1"
			type="date"
			class="col-xs-2 "
			style="text-align: center; text-align-last:center;"
			required
			:value="date"
			@change="onchange"
		/>
	</b-form-group>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
	name: 'LodgingsDate',
	props: {
		isPassengerDate: {
			type: Boolean,
			required: false,
		},
		dateStart: {
			type: String,
			default: null,
			required: false,
		},
		dateEnd: {
			type: String,
			default: null,
			required: false,
		},
		setDate: {
			type: Function,
			default: () => {},
			required: false,
		},
		start: {
			type: Boolean,
			required: true,
		},
		label: {
			type: String,
			required: true,
			default: '',
		},
	},
	computed: {
		date() {
			return this.start ? this.dateStart : this.dateEnd;
		},
	},
	methods: {
		onchange(e) {
			if (!this.isPassengerDate) {
				if (this.start) {
					this.setDate(e);
					this.dateChange({ dateStart: e, dateEnd: this.dateEnd });
				} else {
					this.setDate(e);
					this.dateChange({ dateStart: this.dateStart, dateEnd: e });
				}
			}
		},
		...mapMutations({
			dateChange: 'Lodging/dateChange',
		}),
	},
};
</script>

<style lang="scss" scoped></style>
