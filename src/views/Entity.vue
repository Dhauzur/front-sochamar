<template lang="html">
	<b-container>
		<b-row id="nav" class="justify-content-center">
			<b-col lg="8" class="background-module">
				<h5 class="mt-4">Gestión de entidades</h5>
				<b-row class="mx-1">
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
				<b-row
					class="justify-content-center overflow-auto"
					style="max-height: 100px; overflow-y: auto;"
				>
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
				<b-row class="mx-1">
					<b-col lg="8">
						Nombre
						<b-form-input v-model="text" placeholder="Enter your name"></b-form-input>
						<br />
						<h4>Precios</h4>
						<b-row>
							<b-col>
								<b-form-input
									v-model="text"
									class="col-6"
									placeholder="Enter your name"
								></b-form-input>
								<b-form-input
									v-model="text"
									class="col-6"
									placeholder="Enter your name"
								></b-form-input>
								<b-form-input
									v-model="text"
									class="col-6"
									placeholder="Enter your name"
								></b-form-input>
								<b-form-input
									v-model="text"
									placeholder="Enter your name"
								></b-form-input>
							</b-col>
						</b-row>
					</b-col>
					<b-col lg="4">
						RUT
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
			companies: 'Entity/companies',
			companySelected: 'Entity/companySelected',
		}),
	},
	mounted() {
		this.$store.dispatch('Entity/fetchCompany');
	},
	methods: {
		...mapMutations({
			selectCompany: 'Entity/selectCompany',
		}),
	},
};
</script>

<style lang="css" scoped></style>
