<template>
	<div>
		<b-row class="mb-3 text-left">
			<b-col cols="12" md="6" lg="3">
				<label for="Total" class="mb-0 mt-2"><small>Total</small></label>
				<b-form-input
					id="total"
					v-model="$v.mount.$model"
					:disabled="Boolean(item)"
					size="sm"
					type="number"
					placeholder="Ej: 10000"
				></b-form-input>
				<div v-if="$v.mount.$dirty" class="text-right">
					<small v-if="!$v.mount.required" class="text-danger">
						Campo requerido
					</small>
				</div>
			</b-col>
			<b-col cols="12" md="6" lg="2">
				<label for="in" class="mb-0 mt-2"><small>Ingreso</small></label>
				<b-form-group id="in" label-for="input-1" class="pb-0 mb-0">
					<b-form-input
						id="in"
						v-model="$v.startDate.$model"
						size="sm"
						type="date"
						:disabled="Boolean(item) || count === 0"
					/>
				</b-form-group>
				<div v-if="$v.startDate.$dirty" class="text-right">
					<small v-if="!$v.startDate.required" class="text-danger">
						Campo requerido
					</small>
				</div>
			</b-col>
			<b-col cols="12" md="6" lg="2">
				<label for="out" class="mb-0 mt-2"><small>Salida</small></label>
				<b-form-group id="out" label-for="input-1" class="pb-0 mb-0">
					<b-form-input
						id="out"
						v-model="$v.endDate.$model"
						size="sm"
						type="date"
						:disabled="Boolean(item) || count === 0"
					/>
				</b-form-group>
				<div v-if="$v.endDate.$dirty" class="text-right">
					<small v-if="!$v.endDate.required" class="text-danger">
						Campo requerido
					</small>
				</div>
			</b-col>
			<b-col cols="12" md="6" lg="3">
				<label for="voucher" class="mb-0 mt-2"><small>Voucher</small></label>
				<div v-if="editVoucher || item">
					<span
						v-if="typeof editVoucher === 'string'"
						class="pointer"
						:href="editVoucher"
					>
						{{ cutText(voucherName) }}
					</span>
				</div>
				<div v-else>
					<b-form-file
						id="voucher"
						ref="voucher"
						size="sm"
						class="text-left"
						placeholder="Subir vaucher"
						type="file"
						@change="e => (voucher = e.target.files[0])"
					/>
				</div>
			</b-col>
			<b-col cols="12" md="12" lg="2" class="mt-4">
				<b-button block class="btn-sm mt-2" @click="submit">{{
					item ? 'Actualizar' : 'Agregar Pago'
				}}</b-button>
			</b-col>
		</b-row>
		<b-row
			><b-col v-if="item" cols="12"
				><b-form-textarea
					id="textarea"
					v-model="comments"
					placeholder="Escriba un comentario..."
					rows="1"
					size="sm"
					max-rows="1"
					no-resize
				></b-form-textarea
			></b-col>
		</b-row>
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
	props: {
		item: {
			type: Object,
			required: false,
			default: () => {},
		},
		onClose: {
			type: Function,
			required: false,
		},
		hide: {
			type: Function,
		},
		count: {
			type: Number,
		},
	},
	data() {
		return {
			text: '',
			idPlace: this.$route.params.place,
			form: new FormData(),
			startDate: '',
			endDate: '',
			mount: '',
			voucher: null,
			editVoucher: null,
			voucherName: null,
			voucherList: null,
			comments: '',
			errors: '',
		};
	},
	computed: {
		...mapGetters({ range: 'Lodging/rangeDatePayments' }),
	},
	validations: {
		mount: {
			required,
		},
		startDate: {
			required,
		},
		endDate: {
			required,
		},
	},
	watch: {
		range() {
			this.startDate = this.range.startDate;
			this.endDate = this.range.endDate;
		},
		item: {
			handler: function(value) {
				if (value) {
					if (value.voucher) {
						this.editVoucher = value.voucher.url;
						this.voucherName = value.voucher.name;
					}
					this.startDate = value.startDate;
					this.endDate = value.endDate;
					this.mount = value.mount;
					this.comments = value.comments;
				}
			},
			immediate: true,
			deep: true,
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
				this.form.set('startDate', moment(this.startDate).format('YYYY-MM-DD'));
				this.form.set('endDate', moment(this.endDate).format('YYYY-MM-DD'));
				this.form.set('mount', this.mount);
				if (this.item) {
					this.form.set('voucher', this.editVoucher);
					this.form.set('comments', this.comments);
					await this.edit({ payload: this.form, id: this.item._id });
					this.updatePayments(this.idPlace);
					this.onClose(this.hide);
				} else {
					this.form.append('voucher', this.voucher);
					await this.save(this.form);
					this.updatePayments(this.idPlace);
				}
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
			edit: 'Payments/editPayment',
			updatePayments: 'Payments/fetchPaymentsOfThePlace',
		}),
	},
};
</script>

<style lang="scss" scoped></style>
