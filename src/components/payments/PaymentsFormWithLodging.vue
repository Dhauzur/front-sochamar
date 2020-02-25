<template>
	<b-row>
		<b-col cols="12" md="6" lg="4">
			<label for="date" class="mb-0 mt-2">Fecha</label>
			<b-form-select
				id="date"
				v-model="$v.lodgingSelected.$model"
				size="sm"
				:options="optionsLodgings"
			></b-form-select>
		</b-col>
		<b-col cols="12" md="6" lg="2"
			><label for="mount" class="mb-0 mt-2">Monto</label
			><b-form-input
				id="mount"
				v-model="$v.mount.$model"
				size="sm"
				type="number"
				placeholder="Ej: 10000"
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
			<b-button block variant="primary" class="btn-sm mt-2" @click="submit">
				Agregar Pago
			</b-button>
			<small v-if="errors" class="text-danger">Llene el formulario correctamente</small>
		</b-col>
	</b-row>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';

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
	},
	data() {
		return {
			form: new FormData(),
			idCompany: this.$route.params.company,
			lodgingSelected: null,
			mount: '',
			voucher: null,
			errors: false,
		};
	},
	computed: {
		optionsLodgings() {
			const result = this.lodgings.filter(({ idLodging }) =>
				this.payments.includes(idLodging)
			);
			console.log(result);
			let lodging = this.lodgings.map(item => {
				return {
					text: `${item.start} - ${item.end}`,
					value: { id: item._id, start: item.start, end: item.end },
				};
			});
			lodging.push({ value: null, text: 'Seleccione' });
			return lodging;
		},
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
				this.form.set('idCompany', this.idCompany);
				this.form.set('idLodging', this.lodgingSelected.id);
				this.form.set('startDate', this.lodgingSelected.start);
				this.form.set('endDate', this.lodgingSelected.end);
				this.form.set('mount', this.mount);
				this.form.append('voucher', this.voucher);
				await this.save(this.form);
				this.clearInputs();
				this.updatePayments(this.idCompany);
			}
		},
		...mapActions({
			save: 'Payments/savePayment',
			updatePayments: 'Payments/fetchPaymentsOfTheCompany',
		}),
	},
};
</script>

<style lang="scss" scoped></style>
