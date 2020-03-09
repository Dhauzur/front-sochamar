<template>
	<b-container id="nav">
		<b-row class="justify-content-center overflow-auto">
			<b-col md="6">
				<b-form v-if="show" @submit="onSubmit" @reset="onReset">
					<b-form-group
						id="input-group-1"
						label="Espacio de trabajo:"
						label-for="input-1"
						description="Selecione el lugar de donde enviará información."
					>
						<b-form-select
							id="input-1"
							v-model="form.workPlace"
							class="col-xs-2"
							:options="spaces"
							required
						/>
					</b-form-group>

					<b-form-group
						v-if="form.workPlace && form.workPlace.includes('Habitación')"
						label="¿Cúantas camas se hicieron?"
					>
						<b-form-radio-group
							id="input-group-2"
							v-model="form.ncamas"
							name="some-radios-number-beds"
						>
							<b-form-radio value="1">1</b-form-radio>
							<b-form-radio value="2">2</b-form-radio>
							<b-form-radio value="3">3</b-form-radio>
							<b-form-radio value="4">4</b-form-radio>
							<b-form-radio value="5">5</b-form-radio>
							<b-form-radio value="6">6</b-form-radio>
							<b-form-radio value="1">7</b-form-radio>
							<b-form-radio value="2">8</b-form-radio>
							<b-form-radio value="3">9</b-form-radio>
							<b-form-radio value="4">10</b-form-radio>
							<b-form-radio value="5">11</b-form-radio>
							<b-form-radio value="6">12</b-form-radio>
						</b-form-radio-group>
					</b-form-group>

					<b-form-group
						v-if="form.workPlace"
						id="input-group-3"
						label="¿Qué se hizo?"
						label-for="input-1"
					>
						<b-form-checkbox-group id="checkboxes-4" v-model="form.whatWasDone">
							<b-form-checkbox
								v-if="form.workPlace.includes('Habitación')"
								value="Hacer la cama"
								>Hacer la cama</b-form-checkbox
							>
							<b-form-checkbox
								v-if="form.workPlace.includes('Habitación')"
								value="Cambio de sábanas"
								>Cambio de sábanas</b-form-checkbox
							>
							<b-form-checkbox
								v-if="form.workPlace.includes('Habitación')"
								value="Cambio funda almohada"
								>Cambio funda almohada</b-form-checkbox
							>
							<b-form-checkbox value="Limpieza ventana"
								>Limpieza ventana</b-form-checkbox
							>
							<b-form-checkbox value="Limpieza muebles"
								>Limpieza muebles</b-form-checkbox
							>
							<b-form-checkbox value="Barrido de piso"
								>Barrido de piso</b-form-checkbox
							>
							<b-form-checkbox value="Trapeado de piso"
								>Trapeado de piso
							</b-form-checkbox>
							<b-form-checkbox
								v-if="form.workPlace.includes('Habitación')"
								value="Trapeado piso baño"
								>Trapeado piso baño</b-form-checkbox
							>
							<b-form-checkbox
								v-if="form.workPlace.includes('Habitación')"
								value="Limpieza espejo baño"
								>Limpieza espejo baño</b-form-checkbox
							>
							<b-form-checkbox
								v-if="form.workPlace.includes('Habitación')"
								value="Limpieza ducha"
								>Limpieza ducha</b-form-checkbox
							>
							<b-form-checkbox
								v-if="form.workPlace.includes('Habitación')"
								value="Limpieza tasa de baño"
								>Limpieza tasa de baño</b-form-checkbox
							>
							<b-form-checkbox
								v-if="form.workPlace.includes('Habitación')"
								value="Limpieza lavamanos"
								>Limpieza lavamanos</b-form-checkbox
							>
						</b-form-checkbox-group>
					</b-form-group>

					<!-- <b-form-group id="input-group-2" label="Your Name:" label-for="input-2">
						<b-form-input
							id="input-2"
							v-model="form.name"
							required
							placeholder="Enter name"
						></b-form-input>
					</b-form-group> -->

					<b-button class="m-2" type="submit" variant="primary">Enviar</b-button>
					<b-button class="m-2" type="reset" variant="danger">Borrar todo</b-button>
				</b-form>
				<b-card class="mt-3" header="Datos a enviar">
					<pre class="m-0">{{ form.workPlace }}</pre>
					<pre v-if="form.ncamas" class="m-0">N° de camas {{ form.ncamas }}</pre>
					==========================
					<pre v-for="(q, index) in form.whatWasDone" :key="index" class="m-0">{{
						q
					}}</pre>
				</b-card>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import { api } from '@/config/index.js';
import axios from 'axios';

export default {
	data() {
		return {
			form: {
				workPlace: '',
				whatWasDone: '',
				ncamas: 0,
			},
			spaces: [
				{ text: 'Selecione uno', value: '', disabled: true },
				'Habitación 1',
				'Habitación 2',
				'Habitación 3',
				'Habitación 4',
				'Habitación 5',
				'Habitación 6',
				'Habitación 7',
				'Habitación 8',
				'Living',
				'Comedor',
				'Patio trasero',
				'Patio delantero',
				'Camarines',
			],
			show: true,
		};
	},
	methods: {
		onSubmit(evt) {
			evt.preventDefault();
			const data = new URLSearchParams();
			data.append('workPlace', this.form.workPlace);
			data.append('whatWasDone', this.form.whatWasDone);
			data.append('ncamas', this.form.ncamas);
			axios({
				method: 'POST',
				headers: { 'content-type': 'application/x-www-form-urlencoded' },
				data,
				url: api + '/activities/create',
			})
				.then(() => {
					this.$toasted.show('Formulario enviado con exito !');
					this.onReset();
				})
				.catch(error => {
					console.error('Error al subir ' + error);
				});
		},

		// eslint-disable-next-line no-unused-vars
		onReset(evt) {
			// Reset our form values
			this.form.workPlace = '';
			this.form.whatWasDone = '';
			this.form.ncamas = null;
			this.show = false;
			this.$nextTick(() => {
				this.show = true;
			});
		},
	},
};
</script>
