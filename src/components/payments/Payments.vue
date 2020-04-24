<template>
	<v-container>
		<v-row>
			<!-- header -->
			<v-col cols="12">
				<v-row justify="center">
					<v-col cols="12">
						<span class="title">Lista de Pagos</span>
					</v-col>
				</v-row>
				<v-row justify="space-between">
					<v-col cols="4" md="3" sm="4" class="px-0">
						<v-btn small color="primary" @click="dialog = true">
							<v-icon>mdi-plus</v-icon>Agregar
						</v-btn>
					</v-col>
					<v-col cols="4" md="3" sm="4" class="px-0">
						<v-btn small color="accent" @click="exportByFormat('pdf')"
							><span>Exportar pdf</span>
						</v-btn>
					</v-col>
					<v-col cols="4" md="3" sm="4" class="px-0">
						<v-btn small color="accent" @click="exportByFormat('csv')"
							><span>Exportar csv</span>
						</v-btn>
					</v-col>
					<v-col cols="12" md="3" class="py-1">
						<v-text-field
							v-model="wordForFilter"
							dense
							outlined
							append-icon="mdi-magnify"
							label="Filtrar"
							hide-details
						></v-text-field>
					</v-col>
				</v-row>
			</v-col>
			<!-- table -->
			<v-col v-if="paymentsForMonth.length <= 0" cols="12">No posee pagos</v-col>
			<template v-else>
				<payments-table
					v-for="(item, index) in paymentsForMonth"
					:key="index"
					:payments-list="groupPaymentsByMonth[index]"
					:title="item"
					:word-filter="wordForFilter"
					:id-place="selectedPlace.value"
				></payments-table>
			</template>
			<!-- dialog steeper form -->
			<v-dialog v-model="dialog" max-width="440" persistent>
				<v-stepper v-model="stepper" class="elevation-12">
					<v-stepper-header>
						<v-stepper-step :complete="stepper > 1" step="1">
							Tipo
						</v-stepper-step>
						<v-divider></v-divider>
						<v-stepper-step :complete="stepper > 2" step="2">
							Pago
						</v-stepper-step>
					</v-stepper-header>
					<v-stepper-items>
						<v-stepper-content step="1">
							<v-radio-group v-model="visible" row>
								<v-radio label="Agregar pago por alojamiento" value="1"> </v-radio>
								<v-radio label="Agregar pago por fecha" value="2"></v-radio>
								<v-radio label="Agregar pago por cuenta" value="3"></v-radio>
							</v-radio-group>
							<v-btn
								small
								text
								color="primary"
								:disabled="!Boolean(visible)"
								@click="stepper = 2"
							>
								Continuar
							</v-btn>
							<v-btn small text color="primary" @click="closeDialog">
								Cerrar
							</v-btn>
						</v-stepper-content>
						<v-stepper-content step="2">
							<payments-form-lodging
								v-if="visible == 1"
								:id-place="selectedPlace.value"
								:back="() => (stepper = 1)"
								:close="closeDialog"
							/>
							<payments-form-dates
								v-if="visible == 2"
								:id-place="selectedPlace.value"
								:back="() => (stepper = 1)"
								:close="closeDialog"
							/>
							<payments-form-account
								v-if="visible == 3"
								:id-place="selectedPlace.value"
								:back="() => (stepper = 1)"
								:close="closeDialog"
							/>
						</v-stepper-content>
					</v-stepper-items>
				</v-stepper>
			</v-dialog>
		</v-row>
	</v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import PaymentsFormDates from '@/components/payments/PaymentsFormDates';
import PaymentsFormLodging from '@/components/payments/PaymentsFormWithLodging';
import { generatePdfReport, generateCsvReport, generateFormatReport } from '@/service/payments';
import moment from 'moment';
import PaymentsFormAccount from '@/components/payments/PaymentsFormAccount';
import PaymentsTable from '@/components/payments/PaymentsTable';

export default {
	name: 'Payments',
	components: {
		PaymentsFormDates,
		PaymentsFormLodging,
		PaymentsFormAccount,
		PaymentsTable,
	},
	data() {
		return {
			stepper: 1,
			dialog: false,
			selected: {},
			wordForFilter: '',
			visible: null,
		};
	},
	computed: {
		...mapGetters({
			selectedPlace: 'Lodging/selectedPlace',
			paymentsType: 'Payments/paymentsType',
			message: 'Payments/message',
			paymentsForMonth: 'Payments/paymentsForMonth',
			groupPaymentsByMonth: 'Payments/groupPaymentsByMonth',
		}),
	},
	watch: {
		message(newVal) {
			this.$toasted.show(newVal.text, {
				type: newVal.type,
			});
		},
	},
	created() {
		this.fetchPayments(this.selectedPlace.value);
	},
	methods: {
		closeDialog() {
			this.dialog = false;
			this.stepper = 1;
		},
		onRowSelected(items) {
			this.selected = items[0];
		},
		onClose(close) {
			close();
			this.$refs.selectableTable.clearSelected();
		},
		...mapActions({
			fetchPayments: 'Payments/fetchPaymentsOfThePlace',
		}),
		saveComment(item) {
			const date = moment().format('YYYY-MM-DD hh:mm');
			const temp = [...item.comments, `${date}: ${this.newComment}`];
			this.edit({ comments: temp, id: item._id })
				.then((this.newComment = ''))
				.then(this.fetchPayments(this.idPlace));
		},
		async exportToPdf() {
			const pdf = await generatePdfReport(this.idPlace);
			let blob = new Blob([pdf], { type: 'application/pdf' });
			let link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = 'pagos.pdf';
			link.click();
		},
		async exportToCsv() {
			const csv = await generateCsvReport(this.idPlace);
			let blob = new Blob([csv], { type: 'text/csv' });
			let link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = 'pagos.csv';
			link.click();
		},
		async exportByFormat(format) {
			const exportFormat = await generateFormatReport(this.idPlace, format);
			let blob;
			if (format == 'csv') {
				blob = new Blob([exportFormat], { type: 'text/csv' });
			} else {
				blob = new Blob([exportFormat], { type: 'application/pdf' });
			}
			let link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = `pagos.${format}`;
			link.click();
		},
	},
};
</script>
