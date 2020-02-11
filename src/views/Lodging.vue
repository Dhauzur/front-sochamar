<template>
	<b-row id="nav">
		<b-col class="background-module">
			<Loading v-if="loading" :msj="loading" />
			<template v-else>
				<b-row>
					<b-col md="6" lg="3">
						<b-row>
							<b-col class="my-2">
								<label>Selecione compañia</label>
								<b-form-select
									v-model="selectCompany"
									:options="companies"
									@change="setCompany"
								/>
							</b-col>
						</b-row>
						<b-row>
							<b-col v-if="lodgings.length == 0 && company" class="mb-2">
								<b-row>
									<b-col cols="12" md="3">
										<b-button
											variant="primary"
											class="col-12"
											@click="createOneLodging()"
										>
											Crear hospedaje
										</b-button>
									</b-col>
								</b-row>
							</b-col>
						</b-row>
						<b-row>
							<b-col v-if="getMirrorLodging || editMode" class="mb-2">
								<button
									type="button"
									class="btn btn-primary btn-block"
									@click="saveLodging()"
								>
									Guardar
								</button>
							</b-col>
						</b-row>
						<b-row>
							<b-col md="6" lg="6" class="mb-2">
								<b-dropdown id="dropdown-1" text="Acciones" block>
									<b-dropdown-item v-if="company" @click="createOneLodging()"
										>Agregar hospedaje</b-dropdown-item
									>
									<b-dropdown-item @click="$router.push({ name: 'habitaciones' })"
										>Gestionar habitaciones</b-dropdown-item
									>
									<b-dropdown-item @click="$router.push({ name: 'compañias' })"
										>Gestionar compañias</b-dropdown-item
									>
								</b-dropdown>
							</b-col>
							<b-col md="4" lg="6">
								<PassengersDialog />
							</b-col>
						</b-row>
					</b-col>
				</b-row>
				<b-row>
					<b-col cols="12" xl="8">
						<b-row>
							<b-col cols="12">
								<timeline
									v-if="rooms.length > 0 && lodgings.length > 0"
									class="p-2 col-12"
									:items="lodgings"
									:events="['rangechanged', 'click']"
									:groups="rooms"
									:options="options"
									@click="enableEdit"
									@rangechanged="rangechanged"
								/>
							</b-col>
							<b-col v-if="prices && company" cols="12" class="px-4 overflow-auto">
								<table class="table table-bordered ">
									<thead>
										<tr>
											<td>Actividad</td>
											<td>Precios</td>
											<td v-for="(d, index) in rangeDateTable" :key="index">
												{{ d.numberDay }}
												<br />
												{{ d.nameDay }}
											</td>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>ALOJAMIENTO</td>
											<td v-if="company">
												{{ prices.prices[3] }}
											</td>
											<td v-for="(p, index) in proyectionTable" :key="index">
												<span v-if="!editMode">{{
													p.service.accommodation
												}}</span>
												<input
													v-if="
														editMode && p.service.accommodation !== null
													"
													:id="p.id + ',' + p.date"
													v-model="p.service.accommodation"
													type="number"
													class="inputService"
													name="accommodation"
													:placeholder="p.service.accommodation"
													@change="detectInputChange"
												/>
											</td>
										</tr>
										<tr>
											<td>DESAYUNO</td>
											<td v-if="company">
												{{ prices.prices[0] }}
											</td>
											<td v-for="(p, index) in proyectionTable" :key="index">
												<span v-if="!editMode">{{
													p.service.breakfast
												}}</span>
												<input
													v-if="editMode && p.service.breakfast !== null"
													:id="p.id + ',' + p.date"
													v-model="p.service.breakfast"
													type="number"
													class="inputService"
													name="breakfast"
													:placeholder="p.service.breakfast"
													@change="detectInputChange"
												/>
											</td>
										</tr>
										<tr>
											<td>ALMUERZO</td>
											<td v-if="company">
												{{ prices.prices[1] }}
											</td>
											<td v-for="(p, index) in proyectionTable" :key="index">
												<span v-if="!editMode">{{ p.service.lunch }}</span>
												<input
													v-if="editMode && p.service.lunch !== null"
													:id="p.id + ',' + p.date"
													v-model="p.service.lunch"
													type="number"
													class="inputService"
													name="lunch"
													:placeholder="p.service.lunch"
													@change="detectInputChange"
												/>
											</td>
										</tr>
										<tr>
											<td>CENA</td>
											<td v-if="company">
												{{ prices.prices[2] }}
											</td>
											<td v-for="(p, index) in proyectionTable" :key="index">
												<span v-if="!editMode">{{ p.service.dinner }}</span>
												<input
													v-if="editMode && p.service.dinner !== null"
													:id="p.id + ',' + p.date"
													v-model="p.service.dinner"
													type="number"
													class="inputService"
													name="dinner"
													:placeholder="p.service.dinner"
													@change="detectInputChange"
												/>
											</td>
										</tr>
										<tr v-if="company">
											<td colspan="2">TOTAL</td>
											<td v-for="(p, index) in proyectionTable" :key="index">
												{{ finalyPrice[index] }}
											</td>
										</tr>
									</tbody>
								</table>
							</b-col>
						</b-row>
					</b-col>
					<b-col cols="12" xl="4">
						<EditLodging v-if="lodgingSelect" />
					</b-col>
				</b-row>
				<b-row> </b-row>
			</template>
		</b-col>
	</b-row>
</template>

<script>
import { Timeline } from 'vue2vis';
import PassengersDialog from '../components/passengers/PassengersDialog';
import moment from 'moment';
import { mapGetters, mapMutations } from 'vuex';
import Loading from '@/components/Loading';
import EditLodging from '@/components/EditLodging';

export default {
	components: {
		Timeline,
		Loading,
		EditLodging,
		PassengersDialog,
	},
	data() {
		return {
			selectCompany: null,
			options: {
				stack: true,
				editable: true,
				start: moment(),
				end: moment().add(7, 'day'),
				zoomMin: 604800000,
				zoomMax: 5184000000,
				hiddenDates: {
					start: '2019-01-01 12:00:00',
					end: '2019-01-01 11:00:00',
					repeat: 'daily',
				},
				onUpdate: (item, callback) => {
					if (this.company) {
						this.setModeEdit(true);
						callback(item);
						this.$store.commit('Lodging/updateService', item);
					} else this.$toasted.show('Selecione una entidad primero');
				},
				onMoving: (item, callback) => {
					this.setModeEdit(false);
					if (this.company) callback(item);
					else this.$toasted.show('Selecione una entidad primero');
				},
				onRemove: (item, callback) => {
					if (this.lodgings.length > 1 && this.company) {
						this.setModeEdit(false);
						this.$store.dispatch('Lodging/deleteLodging', item);
						callback(item);
					} else this.$toasted.show('Selecione una entidad primero');
				},
				onAdd: (item, callback) => {
					if (this.company) {
						this.setModeEdit(false);
						item.start = moment(item.start).hours(16);
						item.end = moment(item.start)
							.hours(12)
							.add(1, 'day');
						var company = this.companies.find(c => c.value == this.company).text;
						item.content = company;
						if (company != 'Turismo') item.service = ['[[1,1,1,1],[1,1,1,1]]'];
						else item.service = ['[[0,0,0,0],[0,0,0,0]]'];
						var timestamp = new Date().getTime().toString(16);
						timestamp +
							'xxxxxxxxxxxxxxxx'
								.replace(/[x]/g, function() {
									return ((Math.random() * 16) | 0).toString(16);
								})
								.toLowerCase();
						item.id = timestamp;
						this.$store.commit('Lodging/addLodging', item);
						if (!this.lodgings.get(item.id)) callback(item);
					} else this.$toasted.show('Selecione una entidad primero');
				},
				onMove: (item, callback) => {
					if (this.company) {
						var service = [];
						var numberDays = moment(item.end).diff(
							moment(item.start).format('YYYY-MM-DD'),
							'days'
						);
						var oldService = JSON.parse(item.service[0]);
						for (var i = 0; i <= numberDays; i++)
							service.push([
								oldService[i] ? oldService[i][0] : 1,
								oldService[i] ? oldService[i][1] : 1,
								oldService[i] ? oldService[i][2] : 1,
								oldService[i] ? oldService[i][3] : 1,
							]);
						var itemService = [];
						itemService.push(JSON.stringify(service));
						item.service = itemService;
						item.start = moment(item.start).hours(16);
						item.end = moment(item.end).hours(12);
						this.setModeEdit(true);
						this.updateService(item);
						callback(item);
					} else this.$toasted.show('Selecione una entidad primero');
				},
			},
		};
	},
	computed: {
		...mapGetters({
			message: 'Lodging/message',
			updatingService: 'Lodging/updatingService',
			mirrorLodging: 'Lodging/mirrorLodging',
			lodgingSelect: 'Lodging/lodgingSelect',
			loading: 'Lodging/loading',
			rooms: 'Lodging/rooms',
			rangeDate: 'Lodging/rangeDate',
			lodgings: 'Lodging/lodgings',
			companies: 'Lodging/companies',
			company: 'Lodging/company',
			editMode: 'Lodging/editMode',
		}),
		getMirrorLodging() {
			var hola = JSON.stringify(this.lodgings);
			if (hola == this.mirrorLodging) return false;
			else return true;
		},
		finalyPrice() {
			var prices = [];
			var dayPrice = 0;
			if (this.company)
				this.proyectionTable.forEach(dailyService => {
					dayPrice =
						(dailyService.service.breakfast
							? dailyService.service.breakfast * this.prices.prices[0]
							: 0) +
						(dailyService.service.lunch
							? dailyService.service.lunch * this.prices.prices[1]
							: 0) +
						(dailyService.service.dinner
							? dailyService.service.dinner * this.prices.prices[2]
							: 0) +
						(dailyService.service.accommodation
							? dailyService.service.accommodation * this.prices.prices[3]
							: 0);
					if (dayPrice == '0000') dayPrice = 0;
					prices.push(dayPrice);
				});
			return prices;
		},
		prices() {
			if (this.company) return this.companies.find(c => c.value == this.company);
			else return [];
		},
		proyectionTable() {
			// eslint-disable-next-line no-unused-vars
			var proyectionTable = [];
			var daysLodging = [];
			var numberDays = this.rangeDate.end.diff(this.rangeDate.start, 'days');
			for (var i = 0; i <= numberDays; i++)
				daysLodging.push({
					date: moment(this.rangeDate.start)
						.add(i, 'day')
						.format('YYYY-MM-DD'),
					service: [],
					id: null,
				});

			// eslint-disable-next-line no-unused-vars
			this.lodgings.forEach((l, il) => {
				var index = 0;
				if (!this.editMode)
					daysLodging.forEach(day => {
						if (
							moment(day.date).isSameOrAfter(moment(l.start).format('YYYY-MM-DD')) &&
							moment(day.date).isSameOrBefore(moment(l.end).format('YYYY-MM-DD'))
						) {
							if (
								!this.company &&
								this.companies.find(c => c.value == l.company).text == 'Turismo'
							) {
								var numberPassangerMax = this.rooms.get(l.group).numberPassangerMax;
								day.service = {
									breakfast: day.service.breakfast
										? numberPassangerMax + day.service.breakfast
										: numberPassangerMax,
									lunch: day.service.lunch
										? numberPassangerMax + day.service.lunch
										: numberPassangerMax,
									dinner: day.service.dinner
										? numberPassangerMax + day.service.dinner
										: numberPassangerMax,
									accommodation: day.service.accommodation
										? numberPassangerMax + day.service.accommodation
										: numberPassangerMax,
								};
							} else {
								var service = JSON.parse(l.service[0]);
								day.service = {
									breakfast: day.service.breakfast
										? service[index][0] + day.service.breakfast
										: service[index][0],
									lunch: day.service.lunch
										? service[index][1] + day.service.lunch
										: service[index][1],
									dinner: day.service.dinner
										? service[index][2] + day.service.dinner
										: service[index][2],
									accommodation: day.service.accommodation
										? service[index][3] + day.service.accommodation
										: service[index][3],
								};
							}
							index++;
						}
					});
				if (this.lodgingSelect)
					if (this.editMode && this.lodgingSelect.id == l.id) {
						daysLodging.forEach(day => {
							if (
								moment(day.date).isSameOrAfter(
									moment(l.start).format('YYYY-MM-DD')
								) &&
								moment(day.date).isSameOrBefore(moment(l.end).format('YYYY-MM-DD'))
							) {
								var service = JSON.parse(l.service[0]);
								day.service = {
									breakfast: day.service.breakfast
										? service[index][0] + day.service.breakfast
										: service[index][0],
									lunch: day.service.lunch
										? service[index][1] + day.service.lunch
										: service[index][1],
									dinner: day.service.dinner
										? service[index][2] + day.service.dinner
										: service[index][2],
									accommodation: day.service.accommodation
										? service[index][3] + day.service.accommodation
										: service[index][3],
								};
								day.id = l.id;
								index++;
							}
						});
					}
			});
			return daysLodging;
		},
		rangeDateTable() {
			var dates = [];
			var numberDays = this.rangeDate.end.diff(this.rangeDate.start, 'days');
			// if(numberDays >= 7) numberDays = 7
			for (var i = 0; i <= numberDays; i++)
				dates.push({
					numberDay: moment(this.rangeDate.start)
						.add(i, 'day')
						.format('DD MMM'),
					nameDay: moment(this.rangeDate.start)
						.add(i, 'day')
						.format('ddd'),
				});
			return dates;
		},
	},
	watch: {
		message(newVal) {
			this.$toasted.show(newVal.text, {
				type: newVal.type,
			});
		},
	},
	created() {
		this.selectCompany = this.company;
		this.$store.dispatch('Lodging/fetchCompany');
		this.setRangeDate({
			start: moment(),
			end: moment().add(15, 'day'),
		});
	},
	methods: {
		setCompany(payload) {
			this.setCompanyLodging(payload);
			this.setModeEdit(false);
			this.$store.dispatch('Lodging/fetchLodgings');
		},
		detectInputChange(payload) {
			if (payload.target.value == '' || payload.target.value == 0) payload.target.value = 0;
			var numberPassangerMax = this.rooms.get(this.lodgingSelect.group).numberPassangerMax;
			if (payload.target.value > numberPassangerMax) {
				this.$toasted.show('Cantidad máxima de la habitación excedida');
				payload.target.value = numberPassangerMax;
			}
			if (payload.target.value < 0) payload.target.value = numberPassangerMax;
			this.updateService(payload.target);
		},
		enableEdit(payload) {
			if (this.company && payload.item) {
				this.setLodgingSelect(payload.item);
				this.setModeEdit(true);
			} else this.setModeEdit(false);
		},
		saveLodging() {
			if (this.company) this.$store.dispatch('Lodging/saveLodgings');
		},
		rangechanged(payload) {
			if (payload) {
				this.setRangeDate({
					start: moment(payload.start),
					end: moment(payload.end),
				});
			}
		},
		...mapMutations({
			createOneLodging: 'Lodging/createOneLodging',
			addLodging: 'Lodging/addLodging',
			setLodgingSelect: 'Lodging/setLodgingSelect',
			setRangeDate: 'Lodging/setRangeDate',
			updateService: 'Lodging/updateService',
			setCompanyLodging: 'Lodging/setCompanyLodging',
			saveLodgings: 'Lodging/saveLodgings',
			setModeEdit: 'Lodging/setModeEdit',
		}),
	},
};
</script>

<style lang="css">
.vis-foreground .vis-group {
	border: 1px solid #ffffff7a;
}
.vis-time-axis .vis-grid.vis-odd {
	background: #ffffff7a;
}
.vis-time-axis .vis-grid.vis-saturday,
.vis-time-axis .vis-grid.vis-sunday {
	background: #ffffff7a;
}
.vis-time-axis .vis-text.vis-saturday,
.vis-time-axis .vis-text.vis-sunday {
	color: white;
}
.inputService {
	max-width: 60px;
}

.vis-item {
	border-color: #2e4052;
	border-width: 2px;
	background-color: #e6e9ec;
}
td,
th {
	padding: 2px !important;
	color: #1c1e21;
	min-width: 60px;
}
</style>
