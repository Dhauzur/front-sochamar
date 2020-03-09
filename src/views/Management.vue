<template>
	<b-row id="nav">
		<b-col>
			<b-tabs pills>
				<b-tab id="lodging-btn" title="Actividades" active>
					<Lodging />
				</b-tab>
				<b-tab id="place-btn" title="Lugares"> <Place /> </b-tab>
				<template v-slot:tabs-end>
					<b-nav-item
						id="show-btn"
						href="#"
						@click.prevent="$bvModal.show('persons-modal')"
						>Personas
						<b-modal id="persons-modal" hide-footer>
							<template v-slot:modal-title>Personas</template>
							<div class="d-block text-center">
								<persons-form />
							</div> </b-modal
					></b-nav-item>
				</template>
				<persons-dialog />
			</b-tabs>
		</b-col>
	</b-row>
</template>

<script>
import Lodging from '../components/lodgings/Lodging';
import Place from '../components/places/Place';
import PersonsForm from '../components/persons/PersonsForm';

export default {
	components: {
		Lodging,
		Place,
		PersonsForm,
	},
};
</script>

<style lang="css">
.modal-content {
	max-height: 90vh;
	overflow-y: auto;
}
</style>
