<template>
	<v-avatar :color="randomColors">
		<img v-if="Boolean(url)" :src="url" alt="avatar" />
		<span v-else class="white--text headline text-uppercase">
			{{ initials }}
		</span>
		<v-progress-circular
			v-if="loading"
			style="position: absolute;"
			indeterminate
			color="primary"
		></v-progress-circular>
	</v-avatar>
</template>

<script>
export default {
	props: {
		name: {
			type: String,
			default: '',
		},
		lastName: {
			type: String,
			default: '',
		},
		url: {
			type: String,
			default: '',
		},
		loading: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			colors: [
				'red',
				'blue',
				'green',
				'indigo',
				'purple',
				'teal',
				'orange',
				'brown',
				'deep-orange',
				'blue-grey',
				'cyan',
			],
			currentColor: '',
		};
	},
	computed: {
		initials() {
			if (this.name)
				return `${this.name.substr(0, 1)}${this.lastName && this.lastName.substr(0, 1)}`;
			return '';
		},
		randomColors() {
			return this.colors[Math.floor(Math.random() * this.colors.length)];
		},
	},
};
</script>
