<template>
	<div>
		<payments-wrapper
			:lodgings="lodgingsCompany"
			:company="company"
			:items="payments"
			:loading="loading"
			:update-payments="fetchPayments"
			:count="countLodgings"
			:delete="deleteOnePayment"
		/>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import PaymentsWrapper from '@/components/payments/PaymentsWrapper';

export default {
	name: 'Payments',
	components: {
		PaymentsWrapper,
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
			loading: 'Payments/loading',
			countLodgings: 'Lodging/countLogingsCompany',
			lodgingsCompany: 'Lodging/lodgingsCompany',
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
		this.fetchOneCompany(this.idCompany);
		this.fetchLodgingsForCompany(this.idCompany);
		this.fetchPayments(this.idCompany);
	},
	methods: {
		...mapActions({
			fetchLodgingsForCompany: 'Lodging/fetchLodgingsForCompany',
			fetchOneCompany: 'Company/fetchOneCompany',
			fetchPayments: 'Payments/fetchPaymentsOfTheCompany',
			deleteOnePayment: 'Payments/deleteOnePayment',
		}),
	},
};
</script>

<style lang="css" scoped></style>
