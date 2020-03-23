<template>
	<v-row>
		<v-col cols="12" sm="6" md="4" lg="3">
			<v-text-field
				id="placeName"
				v-model.trim="formData.name"
				dense
				outlined
				rounded
				label="Nombre"
				:error-messages="nameErrors"
				@input="$v.formData.name.$touch()"
				@blur="$v.formData.name.$touch()"
			></v-text-field>
		</v-col>
		<v-col cols="12" sm="6" md="4" lg="3">
			<v-text-field
				id="price"
				v-model="formData.price"
				type="number"
				dense
				outlined
				rounded
				label="Precio"
				:error-messages="priceErrors"
				@input="$v.formData.price.$touch()"
				@blur="$v.formData.price.$touch()"
			></v-text-field>
		</v-col>
		<v-col cols="12" sm="6" md="3" lg="3">
			<v-btn :loading="loading" block color="primary" rounded small @click="submit">
				Guardar Servicio
			</v-btn>
			<small v-if="errors" class="text-danger">Llene el formulario correctamente</small>
		</v-col>
	</v-row>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { minLength, maxLength, required } from 'vuelidate/lib/validators';

export default {
	name: 'PlaceServicesForm',
	mixins: [validationMixin],
	props: {
		pushService: {
			type: Function,
			required: true,
		},
	},
	data() {
		return {
			formData: { name: '', price: '' },
			loading: false,
			errors: false,
		};
	},
	computed: {
		nameErrors() {
			const errors = [];
			if (!this.$v.formData.name.$dirty) return errors;
			!this.$v.formData.name.required && errors.push('Campo requerido');
			!this.$v.formData.name.minLength && errors.push('Minimo 3 Caracteres');
			!this.$v.formData.name.maxLength && errors.push('Maximo 50 Caracteres');
			return errors;
		},
		priceErrors() {
			const errors = [];
			if (!this.$v.formData.name.$dirty) return errors;
			!this.$v.formData.name.required && errors.push('Campo requerido');
			return errors;
		},
	},
	validations: {
		formData: {
			name: {
				required,
				minLength: minLength(3),
				maxLength: maxLength(50),
			},
			price: {
				required,
			},
		},
	},
	methods: {
		resetForm() {
			this.formData = { name: '', price: '' };
			this.errors = false;
		},
		submit() {
			this.$v.$touch();
			this.loading = true;
			if (this.$v.$invalid) {
				this.errors = true;
			} else {
				this.pushService({ ...this.formData });
				this.resetForm();
				this.$v.$reset();
			}
			this.loading = false;
		},
	},
};
</script>

<style scoped></style>
