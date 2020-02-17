<template>
	<div>
		<b-row class="mb-3">
			<b-col cols="3">
				<label for="total" class="mb-0 mt-2">Total</label>
				<b-form-input
					id="total"
					v-model="$v.mount.$model"
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
			<b-col cols="3">
				<label for="in" class="mb-0 mt-2">Ingreso</label>
				<b-form-group id="in" label-for="input-1" class="pb-0 mb-0">
					<b-form-input
						id="in"
						v-model="$v.startDate.$model"
						size="sm"
						type="date"
						:disabled="count === 0"
					/>
				</b-form-group>
				<div v-if="$v.startDate.$dirty" class="text-right">
					<small v-if="!$v.startDate.required" class="text-danger">
						Campo requerido
					</small>
				</div>
			</b-col>
			<b-col cols="3">
				<label for="out" class="mb-0 mt-2">Salida</label>
				<b-form-group id="out" label-for="input-1" class="pb-0 mb-0">
					<b-form-input
						id="out"
						v-model="$v.endDate.$model"
						size="sm"
						type="date"
						:disabled="count === 0"
					/>
				</b-form-group>
				<div v-if="$v.endDate.$dirty" class="text-right">
					<small v-if="!$v.endDate.required" class="text-danger">
						Campo requerido
					</small>
				</div>
			</b-col>
			<b-col class="text-center">
				<label>
					Voucher
				</label>
				<div v-if="editVoucher || item">
					<label v-if="!editVoucher" class="btn btn-sm btn-primary" for="editVoucher">
						Agregar
					</label>
					<label
						v-else-if="typeof editVoucher === 'string'"
						class="btn btn-sm btn-danger"
						for="editVoucher"
					>
						Cambiar
					</label>
					<span
						v-else-if="typeof editVoucher === 'object'"
						class="btn btn-sm btn-danger"
						@click="clearInputFile('editvoucher')"
						>Quitar</span
					>
					<b-form-file
						id="editVoucher"
						ref="editvoucher"
						type="file"
						class="d-none"
						@change="e => (editVoucher = e.target.files[0])"
					/>
				</div>
				<div v-else>
					<span
						v-if="voucher"
						class="btn btn-sm btn-danger"
						@click="clearInputFile('voucher')"
						>Quitar</span
					>
					<label v-else for="voucher" class="btn btn-sm btn-primary">
						Subir
					</label>
					<b-form-file
						id="voucher"
						ref="voucher"
						type="file"
						class="d-none"
						@change="e => (voucher = e.target.files[0])"
					/>
				</div>
			</b-col>
		</b-row>
		<b-row
			><b-col v-if="item" cols="9"
				><b-form-textarea
					id="textarea"
					v-model="comments"
					placeholder="Enter something..."
					rows="1"
					size="sm"
					max-rows="1"
					no-resize
				></b-form-textarea
			></b-col>
			<b-col>
				<b-button block variant="primary" class="btn-sm mt-2" @click="submit">{{
					item ? 'Actualizar' : 'Agregar Pago'
				}}</b-button>
			</b-col>
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
			idCompany: this.$route.params.company,
			form: new FormData(),
			startDate: '',
			endDate: '',
			mount: '',
			voucher: null,
			editVoucher: null,
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
					if (value.voucher) this.editVoucher = value.voucher;
					this.startDate = value.startDate;
					this.endDate = value.endDate;
					this.mount = value.mount;
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
			this.editVoucher = null;
		},
		async submit() {
			// validations
			this.$v.$touch();
			if (this.$v.$invalid) {
				this.errors = true;
			} else {
				this.form.set('idCompany', this.idCompany);
				this.form.set('startDate', moment(this.startDate).format('YYYY-MM-DD'));
				this.form.set('endDate', moment(this.endDate).format('YYYY-MM-DD'));
				this.form.set('mount', this.mount);
				if (this.item) {
					this.form.append('voucher', this.editVoucher);
					this.form.set('comments', this.comments);
					await this.edit({ payload: this.form, id: this.item._id });
					this.updatePayments(this.idCompany);
					this.onClose(this.hide);
				} else {
					this.form.append('voucher', this.voucher);
					await this.save(this.form);
					this.updatePayments(this.idCompany);
				}
			}
		},
		...mapActions({
			save: 'Payments/savePayment',
			edit: 'Payments/editPayment',
			updatePayments: 'Payments/fetchPaymentsOfTheCompany',
		}),
	},
};
</script>

<style lang="scss" scoped></style>
