<template lang="html">
	<b-container>
		<b-row class="justify-content-center">
			<b-col cols="12" md="10" lg="8" class="background-module py-3">
				<b-row>
					<b-col>
						<h4 class="my-5">
							Gestión de <span style="color: orange">Habitaciones</span>
						</h4>
					</b-col>
				</b-row>
				<b-row class="mb-5 text-left">
					<b-col cols="12" class="mb-3"><h6>Agregar nuevo</h6></b-col>
					<b-col cols="12" md="4">
						<label for="name" class="mb-0">
							<small>
								Nombre de la Habitación
							</small>
						</label>
						<b-form-input
							id="name"
							v-model.trim="$v.form.name.$model"
							placeholder="Ej: N°1"
						></b-form-input>
						<div v-if="$v.form.name.$dirty" class="text-right">
							<small v-if="!$v.form.name.required" class="text-danger">
								Campo requerido
							</small>
						</div>
					</b-col>
					<b-col cols="12" md="5">
						<label for="max" class="mb-0">
							<small>Cantidad máxima de pasajeros</small>
						</label>
						<b-form-input
							id="max"
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
					<b-col cols="12" md="3" class="mt-2">
						<b-button block class="col-12 mt-3" @click="onsubmit()">
							Guardar
						</b-button>
						<small v-if="errors" class="mt-2 d-block text-danger">
							Debe llenar el formulario correctamente
						</small>
					</b-col>
				</b-row>
				<template v-if="hasRooms">
					<b-row
						style="max-height: 150px; overflow-y: auto;"
						class="background-into-module mr-2 mb-3"
					>
						<b-col>
							<table class="table table-bordered table-hover">
								<thead>
									<tr>
										<th>Nombre del turno</th>
										<th>Cantidad máx. de pasajeros</th>
										<th>Eliminar</th>
									</tr>
								</thead>
								<tbody>
									<tr
										v-for="(room, index) in rooms"
										:key="index"
										class="p-0"
										@click="selectRoom(room.id)"
									>
										<td class="p-0 align-middle">{{ room.name }}</td>
										<td class="p-0 align-middle">
											{{ room.numberPassangerMax }}
										</td>
										<td class="p-0 align-middle">
											<b-button
												variant="danger"
												@click="
													deleteRoom({
														id: room.id,
														placeId: idPlace,
													})
												"
											>
												X
											</b-button>
										</td>
									</tr>
								</tbody>
							</table>
						</b-col>
					</b-row>
				</template>
				<template v-else><h6 class="m-5">Vacio</h6></template>
				<b-row class="mb-3">
					<b-col cols="6" offset="6">
						<b-form-input
							v-model="filterRoomWord"
							size="sm"
							placeholder="Filtrar turno"
							@keyup="filterRoom(filterRoomWord)"
						></b-form-input>
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
	props: {
		idPlace: {
			type: String,
			required: true,
		},
	},
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
		hasRooms() {
			return Array.isArray(this.rooms) && this.rooms.length;
		},
		...mapGetters({
			rooms: 'Room/rooms',
			roomSelected: 'Room/roomSelected',
			message: 'Room/message',
			placeLodging: 'Lodging/places',
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
		this.setIdPlaceRoom(this.idPlace);
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
