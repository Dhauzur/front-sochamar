<template>
	<v-container>
		<v-row justify="center">
			<v-col cols="12" md="10" lg="8">
				<v-card>
					<v-card-title primary-title>
						<h4>Informes</h4>
					</v-card-title>
					<v-card-text>
						<v-form v-if="show" @submit="onSubmit" @reset="onReset">
							<v-select
								v-model="form.member"
								:items="members"
								dense
								label="Selecione su nombre"
								outlined
							>
							</v-select>
							<div>
								<v-textarea
									id="textarea"
									v-model="form.whatWasDone"
									placeholder="Escriba aqui su informe..."
									rows="1"
									max-rows="6"
									outlined
									required
								></v-textarea>
							</div>
							<v-btn class="m-2" type="reset" small text>Borrar todo</v-btn>
							<v-btn class="m-2" type="submit" small color="accent">Enviar</v-btn>
						</v-form>
					</v-card-text>
					<v-card-text>
						<v-simple-table>
							<template v-slot:default>
								<thead>
									<tr>
										<th>Fecha</th>
										<th>Miembro</th>
										<th>Detalle</th>
									</tr>
								</thead>
								<tbody v-for="(r, index) in reports" :key="index">
									<tr>
										<td>{{ formatTime(r.date) }}</td>
										<td>{{ r.member }}</td>
										<td>{{ r.whatWasDone }}</td>
									</tr>
								</tbody>
							</template>
						</v-simple-table>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { api } from '@/config/index.js';
import axios from 'axios';
import moment from 'moment';

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
		formatTime(d) {
			moment.locale('es');
			return moment(d)
				.startOf('hour')
				.fromNow();
		},
		fetchReports() {
			axios
				.get(api + '/reports')
				.then(response => (this.reports = response.data.reports))
				.catch(error => {
					this.$toasted.show(error.message, {
						type: 'error',
					});
				});
		},
		onSubmit(evt) {
			evt.preventDefault();
			const data = new URLSearchParams();
			data.append('member', this.form.member);
			data.append('whatWasDone', this.form.whatWasDone);
			axios({
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
					this.$toasted.show(error.message, {
						type: 'error',
					});
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
