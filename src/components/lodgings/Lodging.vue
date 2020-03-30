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
				<!-- periods dialog -->
				<v-bottom-sheet
					v-if="lodgingSelect"
					v-model="bottomSheet"
					inset
					@click:outside="setBottomSheet(false)"
				>
					<v-sheet style="height: 75vh">
						<edit-lodging :lodgings="lodgings" :id-place="place" />
					</v-sheet>
				</v-bottom-sheet>
				<v-bottom-sheet
					v-model="dialogPeriods"
					inset
					@click:outside="dialogPeriods = false"
				>
					<v-sheet style="height: 75vh">
						<Periods :id-place="place" />
					</v-sheet>
				</v-bottom-sheet>
				<!-- payments dialog -->
				<template v-if="Boolean(place) && dialogPayments">
					<v-dialog v-model="dialogPayments" fullscreen>
						<v-card>
							<v-toolbar dark color="primary">
								<v-btn icon dark @click="dialogPayments = false">
									<v-icon>mdi-close</v-icon>
								</v-btn>
								<v-toolbar-title>Gestion de Pagos</v-toolbar-title>
							</v-toolbar>
							<Payments :id-place="place" />
						</v-card>
					</v-dialog>
				</template>
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
			<!--aqui va la tabla-->
			<!--v2-->
			<v-row v-if="selectedPlace.value">
				<v-col v-for="lodging in lodgings._data" :key="lodging.id" cols="12">
					<v-card cols="3">
						<v-card-title class="headline">
							{{ lodging.start.format('L') + ' - ' + lodging.end.format('L') }}
						</v-card-title>
						<v-row>
							<v-col v-for="(day, dayIndex) in lodging.days" :key="dayIndex" cols="4">
								<v-card>
									<div>{{ day.date }}</div>
									{{ day.services }}
									<table>
										<thead>
											<tr>
												<th class="text-left">Nombre</th>
												<th class="text-left">Precio</th>
												<th class="text-left">Cantidad</th>
												<th class="text-left">SubTotal</th>
											</tr>
										</thead>
										<tbody>
											<tr
												v-for="(service, serviceIndex) in day.services"
												:key="serviceIndex"
											>
												<td>{{ service.name }}</td>
												<td>{{ service.price }}</td>
												<td>
													<input
														:id="day.date"
														v-model.number="service.quantity"
														type="number"
														class="inputService"
														@change="
															detectServiceQuantityChange(
																$event,
																lodging.group,
																lodging.id,
																dayIndex,
																serviceIndex
															)
														"
													/>
												</td>
												<td>{{ service.price * service.quantity }}</td>
											</tr>
										</tbody>
									</table>
									<div>Total: {{ day.dayTotal }}</div>
								</v-card>
							</v-col>
						</v-row>
						<v-row>
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
								<v-btn
									small
									color="primary"
									@click="
										addDaysServices({
											serviceName: serviceSelected,
											lodgingId: lodging.id,
										})
									"
								>
									+1 {{ serviceSelected }}
								</v-btn>
							</v-col>
							<v-col cols="6" md="3" class="mt-1">
								<v-btn
									small
									color="primary"
									@click="
										subDaysServices({
											serviceName: serviceSelected,
											lodgingId: lodging.id,
										})
									"
								>
									-1 {{ serviceSelected }}
								</v-btn>
							</v-col>
						</v-row>
					</v-card>
				</v-col>
			</v-row>
			<!--<v-row>
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
							&lt;!&ndash;TOTAL&ndash;&gt;
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
			</v-row>-->
			<!--aqui van los botones de proyection-->
			<v-row justify="center">
				<v-col>
					<v-bottom-sheet
						v-if="lodgingSelect"
						v-model="bottomSheet"
						inset
						@click:outside="setBottomSheet(false)"
					>
						<v-sheet style="height: 75vh">
							<edit-lodging :lodgings="lodgings" :id-place="place" />
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
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { generateDaysArray, generateSingleDay } from '../../utils/lodging/daysArray';
import { findServiceIndexByName } from '../../utils/lodging/findServiceIndex';

const moment = extendMoment(Moment);

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
			sheet: false,
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
				//Cuando clickeo una parte del timeline esta función hace trigger y se encarga de crear un lodging, es similar a createOnelodging de la store
				onAdd: (item, callback) => {
					if (this.place) {
						const startDate = moment(item.start).hours(15);
						const endDate = moment(item.start)
							.hours(12)
							.add(1, 'day');
						item.start = startDate;
						item.end = endDate;
						if (this.verifyOverlay(item)) {
							this.setModeEdit(false);
							const place = this.places.find(c => c.value === this.place);
							const generatedDays = generateDaysArray(place, startDate, endDate);
							item.content = place.text;
							if (place != 'Turismo') item.days = generatedDays;
							else item.days = generatedDays;
							let timestamp = new Date().getTime().toString(16);
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
				//Esta funcion va tener que cambiar harto, por el momento la dejo comentada
				// eslint-disable-next-line no-unused-vars
				onMove: (item, callback) => {
					if (this.place) {
						let newDays = [];
						let numberDays = moment(item.end).diff(
							moment(item.start).format('YYYY-MM-DD'),
							'days'
						);

						const range = moment.range(item.start, item.end);
						const arrayOfDates = Array.from(range.by('days'));
						const oldDays = item.days;
						//1- el contador i se esta contando la nueva cantidad de dias, esta encargado de recorrer nuestro arreglo de days
						//3- entonces, por cada dia se va pushear un objeto days o se va conservar el existente.
						//4- Si existe algo en la posicion entonces lo retornamos;
						//5- si no existe el dia en la posicion, generamos un dia nuevo para esa posicion con generateSingleDay
						//6- si es un dia nuevo, va ser necesario saber cual va ser la fecha del dia a ingresar;
						const generateNewDays = (oldDay, dayIndex) => {
							if (oldDay) {
								//va ser necesario  mapear el valor con la nueva fecha de inicio
								return oldDay;
							} else {
								return generateSingleDay(
									this.selectedPlace,
									arrayOfDates[dayIndex]
								);
							}
						};

						for (let i = 0; i <= numberDays; i++) {
							const newDay = generateNewDays(oldDays[i], i - 1);
							newDays.push(newDay);
						}
						item.days = newDays;
						item.start = moment(item.start).hours(15);
						item.end = moment(item.end).hours(12);
						if (this.verifyOverlay(item)) {
							this.setModeEdit(true);
							//Esta funcion ya no funciona con v3, preguntar el por que se actualizan los servvices aca
							/*this.updateService(item);*/
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
					//Esto va cambiar
					//Algo muy imoportante, dailyService no cuenta con los valores del service
					// pero esto lo podriamos arreglar añadiendo otra variable tipo servicesPrices con reduce y crear {nombreServicio: precio}
					Object.keys(dailyService.service).forEach(key => {
						let servicePrice = dailyService.service[key]
							? dailyService.service[key] * dailyService.servicesPrices[key]
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
									.numberPassangerMax;*/ const reduceServicesForTourism = (
									acc,
									service
								) => {
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
								const reduceServicesPrice = (acc, service) => {
									return Object.assign(acc, {
										[service.name]: service.price,
									});
								};
								//Esto tal vez igual nos puede ayudar al momento de mostrar valores borrados
								day.servicesPrices = service[dayIndex].reduce(
									reduceServicesPrice,
									{}
								);
								//Algoritmo nuevo
								//1- cada propiedad de day.service tiene como nombre base el nombre de servicio, entonces necesitaremos iterar el objeto
								//2- sabemos que service y placeServices son iguales en tamaño y orden de servicios, entonces no necesitamos saber un index especifico.
								//3- por cada iteracion, usamos el index de la iteracion para consultar service de esta forma: service[index][placeServicesIndex];
								//4- si tiene el valor va ser service[index][indexService] + day.service.nombreServicio
								//5- si no tiene valor, el valor va ser service[index][indexService]
								Object.keys(day.service).forEach(key => {
									//ahora va ser necesario encontrar el index del objeto en el arreglo
									const serviceIndex = service[dayIndex].findIndex(
										s => s.name === key
									);
									day.service[key] = day.service[key]
										? service[dayIndex][serviceIndex].quantity +
										  day.service[key]
										: service[dayIndex][serviceIndex].quantity;
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
								const reduceServicesPrice = (acc, service) => {
									return Object.assign(acc, {
										[service.name]: service.price,
									});
								};
								day.servicesPrices = service[dayIndex].reduce(
									reduceServicesPrice,
									{}
								);
								Object.keys(day.service).forEach(key => {
									//ahora va ser necesario encontrar el index del objeto en el arreglo

									const serviceIndex = findServiceIndexByName(
										key,
										service[dayIndex]
									);
									day.service[key] = day.service[key]
										? service[dayIndex][serviceIndex].quantity +
										  day.service[key]
										: service[dayIndex][serviceIndex].quantity;
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
		// eslint-disable-next-line vue/return-in-computed-property
		...mapGetters({
			periodAllPlace: 'Lodging/periodAllPlace',
			lodgingsAllPlace: 'Lodging/lodgingsAllPlace',
			bottomSheet: 'Lodging/bottomSheet',
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
		detectServiceQuantityChange(
			payload,
			lodgingGroup,
			lodgingId,
			dayIndex,
			serviceIndex,
			dayDate
		) {
			console.log('trigger de input value');
			let inputValue = payload.target.value;
			if (inputValue === '') inputValue = 0;
			//busca el numero de pasajeros en el lodging seleccionado
			const numberPassangerMax = this.periods.get(lodgingGroup).numberPassangerMax;
			//si el valor excede el numero de pasaejeros, se setea el numero de pasajeros como valor y se levanta una notificacion toast
			if (inputValue >= numberPassangerMax) {
				this.$toasted.show('Cantidad máxima de la habitación excedida');
				inputValue = numberPassangerMax;
			}
			//si el valor es menor a 0, se setea el numero de pasajeros como valor
			if (inputValue < 0) inputValue = numberPassangerMax;
			this.updateActualService({ inputValue, lodgingId, dayIndex, serviceIndex, dayDate });
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
			subDaysServices: 'Lodging/subDaysServices',
			addDaysServices: 'Lodging/addDaysServices',
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
			updateActualService: 'Lodging/updateActualService',
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
