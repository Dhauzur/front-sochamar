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
				<payments-form-lodging v-if="visible == 1" />
				<payments-form-dates v-if="visible == 2" />
			</v-col>
			<v-col cols="12" class="mx-auto">
				<!-- <v-card-title>
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
				</v-card-title> -->
				<!-- <v-data-table
					v-if="itemFiltered.length"
					:search="wordForFilter"
					:headers="fields"
					:items="itemFiltered"
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
							<v-btn fab x-small color="error" @click="deleteItem(item._id)">
								<v-icon>text-box-search</v-icon>
							</v-btn>
							{{ props.item.comments }}
							<template v-slot:input>
								<v-text-field
									v-model="props.item.comments"
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
				</v-data-table> --> </v-col
			><v-col v-if="lodgings.length == 0" class="text-center">
				<h6>No hay pagos registrados</h6>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import PaymentsFormDates from '@/components/payments/PaymentsFormDates';
import PaymentsFormLodging from '@/components/payments/PaymentsFormWithLodging';

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
			selected: {},
			index: '',
			wordForFilter: '',
			itemFiltered: [],
			visible: null,
		};
	},
	computed: {
		...mapGetters({
			place: 'Lodging/place',
			payments: 'Payments/payments',
			message: 'Payments/message',
			loading: 'Payments/loading',
			countLodgings: 'Lodging/countLogingsPlace',
			lodgings: 'Lodging/lodgingsPlace',
		}),
	},
	watch: {
		lodgings() {
			if (this.wordForFilter === '') {
				this.itemFiltered = this.lodgings;
			}
		},
		message(newVal) {
			this.$toasted.show(newVal.text, {
				type: newVal.type,
			});
		},
	},
	created() {
		this.fetchOnePlace(this.place);
		this.fetchLodgingsForPlace(this.place);
		this.fetchPayments(this.place);
	},
	methods: {
		async deleteItem(id) {
			await this.delete(id);
			this.updatePayments(this.idPlace);
		},
		onRowSelected(items) {
			this.selected = items[0];
		},
		onClose(close) {
			close();
			this.$refs.selectableTable.clearSelected();
		},
		saveComment(item) {
			let form = new FormData();
			form.set('comments', item.comments);
			this.edit({ payload: form, id: item._id });
		},
		...mapActions({
			fetchLodgingsForPlace: 'Lodging/fetchLodgingsForPlace',
			fetchOnePlace: 'Place/fetchOnePlace',
			fetchPayments: 'Payments/fetchPaymentsOfThePlace',
			deleteOnePayment: 'Payments/deleteOnePayment',
			edit: 'Payments/editPayment',
		}),
	},
};
</script>
