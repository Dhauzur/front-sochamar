<template>
	<b-container id="nav">
		<b-row class="justify-content-center overflow-auto">
			<b-col md="6">
				<h4>Informes</h4>
				<b-form v-if="show" @submit="onSubmit" @reset="onReset">
					<b-form-group
						id="input-group-1"
						label="Miembro"
						class="col-6"
						label-for="input-member"
					>
						<b-form-select
							id="input-member"
							v-model="form.member"
							:options="members"
							required
						/>
					</b-form-group>
					<div>
						<b-form-textarea
							id="textarea"
							v-model="form.whatWasDone"
							placeholder="Escriba aqui su informe..."
							rows="3"
							max-rows="6"
							required
						></b-form-textarea>
					</div>
					<b-button class="m-2" type="submit" variant="primary">Enviar</b-button>
					<b-button class="m-2" type="reset" variant="danger">Borrar todo</b-button>
				</b-form>
			</b-col>
			<b-col md="10">
				<table class="table  table-hover mt-2">
					<thead>
						<tr>
							<th>Fecha</th>
							<th>Miembro</th>
							<th>Detalle</th>
						</tr>
					</thead>
					<tbody v-for="(r, index) in reports" :key="index">
						<tr>
							<td>{{ r.date }}</td>
							<td>{{ r.member }}</td>
							<td>{{ r.whatWasDone }}</td>
						</tr>
					</tbody>
				</table>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import { api } from '@/config/index.js';
import Axios from 'axios';

export default {
	data() {
		return {
			form: {
				whatWasDone: '',
				member: 0,
			},
			members: [
				{ text: 'Selecione su nombre', value: '', disabled: true },
				'Jesus',
				'Javier',
				'Mauro',
				'Otro',
			],
			show: true,
			reports: [],
		};
	},
	mounted() {
		this.fetchReports();
	},
	methods: {
		fetchReports() {
			Axios.get(api + '/reports')
				.then(response => {
					console.log(response);
					this.reports = response.data.reports;
				})
				.catch(() => {
					console.error('Error al descargar reportes');
				});
		},
		onSubmit(evt) {
			evt.preventDefault();
			const data = new URLSearchParams();
			data.append('member', this.form.member);
			data.append('whatWasDone', this.form.whatWasDone);
			Axios({
				method: 'POST',
				headers: { 'content-type': 'application/x-www-form-urlencoded' },
				data,
				url: api + '/reports/create',
			})
				.then(() => {
					this.$toasted.show('Formulario enviado con exito !');
					this.onReset();
					this.fetchReports();
				})
				.catch(error => {
					console.error('Error al subir ' + error);
				});
		},

		// eslint-disable-next-line no-unused-vars
		onReset(evt) {
			this.form.member = '';
			this.form.whatWasDone = '';
			this.show = false;
			this.$nextTick(() => {
				this.show = true;
			});
		},
	},
};
</script>
