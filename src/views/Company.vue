<template lang="html">
	<b-container>
		<b-row id="nav" class="justify-content-center">
			<b-col md="8" lg="6" class="background-module pb-3 px-4">
				<h3 class="mt-4">Gestión de compañias</h3>
				<b-row class="mb-3">
					<div>
						<b-dropdown
							id="dropdown-1"
							class="m-3"
							variant="primary"
							text="Acciones"
							size="sm"
						>
							<b-dropdown-item @click="$router.push({ name: 'grupos' })"
								>Gestionar grupos</b-dropdown-item
							>
							<b-dropdown-item @click="$router.push({ name: 'hospedaje' })"
								>Hospedajes</b-dropdown-item
							>
						</b-dropdown>
					</div>
				</b-row>
				<b-row style="max-height: 100px; overflow-y: auto;" class="mr-2 mb-3">
					<b-col>
						<table class="table table-bordered table-hover">
							<thead>
								<tr>
									<th>Nombre</th>
									<th>RUT / ID</th>
									<th>Precios</th>
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
						<b-form-input v-model="text" placeholder="Enter your name"></b-form-input>
					</b-col>
					<b-col lg="4">
						RUT
						<b-form-input v-model="text" placeholder="Enter your name"></b-form-input>
					</b-col>
				</b-row>
				<b-row class="mb-3">
					<b-col>
						<h5>Precios</h5>
					</b-col>
				</b-row>
				<b-row class="mb-3">
					<b-col>
						Desayuno
						<b-form-input v-model="text" placeholder="Enter your name"></b-form-input>
						Almuerzo
						<b-form-input v-model="text" placeholder="Enter your name"></b-form-input>
					</b-col>
					<b-col>
						Cena
						<b-form-input v-model="text" placeholder="Enter your name"></b-form-input>
						Alojamiento
						<b-form-input v-model="text" placeholder="Enter your name"></b-form-input>
					</b-col>
				</b-row>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
	computed: {
		...mapGetters({
			companies: 'Company/companies',
			companySelected: 'Company/companySelected',
		}),
	},
	mounted() {
		this.$store.dispatch('Company/fetchCompany');
	},
	methods: {
		...mapMutations({
			selectCompany: 'Company/selectCompany',
		}),
	},
};
</script>

<style lang="css" scoped></style>
