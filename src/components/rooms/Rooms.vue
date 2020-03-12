<template lang="html">
	<v-row justify="center">
		<v-col cols="9">
			<v-card class="mx-auto" outlined :loading="loading">
				<v-list-item three-line>
					<v-list-item-content>
						<div class="overline mb-4">
							Gestión de <span style="color: orange">Habitaciones</span>
						</div>
						<v-list-item-title class="headline mb-1">Agregar nueva</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-card-actions>
					<v-container>
						<v-row>
							<v-col>
								<v-text-field
									v-model="$v.form.name.$model"
									label="Nombre de la Habitación"
									placeholder="N-1"
									outlined
									dense
									rounded
									:error-messages="nameErrors"
									@input="$v.form.name.$touch()"
									@blur="$v.form.name.$touch()"
								></v-text-field>
							</v-col>
							<v-col>
								<v-text-field
									v-model="$v.form.numberPassangerMax.$model"
									label="Cantidad máxima de pasajeros"
									outlined
									dense
									rounded
									type="number"
									placeholder="4"
									:error-messages="maxPersonsErrors"
									@input="$v.form.numberPassangerMax.$touch()"
									@blur="$v.form.numberPassangerMax.$touch()"
								></v-text-field>
							</v-col>
							<v-col>
								<v-btn
									rounded
									block
									color="primary"
									:loading="loading"
									@click="onsubmit()"
								>
									Guardar
								</v-btn>
							</v-col>
						</v-row>
						<v-row>
							<v-col>
								<v-simple-table>
									<template v-slot:default>
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
													<v-icon
														color="error"
														small
														@click="
															deleteRoom({
																id: room.id,
																placeId: idPlace,
															})
														"
													>
														mdi-delete
													</v-icon>
												</td>
											</tr>
										</tbody>
									</template>
								</v-simple-table>
							</v-col>
						</v-row>
					</v-container>
				</v-card-actions>
			</v-card>
		</v-col>
	</v-row>
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
		nameErrors() {
			const errors = [];
			if (!this.$v.form.name.$dirty) return errors;
			!this.$v.form.name.required && errors.push('El monto es querido');
			return errors;
		},
		maxPersonsErrors() {
			const errors = [];
			if (!this.$v.form.numberPassangerMax.$dirty) return errors;
			!this.$v.form.numberPassangerMax.required && errors.push('El monto es querido');
			return errors;
		},
		hasRooms() {
			return Array.isArray(this.rooms) && this.rooms.length;
		},
		...mapGetters({
			loading: 'Room/loading',
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
