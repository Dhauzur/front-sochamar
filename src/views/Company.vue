<template lang="html">
	<b-container>
		<b-row id="nav" class="justify-content-center">
			<b-col md="8" lg="6" class="background-module pb-3 px-4">
				<h3 class="my-4">Gestión de lugares</h3>
				<b-row class="mb-3">
					<b-col cols="7">
						<b-form-input
							v-model="filterCompanyWord"
							size="sm"
							placeholder="Filtrar lugares"
							@keyup="filterCompany(filterCompanyWord)"
						></b-form-input>
					</b-col>
				</b-row>
				<b-row
					style="max-height: 150px; overflow-y: auto;"
					class="background-into-module mr-2 mb-3"
				>
					<b-col>
						<table class="table  table-hover">
							<thead>
								<tr>
									<th>Nombre</th>
									<th>RUT / ID</th>
									<th>Precios</th>
									<th>Eliminar</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="(c, index) in companies"
									:key="index"
									@click="selectCompany(c.id)"
								>
									<td>{{ c.name }}</td>
									<td>{{ c.rut }}</td>
									<td>
										<table class="table ">
											<thead>
												<th>Tipo</th>
												<th>Precio</th>
											</thead>
											<tbody>
												<tr>
													<td>Desayuno</td>
													<td>{{ c.prices[0] }}</td>
												</tr>
												<tr>
													<td>Almuerzo</td>
													<td>{{ c.prices[1] }}</td>
												</tr>
												<tr>
													<td>Cena</td>
													<td>{{ c.prices[2] }}</td>
												</tr>
												<tr>
													<td>Alojamiento</td>
													<td>{{ c.prices[3] }}</td>
												</tr>
											</tbody>
										</table>
									</td>
									<td class="p-2">
										<b-button variant="danger" @click="deleteCompany(c.id)">
											X
										</b-button>
									</td>
								</tr>
							</tbody>
						</table>
					</b-col>
				</b-row>
				<b-row class="mb-3">
					<b-col>
						<h4>Ingresar nueva compañia</h4>
					</b-col>
				</b-row>
				<b-row class="mb-3">
					<b-col>
						Nombre
						<b-form-input
							v-model="$v.form.name.$model"
							required
							placeholder="Ej: Minera los pelambres"
						></b-form-input>
						<div v-if="$v.form.name.$dirty" class="text-right">
							<small v-if="!$v.form.name.required" class="text-danger">
								Campo requerido
							</small>
							<small v-if="!$v.form.name.minLength" class="text-danger">
								Minimo 3 Caracteres
							</small>
						</div>
					</b-col>
					<b-col lg="4">
						RUT
						<b-form-input
							v-model="$v.form.rut.$model"
							placeholder="Ej: 11.111.111-3"
						></b-form-input>
						<div v-if="$v.form.rut.$dirty" class="text-right">
							<small v-if="!$v.form.rut.required" class="text-danger">
								Campo requerido
							</small>
						</div>
					</b-col>
				</b-row>
				<b-row class="mb-3">
					<b-col>
						<h5>Precios</h5>
					</b-col>
				</b-row>
				<b-row class="mb-5">
					<b-col>
						Desayuno
						<b-form-input
							v-model="$v.form.breakfast.$model"
							type="number"
							placeholder="Ej: 4000"
						></b-form-input>
						<div v-if="$v.form.breakfast.$dirty" class="text-right">
							<small v-if="!$v.form.breakfast.required" class="text-danger">
								Campo requerido
							</small>
						</div>
						Almuerzo
						<b-form-input
							v-model="$v.form.lunch.$model"
							type="number"
							placeholder="Ej: 8000"
						></b-form-input>
						<div v-if="$v.form.lunch.$dirty" class="text-right">
							<small v-if="!$v.form.lunch.required" class="text-danger">
								Campo requerido
							</small>
						</div>
					</b-col>
					<b-col>
						Cena
						<b-form-input
							v-model="$v.form.dinner.$model"
							type="number"
							placeholder="Ej: 6000"
						></b-form-input>
						<div v-if="$v.form.dinner.$dirty" class="text-right">
							<small v-if="!$v.form.dinner.required" class="text-danger">
								Campo requerido
							</small>
						</div>
						Alojamiento
						<b-form-input
							v-model="$v.form.lodging.$model"
							type="number"
							placeholder="Ej: 25000"
						></b-form-input>
						<div v-if="$v.form.lodging.$dirty" class="text-right">
							<small v-if="!$v.form.lodging.required" class="text-danger">
								Campo requerido
							</small>
						</div>
					</b-col>
				</b-row>
				<b-row class="mb-3">
					<b-col>
						<b-button block class="col-12" @click="onsubmit()">
							Crear
						</b-button>
						<small v-if="errors" class="mt-2 d-block text-danger">
							Debe llenar el formulario correctamente
						</small>
					</b-col>
				</b-row>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
	name: 'Company',
	mixins: [validationMixin],
	data() {
		return {
			form: {
				name: '',
				rut: '',
				breakfast: '',
				lunch: '',
				dinner: '',
				lodging: '',
			},
			errors: '',
			filterCompanyWord: '',
		};
	},
	computed: {
		...mapGetters({
			companies: 'Company/companies',
			companySelected: 'Company/companySelected',
			message: 'Company/message',
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
		this.fetchCompany();
	},
	validations: {
		form: {
			name: {
				required,
				minLength: minLength(3),
			},
			rut: {
				required,
			},
			breakfast: {
				required,
			},
			lunch: {
				required,
			},
			dinner: {
				required,
			},
			lodging: {
				required,
			},
		},
	},
	methods: {
		onsubmit() {
			// validations
			this.$v.$touch();
			if (this.$v.$invalid) {
				this.errors = true;
			} else {
				let tempArray = [];
				tempArray.push(
					this.form.breakfast,
					this.form.lunch,
					this.form.dinner,
					this.form.lodging
				);
				this.createCompany({ name: this.form.name, rut: this.form.rut, prices: tempArray });
				this.clearInputs();
				this.$v.$reset();
			}
		},
		clearInputs() {
			this.form = {
				name: '',
				rut: '',
				breakfast: '',
				lunch: '',
				dinner: '',
				lodging: '',
			};
		},
		...mapActions({
			fetchCompany: 'Company/fetchCompany',
			createCompany: 'Company/createCompany',
			deleteCompany: 'Company/deleteCompany',
		}),
		...mapMutations({
			selectCompany: 'Company/selectCompany',
			filterCompany: 'Company/filterCompany',
		}),
	},
};
</script>

<style lang="css" scoped></style>
