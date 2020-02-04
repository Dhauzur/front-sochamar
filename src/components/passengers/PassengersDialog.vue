<template>
	<div>
		<b-button id="show-btn" @click="$bvModal.show('passengers-modal')">Pasajeros</b-button>
		<b-tooltip target="show-btn" placement="bottom">Ver o agregar pasajeros</b-tooltip>
		<b-modal id="passengers-modal" hide-footer>
			<template v-slot:modal-title>Pasajeros</template>
			<div class="d-block text-center">
				<PassengersForm />
			</div>
		</b-modal>
	</div>
</template>

<script>
import PassengersForm from './PassengersForm';

export default {
	components: { PassengersForm },
};
</script>

<style lang="scss" scoped></style>
