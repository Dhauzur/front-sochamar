<template>
	<v-row>
		<!-- Account -->
		<v-col cols="12">
			<v-text-field
				id="cuenta"
				v-model="$v.account.$model"
				type="text"
				placeholder="Nombre de cuenta"
				label="Cuenta"
				dense
				outlined
				:error-messages="accountErrors"
				@input="$v.account.$touch()"
				@blur="$v.account.$touch()"
			></v-text-field>
		</v-col>
		<!-- mount -->
		<v-col cols="12">
			<v-text-field
				id="total"
				v-model="$v.mount.$model"
				type="number"
				placeholder="Ej: 10000"
				label="Total"
				dense
				outlined
				:error-messages="mountErrors"
				@input="$v.mount.$touch()"
				@blur="$v.mount.$touch()"
			></v-text-field>
		</v-col>
		<!-- voucher -->
		<v-col cols="12">
			<v-file-input
				id="voucher"
				ref="voucher"
				v-model="voucher"
				label="Voucher"
				dense
				clearable
				outlined
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
				regresar
			</v-btn>
			<v-btn small text color="primary" @click="close">
				Cerrar
			</v-btn>
			<v-btn :loading="loading" text small color="primary" @click="submit">
				Guardar
			</v-btn>
		</v-col>
	</v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import moment from 'moment';

export default {
	name: 'PaymentsForm',
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
			account: '',
			menu: null,
			text: '',
			mount: '',
			voucher: null,
			voucherName: null,
			comments: '',
			setDateStart: moment().format('YYYY-MM-DD'),
			setDateEnd: moment()
				.add(30, 'd')
				.format('YYYY-MM-DD'),
		};
	},
	computed: {
		mountErrors() {
			const errors = [];
			if (!this.$v.mount.$dirty) return errors;
			!this.$v.mount.required && errors.push('El monto es querido');
			return errors;
		},
		accountErrors() {
			const errors = [];
			if (!this.$v.account.$dirty) return errors;
			!this.$v.account.required && errors.push('nombre requerido');
			return errors;
		},
		...mapGetters({ loading: 'Payments/loadingSave' }),
	},
	validations: {
		mount: {
			required,
		},
		account: {
			required,
		},
	},
	methods: {
		clearInputs() {
			this.mount = '';
			this.account = [];
			this.voucher = null;
			this.$v.$reset();
		},
		async submit() {
			// validations
			this.$v.$touch();
			if (!this.$v.$invalid) {
				let form = new FormData();
				form.set('idPlace', this.idPlace);
				form.set('account', this.account);
				form.set('startDate', this.setDateStart);
				form.set('endDate', this.setDateEnd);
				form.set('mount', this.mount);
				form.set('voucher', this.voucher);
				await this.save(form);
				this.updatePayments(this.idPlace);
				this.clearInputs();
				this.close();
			}
		},
		...mapActions({
			save: 'Payments/savePayment',
			updatePayments: 'Payments/fetchPaymentsOfThePlace',
		}),
	},
};
</script>
