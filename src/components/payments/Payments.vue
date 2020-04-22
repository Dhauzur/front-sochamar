<template>
	<v-container>
		<v-row>
			<!-- header -->
			<v-col cols="12">
				<v-row justify="center">
					<v-col cols="4">
						<span class="title">Lista de Pagos</span>
					</v-col>
				</v-row>
				<v-row justify="space-between">
					<v-col cols="12" md="2" class="text-left py-0">
						<v-btn small color="accent" @click="dialog = true">
							<v-icon>mdi-plus</v-icon>Agregar
						</v-btn>
					</v-col>
					<v-col cols="12" md="2" class="text-left py-0">
						<v-btn small color="accent" @click="exportToPdf"
							><span>Exportar pdf</span>
						</v-btn>
					</v-col>
					<v-col cols="12" md="2" class="text-left py-0">
						<v-btn small color="accent" @click="exportToCsv"
							><span>Exportar csv</span>
						</v-btn>
					</v-col>
					<v-col cols="12" md="3" class="py-0">
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
			<v-col cols="12" class="mx-auto">
				<v-data-table
					dense
					loading-text="Cargando... por favor espere"
					no-data-text="No hay pagos"
					:loading="loading"
					:search="wordForFilter"
					:headers="fields"
					:items="payments"
					:items-per-page="5"
					item-key="_id"
					class="caption"
				>
					<template v-slot:item.startDate="props">
						<span>{{ formatStartDate(props.item) }}</span>
					</template>
					<template v-slot:item.endDate="props">
						<span>{{ formatEndDate(props.item) }}</span>
					</template>
					<template v-slot:item.mount="{ item }">
						<span class="success--text">$ {{ item.mount }}</span>
					</template>
					<template v-slot:item.voucher="props">
						<v-btn text :href="props.item.voucher.url" small>
							{{ props.item.voucher.name }}
						</v-btn>
					</template>
					<template v-slot:item.comments="props">
						<small
							v-for="(element, i) in props.item.comments"
							:key="i"
							class="text-lowercase d-block"
						>
							{{ element }}
						</small>
					</template>
					<template v-slot:item.actions="{ item }">
						<span style="display: inline-block !important">
							<v-edit-dialog @save="saveComment(item)">
								<v-btn fab color="success" x-small>
									<v-icon>mdi-comment-plus</v-icon>
								</v-btn>
								<template v-slot:input>
									<v-text-field
										v-model="newComment"
										label="Comentario"
										single-line
										counter
									></v-text-field>
								</template>
							</v-edit-dialog>
						</span>
						<v-btn
							x-small
							fab
							color="error"
							class="mr-2 ml-2"
							@click="deleteItem(item._id)"
						>
							<v-icon>mdi-delete</v-icon>
						</v-btn>
					</template>
				</v-data-table>
			</v-col>
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
								:id-place="idPlace"
								:back="() => (stepper = 1)"
								:close="closeDialog"
							/>
							<payments-form-dates
								v-if="visible == 2"
								:id-place="idPlace"
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
import { mapActions, mapGetters } from 'vuex';
import PaymentsFormDates from '@/components/payments/PaymentsFormDates';
import PaymentsFormLodging from '@/components/payments/PaymentsFormWithLodging';
import { generatePdfReport, generateCsvReport } from '@/service/payments';
import moment from 'moment';

export default {
	name: 'Payments',
	components: {
		PaymentsFormDates,
		PaymentsFormLodging,
	},
	data() {
		return {
			fields: [
				{ value: 'startDate', text: 'Inicio' },
				{ value: 'endDate', text: 'Fin' },
				{ value: 'mount', text: 'Monto' },
				{ value: 'voucher', text: 'Voucher' },
				{ value: 'comments', text: 'Comentarios' },
				{ text: 'Acción', value: 'actions' },
			],
			stepper: 1,
			dialog: false,
			newComment: '',
			selected: {},
			index: '',
			wordForFilter: '',
			itemFiltered: [],
			visible: null,
		};
	},
	computed: {
		...mapGetters({
			countLodgings: 'Lodging/countLogingsPlace',
			idPlace: 'Lodging/place',
			loading: 'Payments/loading',
			lodgings: 'Lodging/lodgingsPlace',
			message: 'Payments/message',
			payments: 'Payments/payments',
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
		moment.locale('es');
		this.fetchOnePlace(this.idPlace);
		this.fetchLodgingsForPlace(this.idPlace);
		this.fetchPayments(this.idPlace);
	},
	methods: {
		async deleteItem(id) {
			(await confirm('Estas seguro de que quieres eliminar este pago?')) && this.delete(id);
			this.fetchPayments(this.idPlace);
		},
		formatStartDate(item) {
			return moment(item.startDate).format('LL');
		},
		formatEndDate(item) {
			return moment(item.endDate).format('LL');
		},
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
		...mapActions({
			fetchLodgingsForPlace: 'Lodging/fetchLodgingsForPlace',
			fetchOnePlace: 'Place/fetchOnePlace',
			fetchPayments: 'Payments/fetchPaymentsOfThePlace',
			delete: 'Payments/deleteOnePayment',
			edit: 'Payments/editPayment',
		}),
	},
};
</script>
