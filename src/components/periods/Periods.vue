<template lang="html">
	<v-row justify="center">
		<v-col cols="12" sm="10" md="8">
			<v-card class="mx-auto" outlined :loading="loading">
				<v-list-item three-line>
					<v-list-item-content>
						<div class="headline mb-4">
							Gestión de <span class="secondary--text">Turnos</span>
						</div>
						<v-list-item-title class="overline mb-1">Agregar nuevo</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-card-actions>
					<v-container>
						<v-row>
							<v-col cols="12" md="4">
								<v-text-field
									v-model="$v.form.name.$model"
									label="Nombre del turno"
									placeholder="N-1"
									outlined
									dense
									rounded
									:error-messages="nameErrors"
									@input="$v.form.name.$touch()"
									@blur="$v.form.name.$touch()"
								></v-text-field>
							</v-col>
							<v-col cols="12" md="4">
								<v-text-field
									v-model="$v.form.numberPassangerMax.$model"
									label="Cant. máxima de personas"
									outlined
									dense
									rounded
									type="number"
									placeholder="4"
									:error-messages="maxPersonsErrors"
									@input="$v.form.numberPassangerMax.$touch()"
									@blur="$v.form.numberPassangerMax.$touch()"
								></v-text-field>
							</v-col>
							<v-col cols="12" md="4" class="mt-2">
								<v-btn
									small
									rounded
									block
									color="primary"
									:loading="loading"
									@click="onsubmit()"
								>
									Guardar
								</v-btn>
							</v-col>
						</v-row>
						<v-row v-if="Boolean(periods)">
							<v-col cols="12" md="8" class="mt-5 text-left">
								Lista de Habitaciones
							</v-col>
							<v-col cols="12" md="4">
								<v-text-field
									v-model="filterPeriodWord"
									dense
									outlined
									rounded
									append-icon="mdi-magnify"
									label="Filtrar"
									hide-details
								></v-text-field>
							</v-col>
							<v-col>
								<v-data-table
									:search="filterPeriodWord"
									:headers="fields"
									:items="periods"
									:items-per-page="5"
								>
									<template v-slot:item.actions="{ item }">
										<v-icon
											color="error"
											small
											@click="
												deletePeriod({
													id: item.id,
													placeId: idPlace,
												})
											"
										>
											mdi-delete
										</v-icon>
									</template>
								</v-data-table>
							</v-col>
						</v-row>
					</v-container>
				</v-card-actions>
			</v-card>
		</v-col>
	</v-row>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
	name: 'Period',
	mixins: [validationMixin],
	props: {
		idPlace: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			fields: [
				{ value: 'name', text: 'Nombre del turno' },
				{ value: 'numberPassangerMax', text: 'Cant. Max de personas' },
				{ value: 'actions', text: 'Acción' },
			],
			errors: '',
			form: {
				name: '',
				numberPassangerMax: '',
			},
			filterPeriodWord: '',
		};
	},
	computed: {
		nameErrors() {
			const errors = [];
			if (!this.$v.form.name.$dirty) return errors;
			!this.$v.form.name.required && errors.push('El nombre es querido');
			return errors;
		},
		maxPersonsErrors() {
			const errors = [];
			if (!this.$v.form.numberPassangerMax.$dirty) return errors;
			!this.$v.form.numberPassangerMax.required && errors.push('Campo es querido');
			return errors;
		},
		hasPeriods() {
			return Array.isArray(this.periods) && this.periods.length;
		},
		...mapGetters({
			loading: 'Period/loading',
			periods: 'Period/periods',
			periodSelected: 'Period/periodSelected',
			message: 'Period/message',
			placeLodging: 'Lodging/places',
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
		this.setIdPlacePeriod(this.idPlace);
		this.fetchPeriods(this.idPlace);
	},
	validations: {
		form: {
			name: {
				required,
			},
			numberPassangerMax: {
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
				this.createPeriod(this.form).then(() => {
					this.clearInputs();
					this.$v.$reset();
				});
			}
		},
		clearInputs() {
			this.form.name = '';
			this.form.numberPassangerMax = '';
		},
		...mapActions({
			fetchPeriods: 'Period/fetchPeriods',
			createPeriod: 'Period/createPeriod',
			deletePeriod: 'Period/deletePeriod',
		}),
		...mapMutations({
			selectPeriod: 'Period/selectPeriod',
			setIdPlacePeriod: 'Period/setIdPlacePeriod',
		}),
	},
};
</script>

<style lang="css" scoped></style>
