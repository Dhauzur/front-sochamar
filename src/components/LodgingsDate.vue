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
			v-model="date"
			type="date"
			class="col-xs-2 "
			style="text-align: center; text-align-last:center;"
			required
			@input="setDate(date)"
			@change="dateChange({ dateStart, dateEnd })"
		/>
		{{ dateStart }} {{ dateEnd }}
	</b-form-group>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
	name: 'LodgingsDate',
	props: {
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
	data() {
		return {
			inputDate: null,
		};
	},
	computed: {
		date() {
			return this.start ? this.dateStart : this.dateEnd;
		},
	},
	methods: {
		...mapMutations({
			dateChange: 'Lodging/dateChange',
		}),
	},
};
</script>

<style lang="scss" scoped></style>
