<template lang="html">
	<b-container>
		<b-row id="nav" class="justify-content-center">
			<b-col md="8" lg="6" class="background-module pb-3 px-4">
				<h3 class="my-4">Gestión de habitaciones</h3>
				<b-row class="mb-3">
					<b-col cols="6">
						<b-form-input
							v-model="filterRoomWord"
							size="sm"
							placeholder="Filtrar habitación"
							@keyup="filterRoom(filterRoomWord)"
						></b-form-input>
					</b-col>
				</b-row>
				<b-row
					style="max-height: 150px; overflow-y: auto;"
					class="background-into-module mr-2 mb-3"
				>
					<b-col>
						<table class="table table-bordered table-hover">
							<thead>
								<tr>
									<th>Nombre habitación</th>
									<th>Cantidad máx. de pasajeros</th>
									<th>Eliminar</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="(r, index) in rooms"
									:key="index"
									@click="selectRoom(r.id)"
								>
									<td>{{ r.name }}</td>
									<td>{{ r.numberPassangerMax }}</td>
									<td class="p-2">
										<b-button
											variant="danger"
											@click="deleteRoom({ id: r.id, placeId: form.idPlace })"
										>
											X
										</b-button>
									</td>
								</tr>
							</tbody>
						</table>
					</b-col>
				</b-row>
				<b-row class="mb-3">
					<b-col>
						<h4>Ingresar nueva habitación</h4>
					</b-col>
				</b-row>
				<b-row class="mb-3">
					<b-col>
						Nombre habitación
						<b-form-input
							v-model.trim="$v.form.name.$model"
							placeholder="Ej: N°1"
						></b-form-input>
						<div v-if="$v.form.name.$dirty" class="text-right">
							<small v-if="!$v.form.name.required" class="text-danger">
								Campo requerido
							</small>
						</div>
					</b-col>
					<b-col lg="6">
						Cantidad máxima de pasajeros
						<b-form-input
							v-model="$v.form.numberPassangerMax.$model"
							type="number"
							placeholder="Ej: 5"
						></b-form-input>
						<div v-if="$v.form.numberPassangerMax.$dirty" class="text-right">
							<small v-if="!$v.form.numberPassangerMax.required" class="text-danger">
								Campo requerido
							</small>
						</div>
					</b-col>
				</b-row>
				<b-row class="mb-3">
					<b-col>
						<b-button block variant="primary" class="col-12" @click="onsubmit()">
							Finalizar creación
						</b-button>
						<small v-if="errors" class="mt-2 d-block text-danger">
							Debe llenar el formulario correctamente
						</small>
					</b-col>
				</b-row>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
	name: 'Room',
	mixins: [validationMixin],
	data() {
		return {
			errors: '',
			form: {
				name: '',
				numberPassangerMax: '',
			},
			filterRoomWord: '',
		};
	},
	computed: {
		...mapGetters({
			rooms: 'Room/rooms',
			roomSelected: 'Room/roomSelected',
			message: 'Room/message',
			placeLodging: 'Lodging/places',
			idPlace: 'Room/idPlace',
		}),
	},
	watch: {
		message(newVal) {
			this.$toasted.show(newVal.text, {
				type: newVal.type,
			});
		},
	},
	mounted() {
		this.setIdPlaceRoom(this.placeLodging);
		this.fetchRooms(this.idPlace);
	},
	validations: {
		form: {
			name: {
				required,
			},
			numberPassangerMax: {
				required,
			},
		},
	},
	methods: {
		onsubmit() {
			// validations
			this.$v.$touch();
			if (this.$v.$invalid) {
				this.errors = true;
			} else {
				this.createRoom(this.form).then(() => {
					this.clearInputs();
					this.$v.$reset();
				});
			}
		},
		clearInputs() {
			this.form.name = '';
			this.form.numberPassangerMax = '';
		},
		...mapActions({
			fetchRooms: 'Room/fetchRooms',
			createRoom: 'Room/createRoom',
			deleteRoom: 'Room/deleteRoom',
		}),
		...mapMutations({
			selectRoom: 'Room/selectRoom',
			filterRoom: 'Room/filterRoom',
			setIdPlaceRoom: 'Room/setIdPlaceRoom',
		}),
	},
};
</script>

<style lang="css" scoped></style>
