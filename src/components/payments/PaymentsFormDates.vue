<template>
	<v-row>
		<!-- mount -->
		<v-col cols="12" sm="6" md="3">
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
		<!-- dates -->
		<v-col cols="12" sm="6" md="3">
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
						readonly
						clearable
						outlined
						label="Fecha de ingreso y salida"
						:error-messages="datesErrors"
						@input="$v.dates.$touch()"
						@blur="$v.dates.$touch()"
						v-on="on"
					></v-text-field>
				</template>
				<v-date-picker
					v-model="dates"
					outlined
					range
					locale="es"
					:min="startDate"
					:max="endDate"
					no-title
					scrollable
				>
					<v-spacer></v-spacer>
					<v-btn text color="primary" @click="menu = false">Cancelar</v-btn>
					<v-btn text color="primary" @click="$refs.menu.save(dates)">OK</v-btn>
				</v-date-picker>
			</v-menu>
		</v-col>
		<!-- voucher -->
		<v-col cols="12" sm="6" md="3">
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
		<v-col cols="12" sm="6" md="3">
			<v-btn :loading="loading" dark small color="primary" block class="mt-2" @click="submit">
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
	},
	data() {
		return {
			dates: [],
			menu: null,
			text: '',
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
		...mapGetters({ range: 'Lodging/rangeDatePayments', loading: 'Payments/loadingSave' }),
	},
	validations: {
		mount: {
			required,
		},
		dates: {
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
				this.form.set('startDate', moment(this.setDateStart).format('YYYY-MM-DD'));
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
