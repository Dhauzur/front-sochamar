<template>
	<v-container>
		<!-- list person -->
		<v-row justify="center">
			<v-col cols="12">
				<Timeline />
			</v-col>
		</v-row>
		<v-row justify="center">
			<v-col cols="4">
				<span class="title">Listado de personas</span>
			</v-col>
		</v-row>
		<v-row justify="space-between">
			<v-col cols="12" md="2" class="text-left pb-0">
				<v-col>
					<RequestPopup :profile="profile" :open="() => (dialog = !dialog)" />
				</v-col>
			</v-col>
			<v-col cols="12" md="2" class="pb-0">
				<v-text-field
					v-model="filteredWord"
					outlined
					filled
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
				:id-company="profile._id"
				title="Agregar nuevo"
				:get-persons="getPersons"
				:toast="toast"
			/>
		</v-dialog>
	</v-container>
</template>

<script>
import PersonsList from '@/components/persons/List';
import { mapGetters } from 'vuex';
import { getPersonsByCompany, deletePerson } from '@/service/persons';

export default {
	components: {
		PersonsList,
		Form: () => import('@/components/persons/Form'),
		RequestPopup: () => import('@/components/persons/RequestPopup'),
	},
	data() {
		return {
			filteredWord: '',
			list: [],
			dialog: false,
			editMode: false,
			person: null,
			personsList: [],
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
			profile: 'User/profile',
		}),
	},
	watch: {
		personsList() {
			if (this.filteredWord === '') {
				this.list = this.personsList;
			}
		},
	},
	mounted() {
		this.getPersons();
	},
	methods: {
		toast(type, text) {
			this.$toasted.show(text, {
				type: type,
			});
		},
		getPersons() {
			getPersonsByCompany(this.profile._id).then(list => (this.personsList = list));
		},
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
				deletePerson(id)
					.then(this.getPersons())
					.then(this.toast('success', 'Eliminado exitosamente'))
					.catch(error => this.toast('error', error.message));
		},
	},
};
</script>
