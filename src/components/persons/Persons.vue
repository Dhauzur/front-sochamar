<template>
	<v-container>
		<!-- list person -->
		<v-row justify="center">
			<v-col cols="4">
				<span class="title">Listado de personas</span>
			</v-col>
		</v-row>
		<v-row justify="space-between">
			<v-col cols="2" class="text-left pb-0">
				<v-btn small color="accent" @click="dialog = !dialog">
					<v-icon>mdi-plus</v-icon>
					Agregar
				</v-btn>
			</v-col>
			<v-col cols="2" class="pb-0">
				<v-text-field
					v-model="filteredWord"
					outlined
					dense
					label="Filtrar"
					@input="filter"
				/>
			</v-col>
		</v-row>
		<v-row>
			<v-col v-if="Array.isArray(personsList) && personsList.length" cols="12">
				<v-responsive class="overflow-y-auto" max-height="70vh">
					<v-row>
						<v-col
							v-for="(item, index) in resultFilter"
							:key="index"
							cols="12"
							sm="6"
							md="4"
							xl="3"
							@click="editPerson(item)"
						>
							<persons-list :delete-one="deleteOne" :item="item" />
						</v-col>
					</v-row>
				</v-responsive>
			</v-col>
			<v-col v-else cols="12">
				<v-card color="secondary" flat>
					<v-card-text>
						No hay personas agregadas...
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
		<!-- dialog Form-->
		<v-dialog v-if="dialog" v-model="dialog" persistent max-width="800px">
			<Form
				:selected="person"
				:edit-mode="editMode"
				:close="closeDialog"
				:is-dialog="true"
				title="Agregar nuevo"
			/>
		</v-dialog>
	</v-container>
</template>

<script>
import PersonsList from '@/components/persons/List';
import { mapActions, mapGetters } from 'vuex';

export default {
	components: { PersonsList, Form: () => import('@/components/persons/Form') },
	data() {
		return {
			filteredWord: '',
			list: [],
			dialog: false,
			editMode: false,
			person: null,
		};
	},
	computed: {
		resultFilter() {
			if (this.filteredWord === '') {
				return this.personsList;
			} else {
				return this.list;
			}
		},
		...mapGetters({
			message: 'Persons/message',
			personsList: 'Persons/persons',
		}),
	},
	watch: {
		message(newVal) {
			this.$toasted.show(newVal.text, {
				type: newVal.type,
			});
		},
		personsList() {
			if (this.filteredWord === '') {
				this.list = this.personsList;
			}
		},
	},
	methods: {
		closeDialog() {
			this.editMode = false;
			this.person = null;
			this.dialog = false;
		},
		editPerson(person) {
			this.editMode = true;
			this.person = person;
			this.dialog = true;
		},
		filter() {
			this.list = this.personsList.filter(person => {
				return person.firstName.toLowerCase().indexOf(this.filteredWord.toLowerCase()) > -1;
			});
		},
		deleteOne(id) {
			confirm('Estas seguro de eliminarlo?') &&
				this.deleteOnePerson(id).then(() => this.getAllPersons());
		},
		...mapActions({
			deleteOnePerson: 'Persons/deleteOnePerson',
			getAllPersons: 'Persons/fetchAllPersons',
		}),
	},
};
</script>
