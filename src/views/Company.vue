<template lang="html">
	<b-container>
		<b-row id="nav" class="justify-content-center">
			<b-col md="8" lg="6" class="background-module pb-3 px-4">
				<h3 class="my-4">Gestión de compañías</h3>
				<b-row class="mb-3">
					<b-col cols="7">
						<b-form-input
							v-model="filterCompanyWord"
							size="sm"
							placeholder="Filtrar compañia"
							@keyup="filterCompany(filterCompanyWord)"
						></b-form-input>
					</b-col>
				</b-row>
				<b-row
					style="max-height: 100px; overflow-y: auto;"
					class="background-into-module mr-2 mb-3"
				>
					<b-col>
						<table class="table table-bordered table-hover">
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
										<b-button variant="danger">
											X
										</b-button>
									</td>
								</tr>
							</tbody>
						</table>
						{{ companySelected }}
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
							v-model="form.name"
							placeholder="Ej: Minera los pelambres"
						></b-form-input>
					</b-col>
					<b-col lg="4">
						RUT
						<b-form-input
							v-model="form.rut"
							placeholder="Ej: 11.111.111-3"
						></b-form-input>
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
							v-model="form.prices[0]"
							type="number"
							placeholder="Ej: 4000"
						></b-form-input>
						Almuerzo
						<b-form-input
							v-model="form.prices[1]"
							type="number"
							placeholder="Ej: 8000"
						></b-form-input>
					</b-col>
					<b-col>
						Cena
						<b-form-input
							v-model="form.prices[2]"
							type="number"
							placeholder="Ej: 6000"
						></b-form-input>
						Alojamiento
						<b-form-input
							v-model="form.prices[3]"
							type="number"
							placeholder="Ej: 25000"
						></b-form-input>
					</b-col>
				</b-row>
				<b-row class="mb-3">
					<b-col>
						<b-button
							block
							variant="primary"
							class="col-12"
							@click="createCompany(form)"
						>
							Crear
						</b-button>
					</b-col>
				</b-row>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
	data() {
		return {
			form: {
				name: '',
				rut: '',
				prices: [null, null, null, null],
			},
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
	methods: {
		...mapActions({
			fetchCompany: 'Company/fetchCompany',
			createCompany: 'Company/createCompany',
		}),
		...mapMutations({
			selectCompany: 'Company/selectCompany',
			filterCompany: 'Company/filterCompany',
		}),
	},
};
</script>

<style lang="css" scoped></style>
