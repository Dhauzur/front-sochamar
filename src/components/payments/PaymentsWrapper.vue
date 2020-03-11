<template>
	<div>
		<b-container>
			<v-row id="nav" class="justify-content-center">
				<v-col md="12" lg="12" class="pb-3 px-4">
					<h3 class="my-4">
						Gestión pagos de
						<span class="secondary--text">{{ place.name }}</span>
					</h3>
					<v-row>
						<v-col cols="12" class="mb-3 text-left"><h6>Agregar nuevo</h6></v-col>
						<v-col cols="4">
							<b-form-select
								id="state"
								v-model="inputSelectLodgingOrNew"
								size="sm"
								:options="[
									{ value: null, text: 'Seleccione', disabled: true },
									{ value: 0, text: 'Agregar pago por alojamiento' },
									{ value: 1, text: 'Agregar pago por fecha' },
								]"
								@change="areaExpanded"
							></b-form-select>
						</v-col>
					</v-row>
					<v-row class="mb-5">
						<v-col>
							<b-collapse
								v-if="lodgings"
								id="collapse-1"
								v-model="visibleLodgingForm"
								class="mt-2"
							>
								<payments-form-lodging
									:payments="items"
									:lodgings="lodgings"
									:place="place"
								/>
							</b-collapse>
							<h6 v-if="!lodgings && visibleLodgingForm" class="text-left mt-1 ml-1">
								No hay hospedajes
							</h6>
						</v-col>
						<v-col cols="12"
							><b-collapse id="collapse-4" v-model="visible" class="mt-2">
								<payments-form :count="count" /> </b-collapse
						></v-col>
					</v-row>
					<v-row class="background-into-module mr-2 mb-3">
						<v-col v-if="itemFiltered.length > 0" cols="12">
							<v-data-table
								:headers="fields"
								:items="itemFiltered"
								:items-per-page="5"
								class="elevation-1"
							>
								<template v-slot:item.voucher="props">
									<v-btn text :href="props.item.voucher.url" small>
										{{ props.item.voucher.name }}</v-btn
									>
								</template>
								<template v-slot:item.comments="props">
									<v-edit-dialog
										:return-value.sync="props.item.comments"
										@save="saveComment(props.item)"
									>
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
							</v-data-table>
						</v-col>
					</v-row>
					<v-row v-if="!items.length > 0"
						><v-col class="text-center">
							<h6>No hay pagos registrados</h6>
						</v-col>
					</v-row>
					<v-row align-h="end">
						<v-col md="4" class="m-2 ">
							<b-form-input
								v-model="wordForFilter"
								size="sm"
								placeholder="Filtrar por monto o fecha"
								@input="onChange"
							></b-form-input>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</b-container>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
import PaymentsForm from '@/components/payments/PaymentsForm';
import PaymentsFormLodging from '@/components/payments/PaymentsFormWithLodging';

export default {
	name: 'PaymentsWrapper',
	components: { PaymentsForm, PaymentsFormLodging },
	props: {
		place: {
			type: Object,
			required: true,
			default: () => {},
		},
		loading: {
			type: Boolean,
			required: false,
			default: false,
		},
		lodgings: {
			type: Array,
			required: false,
			default: () => [],
		},
		delete: {
			type: Function,
			required: false,
		},
		updatePayments: {
			type: Function,
			required: true,
		},
		items: {
			type: Array,
			required: false,
			default: () => [],
		},
		range: {
			type: Object,
			required: false,
			default: () => {},
		},
		count: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			showModal: false,
			idPlace: this.$route.params.place,
			fields: [
				{ value: 'startDate', text: 'Inicio' },
				{ value: 'endDate', text: 'Fin' },
				{ value: 'mount', text: 'Monto' },
				{ value: 'voucher', text: 'Voucher' },
				{ value: 'comments', text: 'Comentarios' },
				{ value: 'delete', text: '' },
			],
			selected: {},
			index: '',
			wordForFilter: '',
			itemFiltered: [],
			visible: false,
			visibleLodgingForm: false,
			inputSelectLodgingOrNew: null,
		};
	},
	watch: {
		/**
		 * listener if a row is selected
		 */
		selected(newVal) {
			console.log(newVal);

			this.showModal = true;
		},
		items() {
			if (this.wordForFilter === '') {
				this.itemFiltered = this.items;
				console.log(this.itemFiltered);
			}
		},
	},
	methods: {
		async deletePayment(id) {
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
		onChange() {
			this.itemFiltered = this.items.filter(item => {
				return (
					item.mount.toLowerCase().indexOf(this.wordForFilter.toLowerCase()) > -1 ||
					item.startDate.toLowerCase().indexOf(this.wordForFilter.toLowerCase()) > -1 ||
					item.endDate.toLowerCase().indexOf(this.wordForFilter.toLowerCase()) > -1
				);
			});
		},
		cutText(text) {
			const extencion = text.split('.').pop();
			if (text.length > 10) {
				return `${text.split('.')[0].substr(0, 10)}...${extencion}`;
			}
			return text;
		},
		areaExpanded() {
			if (this.inputSelectLodgingOrNew === 1) {
				this.visibleLodgingForm = false;
				this.visible = true;
			} else if (this.inputSelectLodgingOrNew === 0) {
				this.visible = false;
				this.visibleLodgingForm = true;
			} else {
				this.visible = false;
				this.visibleLodgingForm = false;
			}
		},
		saveComment(item) {
			console.log(item);

			let form = new FormData();
			form.set('comments', item.comments);
			this.edit({ payload: form, id: item._id });
		},
		...mapActions({
			edit: 'Payments/editPayment',
		}),
	},
};
</script>
