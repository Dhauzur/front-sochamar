<template>
	<div>
		<b-container>
			<b-row id="nav" class="justify-content-center">
				<b-col md="12" lg="10" class="background-module pb-3 px-4">
					<h3 class="my-4">Gestión de Pagos</h3>
					<b-row class="mb-3">
						<b-col cols="3">
							<label for="total" class="mb-0 mt-2">Total</label>
							<b-form-input
								id="total"
								v-model="mount"
								size="sm"
								placeholder="Ej: 10000"
							></b-form-input>
						</b-col>
						<b-col cols="3">
							<label for="in" class="mb-0 mt-2">Ingreso</label>
							<b-form-group id="in" label-for="input-1" class="pb-0 mb-0">
								<b-form-input
									id="in"
									v-model="startDate"
									size="sm"
									placeholder="Ej: 10000"
									type="date"
								/>
							</b-form-group>
						</b-col>
						<b-col cols="3">
							<label for="out" class="mb-0 mt-2">Salida</label>
							<b-form-group id="out" label-for="input-1" class="pb-0 mb-0">
								<b-form-input
									id="out"
									v-model="endDate"
									size="sm"
									placeholder="Ej: 10000"
									type="date"
								/>
							</b-form-group>
						</b-col>
						<b-col cols="1">
							<label>
								Voucher
							</label>
							<span
								v-if="voucher"
								class="btn btn-sm btn-danger"
								@click="clearInputFile"
								>Quitar</span
							>
							<label v-else for="voucher" class="btn btn-sm btn-primary">
								Subir
							</label>
							<b-form-file
								id="voucher"
								ref="voucher"
								type="file"
								class="d-none"
								@change="e => (voucher = e.target.files[0])"
							/>
						</b-col>
						<b-col cols="1" class="mt-4">
							<b-button variant="primary" class="btn-sm mt-2" @click="submit"
								>Pagar</b-button
							>
						</b-col>
					</b-row>
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
								:items="items"
								selectable
								class="table table-bordered table-hover"
								select-mode="single"
								responsive="sm"
								@row-selected="onRowSelected"
							>
								<template v-slot:cell(voucher)="row">
									<a
										v-if="row.item.voucher"
										:href="`${api}/${row.item.voucher}`"
										target="_black"
										>Ver</a
									>
									<div v-else>
										<label for="voucherList"><a>Agregar</a></label>
										<b-form-file
											id="voucherList"
											ref="voucherList"
											type="file"
											class="d-none"
											@change="
												e => (row = row.item.voucher = e.target.files[0])
											"
										/>
									</div>
								</template>
								<template v-slot:cell(comments)="row">
									<b-form-input
										v-if="row.rowSelected"
										:value="row.value"
										type="text"
										size="sm"
										class="mr-1 text-left"
										@focus="editMode = !editMode"
										@blur="item => update(item.target.value, row.item)"
									/>
									<h6 v-else>
										{{ row.item.comments }}
									</h6>
								</template>
							</b-table>
						</b-col>
					</b-row>
					<b-row v-else
						><b-col>
							No hay pagos registrados
						</b-col></b-row
					>
					<b-row v-if="editMode">
						<b-col>
							<b-button variant="primary" block>Guardar</b-button>
						</b-col>
					</b-row>
				</b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script>
import { api_absolute } from '@/config/index.js';

export default {
	props: {
		company: {
			type: Object,
			required: true,
			default: () => {},
		},
		save: {
			type: Function,
			required: true,
		},
		edit: {
			type: Function,
			required: true,
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
	},
	data() {
		return {
			api: api_absolute,
			idCompany: this.$route.params.company,
			form: new FormData(),
			editMode: false,
			startDate: this.range.startDate,
			endDate: this.range.endDate,
			mount: '',
			voucher: null,
			voucherList: null,
			comments: '',
			fields: [
				{ key: 'startDate', label: 'Inicio' },
				{ key: 'endDate', label: 'Fin' },
				{ key: 'mount', label: 'Monto' },
				{ key: 'voucher', label: 'Voucher' },
				{ key: 'comments', label: 'Comentarios' },
			],
			selected: [],
		};
	},
	watch: {
		range() {
			this.startDate = this.range.startDate;
			this.endDate = this.range.endDate;
		},
	},
	methods: {
		clearInputFile() {
			this.$refs['voucher'].reset();
			this.voucher = null;
		},
		update(event, row) {
			this.$refs.selectableTable.clearSelected();
			row.comments = event;
			this.form.set('startDate', row.startDate);
			this.form.set('endDate', row.endDate);
			this.form.set('mount', row.mount);
			this.form.set('comments', row.comments);
			this.form.append('voucher', row.voucher);
			this.editMode = !this.editMode;
			this.edit({ payload: this.form, id: row._id });
			this.updatePayments(this.idCompany);
		},
		submit() {
			this.form.set('idCompany', this.idCompany);
			this.form.set('startDate', this.startDate);
			this.form.set('endDate', this.endDate);
			this.form.set('mount', this.mount);
			this.form.set('comments', this.comments);
			this.form.append('voucher', this.voucher);
			this.save(this.form);
			this.updatePayments(this.idCompany);
		},
		onRowSelected(items) {
			this.selected = items;
		},
	},
};
</script>
