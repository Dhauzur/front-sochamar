<template>
	<b-button id="show-btn" @click="$bvModal.show('passengers-modal')"
		>Personas
		<b-tooltip target="show-btn" placement="bottom">Gestión de personas</b-tooltip>
		<b-modal id="passengers-modal" hide-footer>
			<template v-slot:modal-title>Personas</template>
			<div class="d-block text-center">
				<PassengersForm />
			</div> </b-modal
	></b-button>
</template>

<script>
import PassengersForm from './PassengersForm';

export default {
	components: { PassengersForm },
};
</script>

<style lang="css">
.modal-content {
	max-height: 90vh;
	overflow-y: auto;
}
</style>
