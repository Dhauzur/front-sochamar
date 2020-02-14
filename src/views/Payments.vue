<template>
	<div>
		<PaymentForm :company="company" />
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
	computed: {
		...mapGetters({
			company: 'Company/company',
		}),
	},
	mounted() {
		this.fetchOneCompany(this.$route.params.company);
	},
	methods: {
		...mapActions({
			fetchOneCompany: 'Company/fetchOneCompany',
		}),
	},
};
</script>

<style lang="css" scoped></style>
