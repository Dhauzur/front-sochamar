<template lang="html">
	<b-alert
		:show="dismissCountDown"
		dismissible
		variant="warning"
		@dismissed="dismissCountDown = 0"
		@dismiss-count-down="countDownChanged"
	>
		<p>{{ errorMessage }}</p>
		<b-progress
			variant="warning"
			:max="dismissSecs"
			:value="dismissCountDown"
			height="4px"
		></b-progress>
	</b-alert>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	data() {
		return {
			dismissSecs: 20,
			dismissCountDown: 0,
			showDismissibleAlert: false,
		};
	},
	computed: {
		...mapGetters({
			errorMessage: 'Lodging/errorMessage',
		}),
	},
	mounted() {
		this.dismissCountDown = this.dismissSecs;
	},
	methods: {
		countDownChanged(dismissCountDown) {
			this.dismissCountDown = dismissCountDown;
		},
	},
};
</script>

<style lang="css" scoped></style>
