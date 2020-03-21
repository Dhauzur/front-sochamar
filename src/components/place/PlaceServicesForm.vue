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
			></v-text-field>
			<div v-if="$v.formData.name.$dirty" class="text-right">
				<small v-if="!$v.formData.name.required" class="text-danger">
					Campo requerido
				</small>
				<small v-if="!$v.formData.name.minLength" class="text-danger">
					Minimo 3 Caracteres
				</small>
				<small v-if="!$v.formData.name.maxLength" class="text-danger">
					Maximo 50 Caracteres
				</small>
			</div>
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
			></v-text-field>
			<div v-if="$v.formData.price.$dirty" class="text-right">
				<small v-if="!$v.formData.name.required" class="text-danger">
					Campo requerido
				</small>
			</div>
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
		},
		submit() {
			this.$v.$touch();
			this.loading = true;
			if (this.$v.$invalid) {
				this.errors = true;
			} else {
				this.pushService(...this.formData);
				this.resetForm();
				this.$v.$reset();
			}
			this.loading = false;
		},
	},
};
</script>

<style scoped></style>
