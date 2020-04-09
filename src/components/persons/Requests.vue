<template>
	<v-alert v-model="alert" elevation="24" prominent border="left" colored-border color="primary">
		<v-row align="center">
			<v-col class="grow">
				La empresa Fulanito te ha enviado una solicitud para unirte a su grupo.
			</v-col>
			<v-col class="shrink">
				<v-btn fab x-small color="success">
					<v-icon>mdi-check-bold</v-icon>
				</v-btn>
			</v-col>
			<v-col class="shrink">
				<v-btn v-if="alert" fab x-small color="error" @click="alert = false">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-col>
		</v-row>
	</v-alert>
</template>

<script>
export default {
	data() {
		return {
			alert: true,
		};
	},
};
</script>
