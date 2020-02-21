<template>
	<div>
		<b-container>
			<b-row id="nav" class="justify-content-center">
				<b-col md="10" lg="8" class="background-module pb-3 px-4">
					<h3 class="my-4">Gestión de Pagos</h3>
					<payments-form :count="count" />
					<b-row class="mb-3 mt-3">
						<b-col>
							<h4>{{ company.name }}</h4>
						</b-col>
					</b-row>
					<b-row
						v-if="items.length > 0"
						style="max-height: 150px; overflow-y: auto;"
						class="background-into-module mr-2 mb-3"
					>
						<b-col>
							<b-table
								ref="selectableTable"
								striped
								hover
								:fields="fields"
								:items="itemFiltered"
								selectable
								class="table table-bordered table-hover"
								select-mode="single"
								responsive="sm"
								@row-selected="onRowSelected"
							>
								<template v-slot:cell(voucher)="row">
									<b-link
										v-if="row.item.voucher"
										class="linka"
										:href="`${api}/${row.item.voucher}`"
										target="_blank"
										>{{ cutText(row.item.voucher) }}</b-link
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
							size="lg"
							centered
							hide-footer
							no-close-on-backdrop
						>
							<template v-slot:modal-header="{ close }">
								<!-- Emulate built in modal header close button action -->
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
					<b-row v-else
						><b-col>
							No hay pagos registrados
						</b-col></b-row
					>
					<b-row v-if="count === 0"
						><b-col>
							No hay Hospedajes
						</b-col></b-row
					>
					<b-col cols="6" offset="6">
						<b-form-input
							v-model="wordForFilter"
							size="sm"
							placeholder="Filtrar por monto o fecha"
							@input="onChange"
						></b-form-input>
					</b-col>
				</b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script>
import { api_absolute } from '@/config/index.js';
import PaymentsForm from '@/components/payments/PaymentsForm';
export default {
	name: 'PaymentsWrapper',
	components: { PaymentsForm },
	props: {
		company: {
			type: Object,
			required: true,
			default: () => {},
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
			api: api_absolute,
			idCompany: this.$route.params.company,
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
			this.updatePayments(this.idCompany);
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
	},
};
</script>
