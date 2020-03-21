<template>
	<v-container>
		<v-data-table :headers="headers" :items="placeForService.services" :items-per-page="5">
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
								<span class="headline">Servicio</span>
							</v-card-title>

							<v-card-text>
								<v-container>
									<v-row>
										<v-col cols="12" sm="6" md="4">
											<v-text-field
												v-model.trim="formData.name"
												label="Nombre"
											></v-text-field>
											<div v-if="$v.formData.name.$dirty" class="text-right">
												<small
													v-if="!$v.formData.name.required"
													class="text-danger"
												>
													Campo requerido
												</small>
												<small
													v-if="!$v.formData.name.minLength"
													class="text-danger"
												>
													Minimo 3 Caracteres
												</small>
												<small
													v-if="!$v.formData.name.maxLength"
													class="text-danger"
												>
													Maximo 50 Caracteres
												</small>
											</div>
										</v-col>
										<v-col cols="12" sm="6" md="4">
											<v-text-field
												v-model.number="formData.price"
												label="Precio"
											></v-text-field>
											<div v-if="$v.formData.price.$dirty" class="text-right">
												<small
													v-if="!$v.formData.name.required"
													class="text-danger"
												>
													Campo requerido
												</small>
											</div>
										</v-col>
									</v-row>
								</v-container>
							</v-card-text>
							<small v-if="errors" class="text-danger"
								>Llene el formulario correctamente</small
							>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn text @click="manageModal(false)">Cancelar</v-btn>
								<v-btn text :loading="loading" @click="submit">Guardar</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</v-toolbar>
			</template>
			<template v-slot:item.name="props">
				<div>{{ props.item.name }}</div>
				<v-edit-dialog
					:return-value.sync="props.item.name"
					large
					persistent
					:loading="loading"
					@save="editItem(props.item)"
				>
					<template v-slot:input>
						<v-text-field
							v-model.trim="props.item.name"
							label="Edit"
							single-line
							counter
						></v-text-field>
					</template>
				</v-edit-dialog>
			</template>
			<template v-slot:item.price="props">
				<div>{{ props.item.price }}</div>
				<v-edit-dialog
					:return-value.sync="props.item.price"
					large
					persistent
					@save="editItem(props.item)"
				>
					<template v-slot:input>
						<v-text-field
							v-model.number="props.item.price"
							label="Edit"
							single-line
							counter
						></v-text-field>
					</template>
				</v-edit-dialog>
			</template>
			<template v-slot:item.actions="{ item }">
				<v-btn small dark :loading="loading" @click="deleteItem(item)">
					<v-icon>
						mdi-delete
					</v-icon>
				</v-btn>
			</template>
		</v-data-table>
	</v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { validationMixin } from 'vuelidate';
import { minLength, maxLength, required } from 'vuelidate/lib/validators';

export default {
	name: 'PlaceServicesCRUD',
	mixins: [validationMixin],
	data() {
		return {
			formData: { name: '', price: '' },
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
				{ text: 'Acciones', value: 'actions', sortable: false },
			],
			errors: false,
			dialog: false,
		};
	},
	computed: {
		tableTitle() {
			return `Servicios de ${this.placeForService.name}`;
		},
		...mapGetters({
			loading: 'Place/loading',
			placeForService: 'Place/placeForService',
		}),
	},
	validations: {
		formData: {
			name: {
				required,
				minLength: minLength(3),
				maxLength: maxLength(50),
			},
			price: {
				required,
			},
		},
	},
	methods: {
		manageModal(state) {
			this.dialog = state;
		},
		submit() {
			const nameExist = this.checkRepeatedServiceName(this.formData.name);
			if (!nameExist) {
				if (this.$v.$invalid) {
					this.errors = true;
				} else {
					this.createService({
						payload: this.formData,
						placeId: this.placeForService.id,
					});
					this.resetFormData();
					this.manageModal(false);
					this.$v.$reset();
					this.errors = false;
				}
			} else {
				this.$toasted.error('No se permiten nombres duplicados');
			}
		},
		resetFormData() {
			this.formData = { name: '', price: '' };
		},
		editItem(item) {
			this.updateService({ payload: item, placeId: this.placeForService.id });
		},
		deleteItem(item) {
			this.deleteService({ serviceId: item._id, placeId: this.placeForService.id });
			this.placeForService.services = this.placeForService.services.filter(
				service => service !== item
			);
		},
		checkRepeatedServiceName(name) {
			const found = this.placeForService.services.find(service => service.name === name);
			if (found) return true;
			else return false;
		},
		...mapActions({
			createService: 'Place/createService',
			updateService: 'Place/updateService',
			deleteService: 'Place/deleteService',
		}),
	},
};
</script>

<style scoped></style>
