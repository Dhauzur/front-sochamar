<template>
	<div>
		<b-row v-if="optionsLodgings.length <= 1">
			<b-col>
				<h6 class="text-left mt-1 ml-1">
					Todos los hospedajes pagos
				</h6>
			</b-col>
		</b-row>
		<b-row v-else>
			<b-col cols="12" md="6" lg="4">
				<label for="date" class="mb-0 mt-2">Fecha</label>
				<b-form-select
					id="date"
					v-model="$v.lodgingSelected.$model"
					size="sm"
					:options="optionsLodgings"
					@change="setMount"
				></b-form-select>
			</b-col>
			<b-col cols="12" md="6" lg="2"
				><label for="mount" class="mb-0 mt-2">Monto</label
				><b-form-input
					id="mount"
					v-model="$v.mount.$model"
					:disabled="true"
					size="sm"
					type="number"
					placeholder="Ej: 10000 CLP"
				></b-form-input>
			</b-col>
			<b-col cols="12" md="9" lg="3">
				<label for="voucher" class="mb-0 mt-2">Voucher</label>
				<b-form-file
					id="voucher"
					ref="voucher"
					v-model="$v.voucher.$model"
					size="sm"
					class="text-left"
					placeholder="Subir vaucher"
					drop-placeholder="Arrastrar aqui..."
					@change="e => (voucher = e.target.files[0])"
				></b-form-file>
			</b-col>
			<b-col cols="12" md="3" class="mt-4">
				<b-button
					:disabled="loading"
					block
					variant="primary"
					class="btn-sm mt-2"
					@click="submit"
				>
					Agregar Pago
					<b-spinner v-if="loading" small type="grow"></b-spinner>
				</b-button>
				<small v-if="errors" class="text-danger">Llene el formulario correctamente</small>
			</b-col>
		</b-row>
	</div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import { mapActions, mapGetters } from 'vuex';

export default {
	mixins: [validationMixin],
	props: {
		lodgings: {
			type: Array,
			required: false,
			default: () => [],
		},
		payments: {
			type: Array,
			required: false,
			default: () => [],
		},
		place: {
			type: Object,
			required: false,
			default: () => {},
		},
	},
	data() {
		return {
			form: new FormData(),
			idPlace: this.$route.params.place,
			lodgingSelected: null,
			mount: '',
			voucher: null,
			errors: false,
		};
	},
	computed: {
		optionsLodgings() {
			let index = [];
			let lod = [...this.lodgings];
			const pay = [...this.payments];
			const lodgingsPaid = pay.filter(
				({ idLodging }) => !lod.every(({ _id }) => idLodging === _id)
			);
			if (lodgingsPaid.length > 0) {
				for (const i in lodgingsPaid) {
					index.push(
						pay.map(({ idLodging }) => idLodging).indexOf(lodgingsPaid[i].idLodging)
					);
				}
				for (let i = index.length - 1; i >= 0; i--) {
					lod.splice(i, 1);
				}
			}
			let lodging = lod.map(item => {
				return {
					text: `${item.start} - ${item.end}`,
					value: item,
				};
			});
			lodging.push({ value: null, text: 'Seleccione' });
			return lodging;
		},
		...mapGetters({
			loading: 'Payments/loadingSave',
		}),
	},
	validations: {
		mount: {
			required,
		},
		voucher: {
			required,
		},
		lodgingSelected: {
			required,
		},
	},
	methods: {
		clearInputs() {
			this.$refs['voucher'].reset();
			this.voucher = null;
			this.lodgingSelected = null;
			this.mount = '';
			this.$v.$reset();
			this.errors = false;
		},
		async submit() {
			// validations
			this.$v.$touch();
			if (this.$v.$invalid) {
				this.errors = true;
			} else {
				this.form.set('idPlace', this.idPlace);
				this.form.set('idLodging', this.lodgingSelected.id);
				this.form.set('startDate', this.lodgingSelected.start);
				this.form.set('endDate', this.lodgingSelected.end);
				this.form.set('mount', this.mount);
				this.form.append('voucher', this.voucher);
				await this.save(this.form);
				this.clearInputs();
				this.updatePayments(this.idPlace);
			}
		},
		setMount() {
			this.lodgingSelected
				? (this.mount = this.lodgingSelected.mountTotal)
				: (this.mount = '');
		},
		...mapActions({
			save: 'Payments/savePayment',
			updatePayments: 'Payments/fetchPaymentsOfThePlace',
		}),
	},
};
</script>

<style lang="scss" scoped></style>
