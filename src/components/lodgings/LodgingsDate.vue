<template>
	<v-text-field
		id="input-1"
		:label="label"
		type="date"
		required
		:value="date"
		:error-messages="error"
		@change="onchange"
	/>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
	name: 'LodgingsDate',
	props: {
		errorDate: {
			type: Function,
			required: false,
			default: () => false,
		},
		isPersonDate: {
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
	data() {
		return {
			error: '',
		};
	},
	computed: {
		date() {
			return this.start ? this.dateStart : this.dateEnd;
		},
	},
	methods: {
		onchange(e) {
			if (this.isPersonDate) {
				this.error = '';
				this.errorDate(false);
				if (this.start) {
					if (new Date(e).getTime() >= new Date(this.dateStart).getTime()) {
						this.setDate(e);
					} else {
						this.errorDate(true);
						this.error = 'La fecha no puede ser menor al alojamiento';
					}
				} else {
					if (new Date(e).getTime() <= new Date(this.dateEnd).getTime()) {
						this.setDate(e);
					} else {
						this.errorDate(true);
						this.error = 'La fecha no puede ser mayor alojamiento';
					}
				}
			} else {
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
