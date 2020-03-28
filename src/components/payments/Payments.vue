<template>
	<v-container>
		<v-row>
			<v-dialog v-model="dialog" max-width="440" persistent>
				<v-stepper v-model="stepper" class="elevation-12">
					<v-stepper-header>
						<v-stepper-step :complete="stepper > 1" step="1">
							Seleccione
						</v-stepper-step>
						<v-divider></v-divider>
						<v-stepper-step :complete="stepper > 2" step="2">
							Formulario
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
			<v-col cols="12" class="mx-auto">
				<v-card-title>
					Lista de Pagos
					<v-btn small color="primary" class="ma-3" @click="dialog = true">
						<v-icon>mdi-plus</v-icon>
					</v-btn>
					<v-spacer></v-spacer>
					<v-text-field
						v-model="wordForFilter"
						dense
						outlined
						append-icon="mdi-magnify"
						label="Filtrar"
						hide-details
					></v-text-field>
				</v-card-title>
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
				>
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
		</v-row>
	</v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import PaymentsFormDates from '@/components/payments/PaymentsFormDates';
import PaymentsFormLodging from '@/components/payments/PaymentsFormWithLodging';
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
			await this.delete(id);
			this.fetchPayments(this.idPlace);
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
			const date = moment().format('YYYY-MM-DD');
			const temp = [...item.comments, `${this.newComment} - ${date}`];
			this.edit({ comments: temp, id: item._id })
				.then((this.newComment = ''))
				.then(this.fetchPayments(this.idPlace));
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
