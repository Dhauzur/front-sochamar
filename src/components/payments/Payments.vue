<template>
	<v-container>
		<v-row class="px-2">
			<v-col cols="12">
				Agregar nuevo
			</v-col>
			<v-col cols="12">
				<v-radio-group v-model="visible" row>
					<v-radio label="Agregar pago por alojamiento" value="1"></v-radio>
					<v-radio label="Agregar pago por fecha" value="2"></v-radio>
				</v-radio-group>
			</v-col>
			<v-col cols="12">
				<payments-form-lodging v-if="visible == 1" :id-place="idPlace" />
				<payments-form-dates v-if="visible == 2" :id-place="idPlace" />
			</v-col>
			<v-col cols="12" class="mx-auto">
				<v-card-title>
					Lista de Pagos
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
					v-if="payments.length"
					dense
					:search="wordForFilter"
					:headers="fields"
					:items="payments"
					:items-per-page="5"
				>
					<template v-slot:item.voucher="props">
						<v-btn text :href="props.item.voucher.url" small>
							{{ props.item.voucher.name }}
						</v-btn>
					</template>
					<template v-slot:item.comments="props">
						<v-edit-dialog
							:return-value.sync="props.item.comments"
							@save="saveComment(props.item)"
						>
							<div v-for="(element, i) in props.item.comments" :key="i">
								{{ element }}
							</div>
							<template v-slot:input>
								<v-text-field
									v-model="newComment"
									label="Comentario"
									single-line
									counter
								></v-text-field>
							</template>
						</v-edit-dialog>
					</template>
					<template v-slot:item.actions="{ item }">
						<v-btn fab x-small color="error" @click="deleteItem(item._id)">
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
			idPlace: 'Lodging/place',
			payments: 'Payments/payments',
			message: 'Payments/message',
			loading: 'Payments/loading',
			countLodgings: 'Lodging/countLogingsPlace',
			lodgings: 'Lodging/lodgingsPlace',
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
