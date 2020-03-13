<template>
	<div>
		<v-card outlined>
			<!-- header -->
			<v-list-item one-line>
				<v-list-item-content>
					<div class="headline">
						Gestión pagos de
						<span class="secondary--text">{{ place.name }}</span>
					</div>
				</v-list-item-content>
			</v-list-item>
			<!-- forms -->
			<v-card-text>
				<v-card-title class="text-secondary">
					Agregar nuevo
				</v-card-title>
				<v-container fluid>
					<v-row>
						<v-col cols="12" sm="6" md="4" lg="3">
							<v-select
								id="state"
								v-model="visible"
								dense
								solo
								rounded
								:items="[
									{ value: null, text: 'Seleccione', disabled: true },
									{ value: 0, text: 'Agregar pago por alojamiento' },
									{ value: 1, text: 'Agregar pago por fecha' },
								]"
							></v-select>
						</v-col>
						<v-col cols="12">
							<v-window id="collapse-1" v-model="visible" vertical>
								<v-window-item>
									<payments-form-lodging
										:payments="items"
										:lodgings="lodgings"
										:place="place"
									/>
								</v-window-item>
								<v-window-item>
									<payments-form :count="count" />
								</v-window-item>
							</v-window>
						</v-col>
					</v-row>
				</v-container>
			</v-card-text>
			<!-- table -->
			<v-card-title>
				Lista de Pagos
				<v-spacer />
				<v-spacer />
				<v-spacer />
				<v-text-field
					v-model="wordForFilter"
					dense
					solo
					rounded
					append-icon="mdi-magnify"
					label="Filtrar"
					hide-details
				></v-text-field>
			</v-card-title>
			<v-card-text>
				<v-data-table
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
						<v-icon color="error" small @click="deleteItem(item._id)">
							mdi-close
						</v-icon>
					</template>
				</v-data-table>
			</v-card-text>
			<v-card-text v-if="!items.length > 0"
				><v-col class="text-center">
					<h6>No hay pagos registrados</h6>
				</v-col>
			</v-card-text>
		</v-card>
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
				{ text: 'Acción', value: 'actions' },
			],
			selected: {},
			index: '',
			wordForFilter: '',
			itemFiltered: [],
			visible: null,
		};
	},
	watch: {
		items() {
			if (this.wordForFilter === '') {
				this.itemFiltered = this.items;
			}
		},
	},
	methods: {
		async deleteItem(id) {
			confirm('Are you sure you want to delete this item?') && (await this.delete(id));
			this.updatePayments(this.idPlace);
		},
		onRowSelected(items) {
			this.selected = items[0];
		},
		onClose(close) {
			close();
			this.$refs.selectableTable.clearSelected();
		},
		cutText(text) {
			const extencion = text.split('.').pop();
			if (text.length > 10) {
				return `${text.split('.')[0].substr(0, 10)}...${extencion}`;
			}
			return text;
		},
		saveComment(item) {
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
