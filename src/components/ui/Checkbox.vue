<template>
	<PCheckbox color="primary" @change="onChange">
		{{ label }}
	</PCheckbox>
</template>

<script>
import PCheckbox from 'pretty-checkbox-vue/check';
import 'pretty-checkbox/dist/pretty-checkbox.min.css';

export default {
	name: 'Checkbox',
	components: {
		PCheckbox,
	},
	props: {
		label: {
			type: String,
			required: false,
		},
	},
	methods: {
		onChange(value) {
			this.$emit('change', value);
		},
	},
};
</script>
