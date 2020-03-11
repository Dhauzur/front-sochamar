<template>
	<v-container>
		<v-data-table :headers="headers" :items="placeServices">
			<template v-slot:top>
				<v-toolbar flat color="white">
					<v-toolbar-title v-text="tableTitle"></v-toolbar-title>
					<v-divider class="mx-4" inset vertical></v-divider>
					<v-spacer></v-spacer>
					<!--FORM MODAL-->
					<v-dialog v-model="dialog" max-width="500px">
						<template v-slot:activator="{ on }">
							<v-btn color="primary" dark class="mb-2" v-on="on"
								>Nuevo Servicio</v-btn
							>
						</template>
						<v-card>
							<v-card-title>
								<span class="headline">Modal</span>
							</v-card-title>

							<v-card-text>
								<v-container>
									<v-row>
										<v-col cols="12" sm="6" md="4">
											<v-text-field
												v-model.trim="formData.name"
												label="Nombre"
											></v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="4">
											<v-text-field
												v-model.number="formData.price"
												label="Precio"
											></v-text-field>
										</v-col>
									</v-row>
								</v-container>
							</v-card-text>

							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="blue darken-1" text @click="manageModal(false)"
									>Cancelar</v-btn
								>
								<v-btn
									color="blue darken-1"
									text
									:disabled="loading"
									@click="handleSave"
									>Guardar</v-btn
								>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</v-toolbar>
			</template>
			<template v-slot:item.actions="{ item }">
				<v-icon small class="mr-2" @click="editItem(item)">
					mdi-pencil
				</v-icon>
				<v-icon small @click="deletePlaceService(item._id)">
					mdi-delete
				</v-icon>
			</template>
		</v-data-table>
	</v-container>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
export default {
	name: 'PlaceServices',
	data() {
		return {
			formData: { _id: '', name: '', price: '' },
			headers: [
				{
					text: 'Nombre',
					align: 'start',
					sortable: false,
					value: 'name',
				},
				{
					text: 'Precio',
					sortable: true,
					value: 'price',
				},
				{ text: 'Actions', value: 'actions', sortable: false },
			],
			placeId: this.$route.params.placeId,
			dialog: false,
		};
	},
	computed: {
		tableTitle() {
			return `Servicios de nombre Place`;
		},
		...mapGetters({
			placeServices: 'PlaceServices/placeServices',
			message: 'PlaceServices/message',
			loading: 'PlaceServices/loading',
		}),
	},
	watch: {
		message(newVal) {
			this.$toasted.show(newVal.text, {
				type: newVal.type,
			});
		},
	},
	created() {
		this.setPlaceId(this.placeId);
		this.fetchPlaceServices();
	},
	methods: {
		manageModal(state) {
			this.dialog = state;
		},
		handleSave() {
			/*Si _id esta presente, significa que estamos editando un servicio*/
			if (this.formData._id) {
				this.editPlaceService({
					formData: this.formData,
					placeServiceId: this.formData._id,
				});
			} else {
				this.savePlaceService({ formData: this.formData });
			}
			this.resetFormData();
			this.manageModal(false);
		},
		resetFormData() {
			this.formData = { _id: '', name: '', price: '' };
		},
		editItem(item) {
			this.formData = item;
			this.manageModal(true);
		},
		...mapActions({
			fetchPlaceServices: 'PlaceServices/fetchPlaceServices',
			savePlaceService: 'PlaceServices/savePlaceService',
			editPlaceService: 'PlaceServices/editPlaceService',
			deletePlaceService: 'PlaceServices/deletePlaceService',
		}),
		...mapMutations({
			setPlaceId: 'PlaceServices/setPlaceId',
		}),
	},
};
</script>

<style scoped></style>
