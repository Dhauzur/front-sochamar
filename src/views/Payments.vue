<template>
	<div>
		<PaymentForm
			:company="company"
			:items="payments"
			:save="savePayment"
			:edit="editPayment"
			:range="rangeDatePayments"
			:update-payments="fetchPayments"
			:count="countLodgings"
		/>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import PaymentForm from '@/components/payments/PaymentsForm';

export default {
	name: 'Payments',
	components: {
		PaymentForm,
	},
	data() {
		return {
			idCompany: this.$route.params.company,
		};
	},
	computed: {
		...mapGetters({
			company: 'Company/company',
			payments: 'Payments/payments',
			message: 'Payments/message',
			rangeDatePayments: 'Lodging/rangeDatePayments',
			countLodgings: 'Lodging/countLogingsCompany',
		}),
	},
	watch: {
		message(newVal) {
			this.$toasted.show(newVal.text, {
				type: newVal.type,
			});
		},
	},
	mounted() {
		this.fetchLodgingsForCompany(this.idCompany);
		this.fetchPayments(this.idCompany);
	},
	methods: {
		...mapActions({
			fetchLodgingsForCompany: 'Lodging/fetchLodgingsForCompany',
			fetchOneCompany: 'Company/fetchOneCompany',
			fetchPayments: 'Payments/fetchPaymentsOfTheCompany',
			savePayment: 'Payments/savePayment',
			editPayment: 'Payments/editPayment',
		}),
	},
};
</script>

<style lang="css" scoped></style>
