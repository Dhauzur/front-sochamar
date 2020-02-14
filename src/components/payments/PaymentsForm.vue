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
								size="sm"
								placeholder="Ej: 10000"
							></b-form-input>
						</b-col>
						<b-col cols="3">
							<label for="in" class="mb-0 mt-2">Ingreso</label>
							<b-form-group id="in" label-for="input-1" class="pb-0 mb-0">
								<b-form-input
									id="in"
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
							<label for="voucher" class="btn btn-primary btn-sm">
								Subir
							</label>
							<input id="voucher" type="file" class="d-none" />
						</b-col>
						<b-col cols="1" class="mt-4">
							<b-button variant="primary" class="btn-sm mt-2">Pagar</b-button>
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
									<a :href="row.item.voucher">Ver</a>
								</template>
								<template v-slot:cell(comments)="row">
									<b-form-input
										v-if="row.rowSelected"
										:value="row.value"
										type="text"
										size="sm"
										class="mr-1"
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
export default {
	props: {
		company: {
			type: Object,
			required: true,
			default: () => {},
		},
	},
	data() {
		return {
			editMode: false,
			form: {
				start: '',
				end: '',
				mount: '',
				voucher: null,
				comments: '',
			},
			fields: [
				{ key: 'start', label: 'Inicio' },
				{ key: 'end', label: 'Fin' },
				{ key: 'mount', label: 'Monto' },
				{ key: 'voucher', label: 'Voucher' },
				{ key: 'comments', label: 'Comentarios' },
			],
			selected: [],
			items: [
				{
					start: '10-10-2010',
					end: '20-10-2010',
					mount: '150000',
					voucher: 'https://bootstrap-vue.js.org/docs/components/table/#tables',
					comments: '',
				},
				{
					start: '10-10-2010',
					end: '20-10-2010',
					mount: '150000',
					voucher: 'https://bootstrap-vue.js.org/docs/components/table/#tables',
					comments: 'Todo bien',
				},
				{
					start: '10-10-2010',
					end: '20-10-2010',
					mount: '150000',
					voucher: 'https://bootstrap-vue.js.org/docs/components/table/#tables',
					comments: 'Todo Excelente',
				},
				{
					start: '10-10-2010',
					end: '20-10-2010',
					mount: '150000',
					voucher: 'https://bootstrap-vue.js.org/docs/components/table/#tables',
					comments: 'Todo Excelente',
				},
			],
		};
	},
	methods: {
		update(event, row) {
			row.comments = event;
			this.$refs.selectableTable.clearSelected();
			this.editMode = !this.editMode;
		},
		onRowSelected(items) {
			this.selected = items;
		},
	},
};
</script>
