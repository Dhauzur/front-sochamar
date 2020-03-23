<template lang="html">
	<v-container>
		<v-card-title class="text-secondary">
			Agregar nuevo
		</v-card-title>
		<v-row>
			<v-col cols="12" md="7" class="mx-auto">
				<v-row>
					<v-col cols="12" md="4">
						<v-text-field
							v-model="$v.form.name.$model"
							label="Nombre del turno"
							placeholder="N-1"
							outlined
							dense
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
							type="number"
							placeholder="4"
							:error-messages="maxPersonsErrors"
							@input="$v.form.numberPassangerMax.$touch()"
							@blur="$v.form.numberPassangerMax.$touch()"
						></v-text-field>
					</v-col>
					<v-col cols="12" md="4" class="mt-2">
						<v-btn small block color="primary" :loading="loading" @click="onsubmit()">
							Guardar
						</v-btn>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
		<v-divider />
		<v-row v-if="loading">
			<v-col cols="12" md="7"
				><v-skeleton-loader class="mx-auto" type="table"></v-skeleton-loader
			></v-col>
		</v-row>
		<v-row v-else>
			<v-col cols="12" md="7" class="mx-auto">
				<v-card-title>
					Listado de turnos
					<v-spacer></v-spacer>
					<v-text-field
						v-model="filterPeriodWord"
						dense
						outlined
						append-icon="mdi-magnify"
						label="Filtrar"
						hide-details
					></v-text-field>
				</v-card-title>
				{{ loading }}
				<v-data-table
					disable-sort
					item-key="name"
					:loading="loading"
					loading-text="Cargando... Por favor espere..."
					:search="filterPeriodWord"
					:headers="fields"
					:items="periodsTable"
					:items-per-page="5"
				>
					<template v-slot:item.actions="{ item }">
						<v-btn fab x-small color="error" @click="deleteOne(item.id)">
							<v-icon>mdi-delete</v-icon>
						</v-btn>
					</template>
				</v-data-table>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
	name: 'Period',
	mixins: [validationMixin],
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
				idPlace: this.idPlace,
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
		...mapGetters({
			idPlace: 'Lodging/place',
			periodsTable: 'Lodging/periodsTable',
			loading: 'Lodging/loading',
			periods: 'Lodging/periods',
			periodSelected: 'Lodging/periodSelected',
			message: 'Lodging/message',
		}),
	},
	watch: {
		message(newVal) {
			this.$toasted.show(newVal.text, {
				type: newVal.type,
			});
		},
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
					setTimeout(() => this.fetchLodgings(), 500);
					setTimeout(() => this.fetchLodgings(), 500);
				});
			}
		},
		deleteOne(id) {
			this.deletePeriod({
				id: id,
				placeId: this.idPlace,
			});
		},
		clearInputs() {
			this.form.name = '';
			this.form.numberPassangerMax = '';
		},
		...mapActions({
			fetchLodgings: 'Lodging/fetchLodgings',
			fetchPeriods: 'Lodging/fetchPeriods',
			createPeriod: 'Lodging/createPeriod',
			deletePeriod: 'Lodging/deletePeriod',
		}),
		...mapMutations({
			setPeriods: 'Lodging/setPeriods',
			selectPeriod: 'Lodging/selectPeriod',
			setIdPlacePeriod: 'Lodging/setIdPlacePeriod',
		}),
	},
};
</script>
