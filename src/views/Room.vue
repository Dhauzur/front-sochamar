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
										<b-button variant="danger" @click="deleteRoom(r.id)">
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
						<b-form-input v-model="form.name" placeholder="Ej: N°1"></b-form-input>
					</b-col>
					<b-col lg="6">
						Cantidad máxima de pasajeros
						<b-form-input
							v-model="form.numberPassangerMax"
							placeholder="Ej: 5"
						></b-form-input>
					</b-col>
				</b-row>
				<b-row class="mb-3">
					<b-col>
						<b-button block variant="primary" class="col-12" @click="createRoom(form)">
							Finalizar creación
						</b-button>
					</b-col>
				</b-row>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
	data() {
		return {
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
		this.fetchRooms();
	},
	methods: {
		...mapActions({
			fetchRooms: 'Room/fetchRooms',
			createRoom: 'Room/createRoom',
			deleteRoom: 'Room/deleteRoom',
		}),
		...mapMutations({
			selectRoom: 'Room/selectRoom',
			filterRoom: 'Room/filterRoom',
		}),
	},
};
</script>

<style lang="css" scoped></style>
