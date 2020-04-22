<template>
	<v-container>
		<v-row>
			<v-col cols="12" class="pa-0 mx-auto"
				><p class="text-capitalize">
					Pagos registrados en {{ formatTittle(title) }}
				</p></v-col
			>
			<v-col cols="12" class="mx-auto">
				<v-data-table
					dense
					loading-text="Cargando... por favor espere"
					no-data-text="No hay pagos"
					:loading="loading"
					:search="wordFilter"
					:headers="fields"
					:items="paymentsList"
					:items-per-page="5"
					item-key="_id"
					class="caption"
				>
					<template v-slot:item.paymentType="{ item }">
						<span>{{ item.paymentType }}</span>
					</template>
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
			<!-- Alert dialog -->
			<v-dialog v-model="dialog" persistent max-width="290">
				<v-card>
					<v-card-title class="headline">Eliminar pago</v-card-title>
					<v-card-text>¿Estas seguro de que quieres eliminar este pago?</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary" text @click="dialog = false">Cancelar</v-btn>
						<v-btn color="primary" text @click="deletePayment">Aceptar</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-row>
	</v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
export default {
	name: 'PaymentsTable',
	props: {
		wordFilter: { type: String, default: '' },
		paymentsList: { type: Object, default: () => {} },
		idPlace: { type: String, required: true },
		loading: { type: Boolean },
		title: { type: String, default: '' },
	},
	data() {
		return {
			fields: [
				{ value: 'paymentType', text: 'Nombre' },
				{ value: 'startDate', text: 'Inicio' },
				{ value: 'endDate', text: 'Fin' },
				{ value: 'mount', text: 'Monto' },
				{ value: 'voucher', text: 'Voucher' },
				{ value: 'comments', text: 'Comentarios' },
				{ value: 'actions', text: 'Acción' },
			],
			newComment: '',
			selected: {},
			index: '',
			itemFiltered: [],
			visible: null,
			dialog: false,
			idPaymentDelete: null,
			paymentsListTable: [],
		};
	},
	computed: {
		...mapGetters({
			//countLodgings: 'Lodging/countLogingsPlace',
			//loading: 'Payments/loading',
			//message: 'Payments/message',
			//paymentsType: 'Payments/paymentsType',
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
		this.paymentsListTable.push(this.paymentsList);
		// this.fetchLodgingsForPlace(this.idPlace);
		//this.fetchPayments(this.idPlace);
	},
	methods: {
		async deleteItem(id) {
			this.dialog = true;
			this.idPaymentDelete = id;
		},
		async deletePayment() {
			const id = this.idPaymentDelete;
			this.dialog = false;
			await this.delete(id);
		},
		formatStartDate(item) {
			return moment(item.startDate).format('LL');
		},
		formatEndDate(item) {
			return moment(item.endDate).format('LL');
		},
		formatTittle(item) {
			return moment(item).format('MMMM');
		},
		async saveComment(item) {
			const date = moment().format('YYYY-MM-DD hh:mm');
			const temp = [...item.comments, `${date}: ${this.newComment}`];
			await this.edit({ comments: temp, id: item._id });
			this.newComment = '';
			await this.fetchPayments(this.idPlace);
		},
		...mapActions({
			fetchLodgingsForPlace: 'Lodging/fetchLodgingsForPlace',
			fetchPayments: 'Payments/fetchPaymentsOfThePlace',
			delete: 'Payments/deleteOnePayment',
			edit: 'Payments/editPayment',
		}),
	},
};
</script>
