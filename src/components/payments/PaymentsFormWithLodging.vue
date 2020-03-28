<template>
	<v-row>
		<v-col cols="12">
			<v-select
				id="date"
				v-model="$v.lodgingSelected.$model"
				dense
				no-data-text="No tiene hospedajes por pagar"
				label="Seleccione hospedaje"
				outlined
				:items="optionsLodgings"
				:error-messages="lodgingSelectedErrors"
				@change="setMount"
				@input="$v.lodgingSelected.$touch()"
				@blur="$v.lodgingSelected.$touch()"
			></v-select>
		</v-col>
		<v-col v-if="optionsLodgings.length" cols="12">
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
		<v-col v-if="optionsLodgings.length" cols="12">
			<v-file-input
				id="voucher"
				ref="voucher"
				v-model="voucher"
				label="Voucher"
				dense
				outlined
				clearable
				prepend-icon="mdi-paperclip"
			>
				<template v-slot:selection="{ text }">
					<v-chip small label color="secondary">
						{{ text }}
					</v-chip>
				</template>
			</v-file-input>
		</v-col>
		<v-col cols="12">
			<v-btn small text color="primary" @click="back">
				Regresar
			</v-btn>
			<v-btn small text color="primary" @click="close">
				Cancelar
			</v-btn>
			<v-btn :loading="loading" color="primary" text small @click="submit">
				Guardar
			</v-btn>
		</v-col>
	</v-row>
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
		back: {
			type: Function,
			required: true,
		},
		close: {
			type: Function,
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
		lodgingSelectedErrors() {
			const errors = [];
			if (this.optionsLodgings.length) {
				if (!this.$v.lodgingSelected.$dirty) return errors;
				!this.$v.lodgingSelected.required && errors.push('Campo requerido');
			}
			return errors;
		},
		optionsLodgings() {
			let index = [],
				lod = [],
				pay = [];
			this.lodgings.length && (lod = [...this.lodgings]);
			this.payments.length && (pay = [...this.payments]);

			const lodgingsPaid = pay.filter(
				({ idLodging }) => !lod.every(({ _id }) => idLodging === _id)
			);
			if (lodgingsPaid.length) {
				for (const i in lodgingsPaid) {
					lodgingsPaid[i].idLodging &&
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
