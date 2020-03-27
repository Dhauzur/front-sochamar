<template>
	<div>
		<v-row v-if="Array.isArray(optionsLodgings) && optionsLodgings.length">
			<v-col cols="12" sm="6" md="4" lg="3">
				<v-select
					id="date"
					v-model="$v.lodgingSelected.$model"
					dense
					label="Seleccione hospedaje"
					outlined
					:items="optionsLodgings"
					:error-messages="lodgingSelectedErrors"
					@change="setMount"
					@input="$v.lodgingSelected.$touch()"
					@blur="$v.lodgingSelected.$touch()"
				></v-select>
			</v-col>
			<v-col cols="12" sm="6" md="4" lg="3">
				<v-text-field
					id="mount"
					v-model="mount"
					type="number"
					readonly
					dense
					outlined
					label="Monto"
					placeholder="Ej: 10000 CLP"
				></v-text-field>
			</v-col>
			<v-col cols="12" sm="6" md="4" lg="3">
				<v-file-input
					id="voucher"
					ref="voucher"
					v-model="$v.voucher.$model"
					label="Voucher"
					dense
					outlined
					clearable
					prepend-icon="mdi-paperclip"
					:error-messages="voucherErrors"
					@input="$v.voucher.$touch()"
					@blur="$v.voucher.$touch()"
				>
					<template v-slot:selection="{ text }">
						<v-chip small label color="secondary">
							{{ text }}
						</v-chip>
					</template>
				</v-file-input>
			</v-col>
			<v-col cols="12" sm="6" md="3" lg="3">
				<v-btn :loading="loading" block color="primary" class="mt-2" small @click="submit">
					Agregar Pago
				</v-btn>
			</v-col>
		</v-row>
		<v-row v-else>
			<v-col>
				<h6 class="text-left mt-1 ml-1 accent--text">
					No tiene hospedajes por pagar
				</h6>
			</v-col>
		</v-row>
	</div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import { mapActions, mapGetters } from 'vuex';

export default {
	name: 'PaymentsWithLodging',
	mixins: [validationMixin],
	props: {
		idPlace: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			form: new FormData(),
			lodgingSelected: null,
			mount: '',
			voucher: null,
			errors: false,
		};
	},
	computed: {
		voucherErrors() {
			const errors = [];
			if (!this.$v.voucher.$dirty) return errors;
			!this.$v.voucher.required && errors.push('Campo requerido');
			return errors;
		},
		lodgingSelectedErrors() {
			const errors = [];
			if (!this.$v.lodgingSelected.$dirty) return errors;
			!this.$v.lodgingSelected.required && errors.push('Campo requerido');
			return errors;
		},
		optionsLodgings() {
			let index = [];
			let lod = [];
			let pay = [];
			if (this.lodgings) lod = [...this.lodgings];
			if (this.payments) pay = [...this.payments];
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
			return lodging;
		},
		...mapGetters({
			loading: 'Payments/loadingSave',
			place: 'Lodging/place',
			payments: 'Payments/payments',
			message: 'Payments/message',
			countLodgings: 'Lodging/countLogingsPlace',
			lodgings: 'Lodging/lodgingsPlace',
		}),
	},
	validations: {
		mount: {
			required,
		},
		voucher: {},
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
