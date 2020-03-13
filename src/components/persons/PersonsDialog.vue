<template>
	<v-button id="show-btn" @click="$bvModal.show('persons-modal')"
		>Personas
		<v-tooltip target="show-btn" placement="bottom">Gestión de personas</v-tooltip>
		<v-modal id="persons-modal" hide-footer>
			<template v-slot:modal-title>Personas</template>
			<div class="d-block text-center"></div> </v-modal
	></v-button>
</template>
