<template>
	<div>
		<img
			class="google-icon"
			src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
			width="40"
			height="40"
		/>
		<a :href="google_auth_url"> Ingresa con google </a>
	</div>
</template>

<script>
import { google_auth_url } from '../../config/index';

export default {
	name: 'GoogleButton',
	data() {
		return {
			google_auth_url: google_auth_url,
		};
	},
};
</script>

<style scoped></style>
