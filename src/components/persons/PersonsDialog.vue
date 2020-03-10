<template>
	<b-button id="show-btn" @click="$bvModal.show('persons-modal')"
		>Personas
		<b-tooltip target="show-btn" placement="bottom">Gestión de personas</b-tooltip>
		<b-modal id="persons-modal" hide-footer>
			<template v-slot:modal-title>Personas</template>
			<div class="d-block text-center"></div> </b-modal
	></b-button>
</template>
