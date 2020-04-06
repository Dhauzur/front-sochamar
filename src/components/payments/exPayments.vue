<template>
	<payments-wrapper
		:lodgings="lodgingsPlace"
		:place="place"
		:items="payments"
		:loading="loading"
		:update-payments="fetchPayments"
		:count="countLodgings"
		:delete="deleteOnePayment"
	/>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import PaymentsWrapper from '@/components/payments/PaymentsWrapper';

export default {
	name: 'Payments',
	components: {
		PaymentsWrapper,
	},
	props: {
		idPlace: {
			type: String,
			required: true,
		},
	},
	computed: {
		...mapGetters({
			place: 'Place/place',
			payments: 'Payments/payments',
			message: 'Payments/message',
			loading: 'Payments/loading',
			countLodgings: 'Lodging/countLogingsPlace',
			lodgingsPlace: 'Lodging/lodgingsPlace',
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
		this.fetchOnePlace(this.idPlace);
		this.fetchLodgingsForPlace(this.idPlace);
		this.fetchPayments(this.idPlace);
	},
	methods: {
		...mapActions({
			fetchLodgingsForPlace: 'Lodging/fetchLodgingsForPlace',
			fetchOnePlace: 'Place/fetchOnePlace',
			fetchPayments: 'Payments/fetchPaymentsOfThePlace',
			deleteOnePayment: 'Payments/deleteOnePayment',
		}),
	},
};
</script>
