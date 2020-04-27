<template>
	<v-row>
		<v-col cols="12" md="3" class="pb-0">
			<v-select
				v-model="placeSelected"
				:items="places"
				dense
				no-data-text="No hay lugares agregados"
				label="Selecione lugar"
				outlined
				@change="setPlace"
			>
			</v-select>
		</v-col>
		<!-- timeline -->
		<v-col cols="12" sm="2" md="auto" class="mt-2">
			<v-btn outlined block color="primary" small @click="setSeeTimeline">
				{{ seeTimeline ? 'Ocultar timeline' : 'Ver timeline' }}
			</v-btn>
		</v-col>
		<!-- export pdf button -->
		<v-col cols="12" sm="2" md="auto" class="mt-2">
			<v-btn outlined block color="primary" small @click="exportToPdf">
				<span>Exportar pdf</span>
			</v-btn>
		</v-col>
		<!-- export csv button -->
		<v-col cols="12" sm="2" md="auto" class="mt-2">
			<v-btn outlined block color="primary" small @click="exportToCsv">
				<span>Exportar csv</span>
			</v-btn>
		</v-col>
		<!-- periods buttons -->
		<v-col v-if="selectedPlace" cols="12" sm="2" md="auto" class="mt-2">
			<v-tooltip attach bottom>
				<template v-slot:activator="{ on }">
					<v-btn
						outlined
						block
						color="primary"
						small
						v-on="on"
						@click.stop="dialogPeriods = true"
					>
						<span>Turnos</span>
					</v-btn>
				</template>
				<span>Gestionar turnos del lugar</span>
			</v-tooltip>
			<v-bottom-sheet v-model="dialogPeriods" inset @click:outside="dialogPeriods = false">
				<v-sheet style="height: 75vh">
					<Periods :id-place="selectedPlace.value" />
				</v-sheet>
			</v-bottom-sheet>
		</v-col>
		<!-- payments buttons -->
		<v-col v-if="selectedPlace" cols="12" sm="2" md="auto" class="mt-2">
			<v-tooltip attach bottom>
				<template v-slot:activator="{ on }">
					<v-btn outlined block color="primary" small v-on="on">
						<span>Pagos</span>
					</v-btn>
				</template>
				<span>Gestionar pagos del lugar</span>
			</v-tooltip>
		</v-col>
		<!-- activity button -->
		<v-col
			v-if="selectedPlace && !seeTimeline && editMode"
			cols="12"
			sm="2"
			md="auto"
			class="mt-2"
		>
			<v-tooltip attach bottom>
				<template v-slot:activator="{ on }">
					<v-btn color="primary" block small @click="setModeEdit(false)" v-on="on">
						<v-icon>mdi-plus</v-icon><span>Actividad</span>
					</v-btn>
				</template>
				<span>Añadir hospedaje</span>
			</v-tooltip>
		</v-col>
	</v-row>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { generatePdfReport, generateCsvReport } from '@/service/lodgings';

export default {
	name: 'Header',
	data() {
		return {
			dialogPeriods: false,
			placeSelected: '',
			Periods: () => import('@/components/periods/Periods'),
		};
	},
	computed: {
		...mapGetters({
			editMode: 'Lodging/editMode',
			seeTimeline: 'Lodging/seeTimeline',
			lodgingsAllPlace: 'Lodging/lodgingsAllPlace',
			places: 'Lodging/places',
			selectedPlace: 'Lodging/selectedPlace',
		}),
	},
	methods: {
		setPlace() {
			this.setSelectedPlace(this.placeSelected);
			this.fetchRooms(this.placeSelected);
			this.setServicesComboBox();
			this.fetchPeriods(this.placeSelected).then(() => this.fetchLodgings());
		},
		async exportToPdf() {
			const pdf = await generatePdfReport(this.placeSelected);
			let blob = new Blob([pdf], { type: 'application/pdf' });
			let link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = 'hospedajes.pdf';
			link.click();
		},
		async exportToCsv() {
			const csv = await generateCsvReport(this.placeSelected);
			let blob = new Blob([csv], { type: 'text/csv' });
			let link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = 'hospedajes.csv';
			link.click();
		},
		...mapActions({
			fetchLodgings: 'Lodging/fetchLodgings',
			fetchPeriods: 'Lodging/fetchPeriods',
			fetchRooms: 'Room/fetchRooms',
		}),
		...mapMutations({
			setModeEdit: 'Lodging/setModeEdit',
			setServicesComboBox: 'Lodging/setServicesComboBox',
			setSelectedPlace: 'Lodging/setSelectedPlace',
			setSeeTimeline: 'Lodging/setSeeTimeline',
		}),
	},
};
</script>

<style lang="scss" scoped></style>
