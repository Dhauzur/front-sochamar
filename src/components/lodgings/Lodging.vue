<template>
	<div>
		<template v-if="loading">
			<!-- loading -->
			<v-dialog :value="loading" persistent width="300" hide-overlay>
				<v-card color="secondary" dark>
					<v-card-text>
						Cargando...
						<v-progress-linear
							indeterminate
							color="white"
							class="mb-0"
						></v-progress-linear>
					</v-card-text>
				</v-card>
			</v-dialog>
		</template>
		<template v-else>
			<v-row>
				<!-- select place  -->
				<v-col cols="12" md="3">
					<v-select
						:value="place"
						:items="places"
						dense
						label="Selecione lugar"
						outlined
						@change="setPlace"
					>
					</v-select>
				</v-col>
				<!-- activity button -->
				<v-col v-if="place" cols="12" sm="2" md="auto" class="mt-2">
					<v-tooltip v-if="periods.length > 0" attach bottom>
						<template v-slot:activator="{ on }">
							<v-btn color="accent" block small @click="createOneLodging()" v-on="on">
								<v-icon>mdi-plus</v-icon><span>Actividad</span>
							</v-btn>
						</template>
						<span>Añadir hospedaje</span>
					</v-tooltip>
				</v-col>
				<!-- periods buttons -->
				<v-col v-if="place" cols="12" sm="2" md="auto" class="mt-2">
					<v-tooltip attach bottom>
						<template v-slot:activator="{ on }">
							<v-btn
								block
								color="accent"
								small
								v-on="on"
								@click.stop="dialogPeriods = true"
							>
								<span>Turnos</span>
							</v-btn>
						</template>
						<span>Gestionar turnos del lugar</span>
					</v-tooltip>
				</v-col>
				<!-- payments buttons -->
				<v-col v-if="place" cols="12" sm="2" md="auto" class="mt-2">
					<v-tooltip attach bottom>
						<template v-slot:activator="{ on }">
							<v-btn
								block
								color="accent"
								small
								v-on="on"
								@click.stop="dialogPayments = true"
							>
								<span>Pagos</span>
							</v-btn>
						</template>
						<span>Gestionar pagos del lugar</span>
					</v-tooltip>
				</v-col>
				<!-- edit buttons -->
				<v-col v-if="lodgingSelect" cols="12" sm="2" md="auto" class="mt-2">
					<v-tooltip attach bottom>
						<template v-slot:activator="{ on }">
							<v-btn
								block
								color="accent"
								small
								v-on="on"
								@click.stop="setBottomSheet({ action: true, lodging: null })"
							>
								<v-icon>mdi-pencil</v-icon><span>Editar</span>
							</v-btn>
						</template>
						<span>Editar el hospedaje</span>
					</v-tooltip>
				</v-col>
				<!-- save buttons -->
				<v-col v-if="getMirrorLodging || editMode" cols="12" sm="2" md="auto" class="mt-2">
					<v-tooltip attach bottom class="mr-2">
						<template v-slot:activator="{ on }">
							<v-btn color="success" small @click="saveLodgings()" v-on="on">
								<v-icon>mdi-content-save</v-icon><span>Guardar</span>
							</v-btn>
						</template>
						<span>Guardar</span>
					</v-tooltip>
				</v-col>
			</v-row>
			<!-- timeline -->
			<v-row>
				<v-col v-if="place" cols="12">
					<timeline
						v-if="periods.length > 0 && lodgings.length > 0"
						class="timelineContent"
						:events="['rangechanged', 'click', 'doubleClick']"
						:groups="periods"
						:items="lodgings"
						:options="options"
						@click="enableEdit"
						@rangechanged="rangechanged"
						@double-click="setBottomSheet({ action: true, lodging: null })"
					/>
				</v-col>
				<template v-for="(p, index) in places" v-else>
					<v-col v-if="p.value" :key="index" class="timelineContent " cols="12">
						<h4 class="mb-2">{{ p.text }}</h4>
						<timeline
							v-if="periods.length > 0 && lodgings.length > 0"
							:events="['rangechanged', 'click', 'doubleClick']"
							:groups="periodAllPlace(p.value)"
							:items="lodgingsAllPlace(p.value)"
							:options="options"
							@click="enableEdit"
							@rangechanged="rangechanged"
							@double-click="setBottomSheet({ action: true, lodging: null })"
						/>
					</v-col>
				</template>
			</v-row>
			<!-- table -->
			<v-row>
				<v-col v-if="selectedPlace && place" cols="12" class="overflow-auto">
					<table>
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
							<tr v-for="(service, index) in selectedPlace.services" :key="index">
								<td v-text="service.name"></td>
								<td v-text="service.price"></td>
								<td
									v-for="(p, proyectionIndex) in proyectionTable"
									:key="proyectionIndex"
								>
									<span v-if="!editMode">{{ p.service[service.name] }}</span>
									<input
										v-if="editMode && p.service[service.name] !== undefined"
										:id="p.id + ',' + p.date"
										v-model="p.service[service.name]"
										type="number"
										class="inputService"
										:name="service.name"
										:placeholder="p.service[service.name]"
										@change="detectInputChange"
									/>
								</td>
							</tr>
							<!--TOTAL-->
							<tr v-if="place" class="borderModule">
								<td colspan="2">TOTAL</td>
								<td v-for="(p, index) in proyectionTable" :key="index">
									<span v-if="finalyPrice[index] !== 0">{{
										finalyPrice[index]
									}}</span>
								</td>
							</tr>
						</tbody>
					</table>
				</v-col>
			</v-row>
			<v-row v-if="lodgingSelect && selectedPlace">
				<v-col cols="12" sm="4">
					<v-select
						id="services_select"
						v-model="serviceSelected"
						:items="servicesComboBox"
						dense
						label="Servicios"
						outlined
					>
					</v-select>
				</v-col>
				<v-col cols="6" md="3" class="mt-1">
					<v-btn small color="primary" @click="addOneService(serviceSelected)">
						+1 {{ serviceSelected }}
					</v-btn>
				</v-col>
				<v-col cols="6" md="3" class="mt-1">
					<v-btn small color="primary" @click="subOneService(serviceSelected)">
						-1 {{ serviceSelected }}
					</v-btn>
				</v-col>
			</v-row>
			<!-- bottom sheets -->
			<v-row justify="center">
				<v-col>
					<v-bottom-sheet
						v-model="dialogEditLodging"
						inset
						@click:outside="setBottomSheet(false)"
					>
						<v-sheet style="height: 75vh">
							<edit-lodging />
						</v-sheet>
					</v-bottom-sheet>
					<v-bottom-sheet
						v-if="dialogPeriods"
						v-model="dialogPeriods"
						inset
						@click:outside="dialogPeriods = false"
					>
						<v-sheet style="height: 75vh">
							<Periods />
						</v-sheet>
					</v-bottom-sheet>
					<v-bottom-sheet
						v-if="dialogPayments"
						v-model="dialogPayments"
						inset
						@click:outside="dialogPayments = false"
					>
						<v-sheet style="height: 75vh; overflow-y: auto;">
							<Payments />
						</v-sheet>
					</v-bottom-sheet>
				</v-col>
			</v-row>
		</template>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { Timeline } from 'vue2vis';
import moment from 'moment';
import { generateDaysArray } from '../../utils/lodging/daysArray';

export default {
	components: {
		EditLodging: () => import('@/components/lodgings/EditLodging'),
		Periods: () => import('@/components/periods/Periods'),
		Payments: () => import('@/components/payments/Payments'),
		Timeline,
	},
	data() {
		return {
			dialogPeriods: false,
			dialogPayments: false,
			//Este string interactua con la comboBox de services
			serviceSelected: 'todos los servicios',
			options: {
				editable: true,
				start: moment(),
				end: moment().add(14, 'day'),
				zoomMin: 1000 * 60 * 60 * 24 * 7,
				zoomMax: 1000 * 60 * 60 * 24 * 30,
				hiddenDates: [
					{
						start: '2019-01-01 00:00:00',
						end: '2019-01-01 06:00:00',
						repeat: 'daily',
					},
					{
						start: '2019-01-01 16:00:00',
						end: '2019-01-01 24:00:00',
						repeat: 'daily',
					},
				],
				onUpdate: (item, callback) => {
					if (this.place) {
						this.setModeEdit(true);
						if (this.verifyOverlay(item)) {
							callback(item);
							this.updateService(item);
						} else this.$toasted.show('Existe un alojamiento para esas fechas');
					} else this.$toasted.show('Selecione una entidad primero');
				},
				//Esta funcion hace trigger cuando estamos moviendo el lodging, nos sirve para verificar el overlay
				onMoving: (item, callback) => {
					this.setModeEdit(false);
					if (this.place) {
						if (this.verifyOverlay(item)) callback(item);
						else this.$toasted.show('Existe un alojamiento para esas fechas');
					} else this.$toasted.show('Selecione una entidad primero');
				},
				//Esta funcion hace trigger cuando removemos un lodging de la timeline
				onRemove: (item, callback) => {
					if (this.lodgings.length > 1 && this.place) {
						this.setModeEdit(false);
						this.deleteLodging(item);
						callback(item);
					} else this.$toasted.show('Selecione una entidad primero');
				},
				//No tenemos que modificar nada mas de onAdd
				//Cuando clickeo una parte del timeline esta función hace trigger
				onAdd: (item, callback) => {
					if (this.place) {
						item.start = moment(item.start).hours(15);
						item.end = moment(item.start)
							.hours(12)
							.add(1, 'day');
						if (this.verifyOverlay(item)) {
							this.setModeEdit(false);
							const place = this.places.find(c => c.value === this.place);
							const generatedService = generateDaysArray(place);
							item.content = place.text;
							if (place != 'Turismo') item.service = [generatedService];
							else item.service = [generatedService];
							var timestamp = new Date().getTime().toString(16);
							timestamp +
								'xxxxxxxxxxxxxxxx'
									.replace(/[x]/g, function() {
										return ((Math.random() * 16) | 0).toString(16);
									})
									.toLowerCase();
							item.id = timestamp;
							this.addLodging(item);
							if (!this.lodgings.get(item.id)) callback(item);
						} else this.$toasted.show('Existe un alojamiento para esas fechas');
					} else this.$toasted.show('Selecione una entidad primero');
				},
				//Cuando agrando o muevo un lodging esta función hace trigger
				onMove: (item, callback) => {
					if (this.place) {
						let service = [];
						let numberDays = moment(item.end).diff(
							moment(item.start).format('YYYY-MM-DD'),
							'days'
						);
						const oldService = JSON.parse(item.service[0]);
						//1- el contador i se esta contando la nueva cantidad de dias, recorrer el primer acceso service[i].
						//3- entonces, por cada dia se vas pushear un nuevo arreglo en service.
						//4- Si existe algo en la posicion, procedemos a hacer map con la condicion de  existeValor ? retorna valor : returna un numero default 1.
						//5- si no existe el dia en la posicion service[i], generamos un arreglo de service pero sin volverlo string.
						const servicesIndex = this.selectedPlace.services.length;
						const generateNewServices = oldServices => {
							if (oldServices) {
								return oldServices.map(service => {
									return service ? service : 1;
								});
							} else {
								let defaultServices;
								let temporalArray = [];
								for (let i = 0; i < servicesIndex; i++) {
									temporalArray.push(1);
								}
								defaultServices = temporalArray;
								return defaultServices;
							}
						};

						for (let i = 0; i <= numberDays; i++) {
							const newServices = generateNewServices(oldService[i]);
							service.push(newServices);
						}

						let itemService = [];
						itemService.push(JSON.stringify(service));
						item.service = itemService;
						item.start = moment(item.start).hours(15);
						item.end = moment(item.end).hours(12);
						if (this.verifyOverlay(item)) {
							this.setModeEdit(true);
							this.updateService(item);
							callback(item);
						} else this.$toasted.show('Existe un alojamiento para esas fechas');
					} else this.$toasted.show('Selecione una entidad primero');
				},
			},
		};
	},
	computed: {
		//funcion de mirrorLodginds
		getMirrorLodging() {
			var hola = JSON.stringify(this.lodgings);
			if (hola === this.mirrorLodging) return false;
			else return true;
		},
		finalyPrice() {
			//el fin de esta funcion, es generar un arreglo de precios totales por cada dia de nuestra proyection table
			let prices = [];
			let dayPrice = 0;
			if (this.place)
				this.proyectionTable.forEach(dailyService => {
					//algoritmo
					//1- tenemos dos evaluaciones, si existe un valor entonces multiplicamos cantidadUsos * precioServicio
					//de no existir un valor asignamos 0.
					//2- dailyService.service no tiene el precio del servicio, pero si lo podemos obtener de this.selectedPlace.Services.
					//3- dailyService.service comparte posiciones con el arreglo de services, esto es util para realizar el calculo.
					//4- cada dayPrice es la suma de todos los servicios * su cantidad de usos.
					//5- para llevar a cabo este calculo, necesitamos obtener el precio de cada servicio de manera exacta.
					//6- vamos a generar una iteracion por cada key de dailyService.service
					//7- con la variable key obtenemos el el servicio a calcular, y con serviceIndex obtenedremos el precio de este servicio
					//como los dos servicios comparten la misma cantidad de indices,

					//iterationPrice se encarga de ir sumando el valor multiplicado de cada iteracion
					let iterationPrice = 0;
					Object.keys(dailyService.service).forEach((key, serviceIndex) => {
						let servicePrice = dailyService.service[key]
							? dailyService.service[key] *
							  this.selectedPlace.services[serviceIndex].price
							: 0;
						iterationPrice = iterationPrice + servicePrice;
					});
					dayPrice = iterationPrice;
					prices.push(dayPrice);
				});
			return prices;
		},
		//falta ver para que sirve
		prices() {
			if (this.place) return this.places.find(c => c.value == this.place);
			else return [];
		},
		//Esta funcion le da vida a la tabla de servicios y sus precios
		//Nueva proyection table
		proyectionTable() {
			let daysLodging = [];
			let numberDays = this.rangeDate.end.diff(this.rangeDate.start, 'days');
			//Aca son creado los lodging del dia, por cada dia en nuestra proyection table
			//daylodging se encuentra presente para guardar los numeros de servicios utilizados.
			for (let i = 0; i <= numberDays; i++) {
				daysLodging.push({
					date: moment(this.rangeDate.start)
						.add(i, 'day')
						.format('YYYY-MM-DD'),
					service: [],
					id: null,
				});
			}
			//En esta parte en base a los lodging existentes, daylodgings es recorrido y poblado con datos como services y la id del lodging
			//La id del lodging solo se añade si if(this.lodgingSelect) es valido
			this.lodgings.forEach(l => {
				let dayIndex = 0;
				//Solo service es añadido
				if (!this.editMode) {
					daysLodging.forEach(day => {
						if (
							moment(day.date).isSameOrAfter(moment(l.start).format('YYYY-MM-DD')) &&
							moment(day.date).isSameOrBefore(moment(l.end).format('YYYY-MM-DD'))
						) {
							if (
								!this.place &&
								this.places.find(c => c.value === l.place).text === 'Turismo'
							) {
								//El precio iba a estar segun la cantidad de personas en turismo
								//OMITIR ESTO MIENTRAS
								/*var numberPassangerMax = this.periods.get(l.group)
									.numberPassangerMax;*/
								const reduceServicesForTourism = (acc, service) => {
									return Object.assign(acc, {
										[service.name]: 0,
									});
								};
								//Aca podriamos definir las variables en base a nombreServicio: 1;
								day.service = this.selectedPlace.services.reduce(
									reduceServicesForTourism,
									{}
								);
							} else {
								//Por cada servicio  vamos a devolver un objeto { nombreServicio: cantidadUsos}
								const reduceServices = (acc, service) => {
									return Object.assign(acc, {
										//el problema de las sumas si este valor estaba en 1, ahora en este push deje seteado el valor en 0
										[service.name]: 0,
									});
								};
								day.service = this.selectedPlace.services.reduce(
									reduceServices,
									{}
								);
								const service = JSON.parse(l.service[0]);
								//Algoritmo nuevo
								//1- cada propiedad de day.service tiene como nombre base el nombre de servicio, entonces necesitaremos iterar el objeto
								//2- sabemos que service y placeServices son iguales en tamaño y orden de servicios, entonces no necesitamos saber un index especifico.
								//3- por cada iteracion, usamos el index de la iteracion para consultar service de esta forma: service[index][placeServicesIndex];
								//4- si tiene el valor va ser service[index][indexService] + day.service.nombreServicio
								//5- si no tiene valor, el valor va ser service[index][indexService]
								Object.keys(day.service).forEach((key, serviceIndex) => {
									day.service[key] = day.service[key]
										? service[dayIndex][serviceIndex] + day.service[key]
										: service[dayIndex][serviceIndex];
								});
							}
							//index indica la cantidad de dias, nos ayuda a recorrer service
							dayIndex++;
						}
					});
				}
				//Service y la id del lodging son añadidos
				if (this.lodgingSelect) {
					if (this.editMode && this.lodgingSelect.id === l.id) {
						daysLodging.forEach(day => {
							if (
								moment(day.date).isSameOrAfter(
									moment(l.start).format('YYYY-MM-DD')
								) &&
								moment(day.date).isSameOrBefore(moment(l.end).format('YYYY-MM-DD'))
							) {
								const service = JSON.parse(l.service[0]);
								//Por cada servicio  vamos a devolver un objeto { nombreServicio: cantidadUsos}
								const reduceServices = (acc, service) => {
									return Object.assign(acc, {
										[service.name]: 0,
									});
								};
								//Aca podriamos definir las variables en base a nombreServicio: 1;
								day.service = this.selectedPlace.services.reduce(
									reduceServices,
									{}
								);
								Object.keys(day.service).forEach((key, serviceIndex) => {
									day.service[key] = day.service[key]
										? service[dayIndex][serviceIndex] + day.service[key]
										: service[dayIndex][serviceIndex];
								});
								day.id = l.id;
								dayIndex++;
							}
						});
					}
				}
			});
			return daysLodging;
		},
		//Complemento de la proyectionTable, esta función se encarga de crear y renderizar las columnas de dias
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
		...mapGetters({
			periodAllPlace: 'Lodging/periodAllPlace',
			lodgingsAllPlace: 'Lodging/lodgingsAllPlace',
			dialogEditLodging: 'Lodging/bottomSheet',
			editMode: 'Lodging/editMode',
			loading: 'Lodging/loading',
			lodgings: 'Lodging/lodgings',
			lodgingSelect: 'Lodging/lodgingSelect',
			message: 'Lodging/message',
			mirrorLodging: 'Lodging/mirrorLodging',
			periods: 'Lodging/periods',
			place: 'Lodging/place',
			places: 'Lodging/places',
			rangeDate: 'Lodging/rangeDate',
			updatingService: 'Lodging/updatingService',
			selectedPlace: 'Lodging/selectedPlace',
			servicesComboBox: 'Lodging/servicesComboBox',
		}),
	},
	watch: {
		message(newVal) {
			this.$toasted.show(newVal.text, {
				type: newVal.type,
			});
		},
		lodgingSelect() {
			if (
				this.lodgingSelect &&
				Array.isArray(this.lodgingSelect.persons) &&
				this.lodgingSelect.persons.length
			) {
				this.setAllLodgingPersons(this.lodgingSelect.persons);
			} else {
				this.setAllLodgingPersons([]);
			}
		},
	},
	created() {
		this.setRangeDate({
			start: moment(),
			end: moment().add(15, 'day'),
		});
		this.fetchPlace();
		this.fetchPeriods();
		this.fetchLodgings();
		this.fetchAllPersons();
	},
	methods: {
		verifyOverlay(value) {
			let verificate = true;
			this.lodgings.forEach(lod => {
				if (lod.group == value.group && lod.id != value.id) {
					if (
						moment(value.start).isSameOrBefore(moment(lod.end)) &&
						moment(value.end).isSameOrAfter(moment(lod.start))
					)
						verificate = false;
				}
			});
			return verificate;
		},
		/*parece que en esta funcion no esta el error*/
		setPlace(payload) {
			this.setPlaceLodging(payload);
			this.setModeEdit(false);
			this.setSelectedPlace();
			this.setServicesComboBox();
			this.fetchPeriods(this.place).then(() => this.fetchLodgings());
		},
		//Cuando cambio de valor un servicio, esta funcion se encarga de evaluar si estoy excediendo el numero de pasajeros
		//Esta funcion se encarga de evaluar el valor y luego pasarlo a updateService, updateService es el encargado real de actualizar el valor
		detectInputChange(payload) {
			//Si es 0 o string, deja el value como 0
			if (payload.target.value === '' || payload.target.value === 0) payload.target.value = 0;
			//busca el numero de pasajeros en el lodging seleccionado
			const numberPassangerMax = this.periods.get(this.lodgingSelect.group)
				.numberPassangerMax;
			//si el valor excede el numero de pasaejeros, se setea el numero de pasajeros como valor y se levanta una notificacion toast
			if (payload.target.value > numberPassangerMax) {
				this.$toasted.show('Cantidad máxima de la habitación excedida');
				payload.target.value = numberPassangerMax;
			}
			//si el valor es menor a 0, se setea el numero de pasajeros como valor
			if (payload.target.value < 0) {
				payload.target.value = numberPassangerMax;
			}
			//se pasa el valor a updateService, esta funcion se encarga de actualizar el valor en pantalla
			this.updateService(payload.target);
		},
		enableEdit(payload) {
			if (this.place && payload.item) {
				this.setLodgingSelect(payload.item);
				this.setModeEdit(true);
			} else this.setModeEdit(false);
		},
		rangechanged(payload) {
			if (payload) {
				this.setRangeDate({
					start: moment(payload.start),
					end: moment(payload.end),
				});
			}
		},
		...mapActions({
			deleteLodging: 'Lodging/deleteLodging',
			fetchAllPersons: 'Persons/fetchAllPersons',
			fetchLodgings: 'Lodging/fetchLodgings',
			fetchPeriods: 'Lodging/fetchPeriods',
			fetchPlace: 'Lodging/fetchPlace',
			saveLodgings: 'Lodging/saveLodgings',
		}),
		...mapMutations({
			setBottomSheet: 'Lodging/setBottomSheet',
			addOneService: 'Lodging/addOneService',
			subOneService: 'Lodging/subOneService',
			createOneLodging: 'Lodging/createOneLodging',
			addLodging: 'Lodging/addLodging',
			setAllLodgingPersons: 'Lodging/setAllLodgingPersons',
			setLodgingSelect: 'Lodging/setLodgingSelect',
			setModeEdit: 'Lodging/setModeEdit',
			setPlaceLodging: 'Lodging/setPlaceLodging',
			setRangeDate: 'Lodging/setRangeDate',
			updateService: 'Lodging/updateService',
			setSelectedPlace: 'Lodging/setSelectedPlace',
			setServicesComboBox: 'Lodging/setServicesComboBox',
		}),
	},
};
</script>

<style lang="css">
.timelineContent:hover {
	box-shadow: 0px 3px 13px 2px rgba(0, 0, 0, 0.75);
	transition: all ease-in-out 0.5s;
}
.timelineContent {
	background-color: transparent;
	/* background: linear-gradient(90deg, rgba(106, 49, 255, 0.07) 0%, rgba(213, 47, 143, 0.18) 100%); */
	margin-bottom: 20px !important;
	padding: 10px;
	border-radius: 10px;
	box-shadow: 0px 3px 15px 2px rgba(0, 0, 0, 0.2);
	transition: all ease-in-out 0.5s;
}

.vis-selected {
	background-color: #c06240 !important;
	color: white !important;
	transition: all ease-in-out 0.3s;
	/* box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.75); */
}
.vis-time-axis .vis-text,
.vis-label,
.vis-inner,
.vis-time-axis .vis-text.vis-saturday,
.vis-time-axis .vis-text.vis-sunday {
	color: var(--v-textColor) !important;
}

.vis-time-axis .vis-grid.vis-saturday,
.vis-time-axis .vis-grid.vis-sunday {
	background-color: #9090906e !important;
	border: none !important;
}

.inputService {
	max-width: 60px;
}
.vis-timeline {
	margin-bottom: 15px;
	background-color: transparent;
	border: none !important;
}
.vis-item {
	border: none !important;
	background: rgb(213, 47, 143);
	background: linear-gradient(
		90deg,
		rgba(213, 47, 143, 0.861782212885154) 0%,
		rgba(106, 49, 255, 0.8701855742296919) 100%
	);
	color: white;
	border-radius: 5px !important;
	transition: all ease-in-out 0.3s;
}
</style>
