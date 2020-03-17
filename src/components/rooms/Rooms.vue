<template lang="html">
	<v-card class="mx-auto" outlined :loading="loading">
		<v-list-item three-line>
			<v-list-item-content>
				<div class="headline mb-4">
					Gestión de Habitaciones
				</div>
				<v-list-item-title class="overline mb-1">Agregar nueva</v-list-item-title>
			</v-list-item-content>
		</v-list-item>
		<v-card-actions>
			<v-container>
				<v-row>
					<v-col cols="12" md="4">
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
					<v-col cols="12" md="4">
						<v-text-field
							v-model="$v.form.numberPassangerMax.$model"
							label="Cant. máxima de personas"
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
					<v-col cols="12" md="4" class="mt-2">
						<v-btn
							small
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
				<v-row v-if="Boolean(rooms)">
					<v-col cols="12" md="8" class="mt-5 text-left">
						Lista de Habitaciones
					</v-col>
					<v-col cols="12" md="4">
						<v-text-field
							v-model="filterRoomWord"
							dense
							outlined
							rounded
							append-icon="mdi-magnify"
							label="Filtrar"
							hide-details
						></v-text-field>
					</v-col>
					<v-col>
						<v-data-table
							:search="filterRoomWord"
							:headers="fields"
							:items="rooms"
							:items-per-page="5"
						>
							<template v-slot:item.actions="{ item }">
								<v-icon
									color="error"
									small
									@click="
										deleteRoom({
											id: item.id,
											placeId: idPlace,
										})
									"
								>
									mdi-delete
								</v-icon>
							</template>
						</v-data-table>
					</v-col>
				</v-row>
			</v-container>
		</v-card-actions>
	</v-card>
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
			fields: [
				{ value: 'name', text: 'Nombre del turno' },
				{ value: 'numberPassangerMax', text: 'Cant. Max de personas' },
				{ value: 'actions', text: 'Acción' },
			],
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
			!this.$v.form.name.required && errors.push('El nombre es querido');
			return errors;
		},
		maxPersonsErrors() {
			const errors = [];
			if (!this.$v.form.numberPassangerMax.$dirty) return errors;
			!this.$v.form.numberPassangerMax.required && errors.push('Campo es querido');
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
			setIdPlaceRoom: 'Room/setIdPlaceRoom',
		}),
	},
};
</script>
