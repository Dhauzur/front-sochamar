<template>
	<div>
		<b-container>
			<!-- skeleton loader -->
			<b-row v-if="loading" class="justify-content-center pt-5">
				<b-col>
					<div class="ph-item background-module border-0 pb-3 px-4">
						<div class="ph-col-12">
							<div class="ph-row">
								<div class="ph-col-4 empty big"></div>
								<div class="ph-col-4 big rounded"></div>
								<div class="ph-col-4 empty big"></div>
								<div class="mt-5 ph-col-12 big rounded"></div>
								<div class="ph-col-12 big rounded"></div>
								<div class="ph-col-12 big rounded"></div>
								<div class="ph-col-12 big rounded"></div>
							</div>
						</div>
					</div>
				</b-col>
			</b-row>
			<b-row v-else id="nav" class="justify-content-center">
				<b-col md="12" lg="12" class="background-module pb-3 px-4">
					<h3 class="my-4">
						Gestión pagos de <span style="color: orange">{{ place.name }}</span>
					</h3>
					<b-row>
						<b-col cols="12" class="mb-3 text-left"><h6>Agregar nuevo</h6></b-col>
						<b-col cols="4">
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
						</b-col>
					</b-row>
					<b-row class="mb-5">
						<b-col>
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
						</b-col>
						<b-col cols="12"
							><b-collapse id="collapse-4" v-model="visible" class="mt-2">
								<payments-form :count="count" /> </b-collapse
						></b-col>
					</b-row>
					<b-row
						style="max-height: 150px; overflow-y: auto;"
						class="background-into-module mr-2 mb-3"
					>
						<b-col v-if="itemFiltered.length > 0" cols="12">
							<b-table
								ref="selectableTable"
								striped
								hover
								:fields="fields"
								:items="itemFiltered"
								selectable
								class="table table-hover"
								select-mode="single"
								responsive="sm"
								@row-selected="onRowSelected"
							>
								<template v-slot:cell(voucher)="row">
									<b-link
										v-if="row.item.voucher"
										:href="row.item.voucher.url"
										target="_blank"
										>{{ cutText(row.item.voucher.name) }}</b-link
									>

									<h6 v-else>Vacio</h6>
								</template>
								<template v-slot:cell(comments)="row">
									<h6>
										{{ row.item.comments }}
									</h6>
								</template>
								<template v-slot:cell(delete)="row">
									<b-button
										size="sm"
										variant="outline-danger"
										@click.stop="deletePayment(row.item._id)"
										>X</b-button
									>
								</template>
							</b-table>
						</b-col>
						<b-modal
							ref="edit-modal"
							size="xl"
							centered
							hide-footer
							no-close-on-backdrop
						>
							<template v-slot:modal-header="{ close }">
								<h5>Editar Pago</h5>
								<b-button
									size="sm"
									variant="outline-danger"
									@click.stop="onClose(close)"
								>
									X
								</b-button>
							</template>
							<template v-slot:default="{ hide }">
								<payments-form :item="selected" :on-close="onClose" :hide="hide" />
							</template>
						</b-modal>
					</b-row>
					<b-row v-if="!items.length > 0"
						><b-col class="text-center">
							<h6>No hay pagos registrados</h6>
						</b-col>
					</b-row>
					<b-row align-h="end">
						<b-col md="4" class="m-2 ">
							<b-form-input
								v-model="wordForFilter"
								size="sm"
								placeholder="Filtrar por monto o fecha"
								@input="onChange"
							></b-form-input>
						</b-col>
					</b-row>
				</b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script>
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
		edit: {
			type: Function,
			required: false,
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
			idPlace: this.$route.params.place,
			fields: [
				{ key: 'startDate', label: 'Inicio' },
				{ key: 'endDate', label: 'Fin' },
				{ key: 'mount', label: 'Monto' },
				{ key: 'voucher', label: 'Voucher' },
				{ key: 'comments', label: 'Comentarios' },
				{ key: 'delete', label: '' },
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
		selected(value) {
			if (value) this.$refs['edit-modal'].toggle('#toggle-btn');
		},
		items() {
			if (this.wordForFilter === '') {
				this.itemFiltered = this.items;
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
	},
};
</script>
