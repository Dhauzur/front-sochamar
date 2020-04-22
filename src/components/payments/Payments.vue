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
			<payments-table
				v-for="(item, index) in paymentsForMonth"
				:key="index"
				:payments-list="paymentsType"
				:title="item"
				:word-filter="wordForFilter"
				:id-place="idPlace"
				:loading="loading"
			></payments-table>
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
							<payments-form-account
								v-if="visible == 3"
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
import { mapGetters, mapActions } from 'vuex';
import PaymentsFormDates from '@/components/payments/PaymentsFormDates';
import PaymentsFormLodging from '@/components/payments/PaymentsFormWithLodging';
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
			idPlace: 'Lodging/place',
			paymentsType: 'Payments/paymentsType',
			loading: 'Payments/loading',
			message: 'Payments/message',
			paymentsForMonth: 'Payments/paymentsForMonth',
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
		this.fetchLodgingsForPlace(this.idPlace);
		this.fetchPayments(this.idPlace);
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
			fetchLodgingsForPlace: 'Lodging/fetchLodgingsForPlace',
			fetchPayments: 'Payments/fetchPaymentsOfThePlace',
		}),
	},
};
</script>
