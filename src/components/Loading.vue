<template lang="html">
	<div class="text-center">
		<div class="spinner-border mt-3" role="status">
			<span class="sr-only">Loading...</span>
		</div>
		<h5 class="m-3">{{ msj }}</h5>
	</div>
</template>

<script>
export default {
	props: { msj: { type: String } },
};
</script>
