<template lang="html">
	<v-container>
		<!-- header -->
		<v-col cols="12">
			<v-row justify="center">
				<v-col cols="4">
					<span class="title">Lista de turnos</span>
				</v-col>
			</v-row>
			<v-row justify="space-between">
				<v-col cols="12" md="2" class="text-left py-0">
					<v-btn small color="primary" @click="dialog = true">
						<v-icon>mdi-plus</v-icon>Agregar
					</v-btn>
				</v-col>
				<v-col cols="12" md="3" class="py-0">
					<v-text-field
						v-model="filterPeriodWord"
						dense
						outlined
						append-icon="mdi-magnify"
						label="Filtrar"
						hide-details
					></v-text-field>
				</v-col>
			</v-row>
		</v-col>
		<v-row>
			<v-col cols="12">
				<v-data-table
					disable-sort
					dense
					item-key="id"
					:loading="loading"
					loading-text="Cargando... Por favor espere..."
					:search="filterPeriodWord"
					:headers="fields"
					:items="periodsTable"
					:items-per-page="5"
					class="caption"
				>
					<template v-slot:item.actions="{ item }">
						<v-btn fab x-small color="error" @click="deleteOne(item.id)">
							<v-icon>mdi-delete</v-icon>
						</v-btn>
					</template>
				</v-data-table>
			</v-col>
		</v-row>
		<!-- dialog form -->
		<v-dialog v-model="dialog" max-width="440px">
			<v-card>
				<v-card-title>
					<span class="headline">Agregar nuevo</span>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-row>
							<v-col cols="12">
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
							<v-col cols="12">
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
						</v-row>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" small text @click="closeDialog">Cerrar</v-btn>
					<v-btn color="primary" small text :loading="loadingSave" @click="onsubmit()">
						Guardar
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
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
			loadingSave: false,
			dialog: false,
			fields: [
				{ value: 'name', text: 'Nombre del turno' },
				{ value: 'numberPassangerMax', text: 'Cant. Max de personas' },
				{ value: 'actions', text: 'Acción' },
			],
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
		async onsubmit() {
			this.loadingSave = true;
			// validations
			this.$v.$touch();
			if (!this.$v.$invalid) {
				await this.createPeriod(this.form);
				this.fetchLodgings();
				this.closeDialog();
			}
			this.loadingSave = false;
		},
		closeDialog() {
			this.dialog = false;
			this.clearInputs();
			this.$v.$reset();
		},
		deleteOne(id) {
			confirm('Estas seguro de que quieres eliminar este turno?') &&
				this.deletePeriod({
					id: id,
					placeId: this.idPlace,
				}).then(this.fetchLodgings());
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
