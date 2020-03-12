<template>
	<div>
		<v-form ref="form">
			<v-row class="mb-3 text-left">
				<!-- mount -->
				<v-col cols="12" md="6" lg="3">
					<v-text-field
						id="total"
						v-model="$v.mount.$model"
						size="sm"
						type="number"
						placeholder="Ej: 10000"
						label="Total"
						outlined
						rounded
						dense
						:error-messages="mountErrors"
						@input="$v.mount.$touch()"
						@blur="$v.mount.$touch()"
					></v-text-field>
				</v-col>
				<!-- dates -->
				<v-col cols="12" lg="4">
					<v-menu
						ref="menu"
						v-model="menu"
						:close-on-content-click="false"
						:return-value.sync="dates"
						transition="scale-transition"
						offset-y
						min-width="290px"
					>
						<template v-slot:activator="{ on }">
							<v-text-field
								v-model="dates"
								dense
								clearable
								outlined
								rounded
								label="Fecha de ingreso y salida"
								prepend-icon="mdi-event"
								:error-messages="datesErrors"
								@input="$v.dates.$touch()"
								@blur="$v.dates.$touch()"
								v-on="on"
							></v-text-field>
						</template>
						<v-date-picker
							v-model="dates"
							outlined
							rounded
							range
							:min="startDate"
							:max="endDate"
							no-title
							scrollable
						>
							<v-spacer></v-spacer>
							<v-btn text color="primary" @click="menu = false">Cancel</v-btn>
							<v-btn text color="primary" @click="$refs.menu.save(dates)">OK</v-btn>
						</v-date-picker>
					</v-menu>
				</v-col>
				<!-- voucher -->
				<v-col cols="12" md="6" lg="3">
					<v-file-input
						id="voucher"
						ref="voucher"
						v-model="voucher"
						label="voucher"
						dense
						clearable
						outlined
						rounded
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
				<v-col cols="12" md="12" lg="2">
					<v-btn dark small rounded color="primary" block class="mt-2" @click="submit">
						Guardar
					</v-btn>
				</v-col>
			</v-row>
		</v-form>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import moment from 'moment';

export default {
	name: 'PaymentsForm',
	mixins: [validationMixin],
	data() {
		return {
			dates: [],
			menu: null,
			text: '',
			idPlace: this.$route.params.place,
			form: new FormData(),
			startDate: '',
			endDate: '',
			mount: '',
			voucher: null,
			voucherName: null,
			comments: '',
			errors: '',
		};
	},
	computed: {
		mountErrors() {
			const errors = [];
			if (!this.$v.mount.$dirty) return errors;
			!this.$v.mount.required && errors.push('El monto es querido');
			return errors;
		},
		datesErrors() {
			const errors = [];
			if (!this.$v.dates.$dirty) return errors;
			!this.$v.dates.required && errors.push('campo requerido');
			return errors;
		},
		voucherErrors() {
			const errors = [];
			if (!this.$v.voucher.$dirty) return errors;
			!this.$v.voucher.required && errors.push('campo requerido');
			return errors;
		},
		setDateStart() {
			// set startdate from array dates
			if (moment(this.dates[0]).isBefore(moment(this.dates[1]))) {
				return this.dates[0];
			} else {
				moment(this.dates[1]).isBefore(moment(this.dates[0]));
				return this.dates[1];
			}
		},
		setDateEnd() {
			// set enddate from array dates
			if (moment(this.dates[0]).isAfter(moment(this.dates[1]))) {
				return this.dates[0];
			} else {
				moment(this.dates[1]).isAfter(moment(this.dates[0]));
				return this.dates[1];
			}
		},
		...mapGetters({ range: 'Lodging/rangeDatePayments' }),
	},
	validations: {
		mount: {
			required,
		},
		dates: {
			required,
		},
		voucher: {
			required,
		},
	},
	watch: {
		range() {
			this.startDate = this.range.startDate;
			this.endDate = this.range.endDate;
		},
	},
	methods: {
		clearInputFile(input) {
			this.$refs[input].reset();
			this.voucher = null;
		},
		async submit() {
			// validations
			this.$v.$touch();
			if (this.$v.$invalid) {
				this.errors = true;
			} else {
				this.form.set('idPlace', this.idPlace);
				this.form.set('startDate', moment(this.setEndStart).format('YYYY-MM-DD'));
				this.form.set('endDate', moment(this.setDateEnd).format('YYYY-MM-DD'));
				this.form.set('mount', this.mount);
				this.form.append('voucher', this.voucher);
				await this.save(this.form);
				this.updatePayments(this.idPlace);
			}
		},
		cutText(text) {
			const extencion = text.split('.').pop();
			if (text.length > 10) {
				return `${text.split('.')[0].substr(0, 10)}...${extencion}`;
			}
			return text;
		},
		...mapActions({
			save: 'Payments/savePayment',
			updatePayments: 'Payments/fetchPaymentsOfThePlace',
		}),
	},
};
</script>
