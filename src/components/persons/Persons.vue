<template>
	<v-container style="height: calc(100vh - 140px)">
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
			<v-col cols="6" md="2" class="text-left pb-0">
				<RequestPopup
					:profile="profile"
					:close="() => (popup = !popup)"
					:open-form="openFormFrontPopup"
					:persons="personsList"
				/>
			</v-col>
			<v-col cols="12" md="2" class="text-left pb-0">
				<v-btn block color="primary" small @click="exportToPdf">
					<span>Exportar pdf</span>
				</v-btn>
			</v-col>
			<v-col cols="12" md="2" class="text-left pb-0">
				<v-btn block color="primary" small @click="exportToCsv">
					<span>Exportar csv</span>
				</v-btn>
			</v-col>
			<v-col cols="12" md="2" class="pb-0">
				<v-text-field
					v-model="filteredWord"
					outlined
					filled
					dense
					label="Buscar"
					append-icon="mdi-magnify"
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
							<persons-list :delete-one="deleteOne" :item="item" :chat="chat" />
						</v-col>
					</v-row>
				</v-responsive>
			</v-col>
			<v-col v-else cols="12">
				<p class="overline">No hay personas agregadas...</p>
			</v-col>
		</v-row>
		<!-- chat drawer -->
		<template v-if="person">
			<v-navigation-drawer v-model="drawer" temporary right absolute>
				<template v-slot:prepend>
					<v-btn x-large text @click="drawer = false">
						Cerrar
						<v-icon color="primary">mdi-close</v-icon>
					</v-btn>
				</template>
				<v-divider></v-divider>
				<messages :id="person._id" :sender="profile.name" />
			</v-navigation-drawer>
		</template>
		<!-- dialog Form-->
		<v-dialog v-model="dialogForm" persistent max-width="800px">
			<template v-if="dialogForm">
				<Form
					:selected="person"
					:edit-mode="editMode"
					:close="closeDialog"
					:is-dialog="true"
					:id-company="profile._id"
					:get-persons="getPersons"
					:toast="toast"
				/>
			</template>
		</v-dialog>
	</v-container>
</template>

<script>
import PersonsList from '@/components/persons/List';
import { mapGetters } from 'vuex';
import {
	getPersonsByCompany,
	deletePerson,
	generatePdfReport,
	generateCsvReport,
} from '@/service/persons';
export default {
	components: {
		PersonsList,
		Form: () => import('@/components/persons/Form'),
		RequestPopup: () => import('@/components/persons/RequestPopup'),
		Messages: () => import('@/components/persons/Messages'),
		Timeline: () => import('@/components/persons/Timeline'),
	},
	data() {
		return {
			drawer: false,
			filteredWord: '',
			list: [],
			dialogForm: false,
			popup: false,
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
		drawer(newVal) {
			if (newVal === false) {
				this.person = null;
			}
		},
	},
	mounted() {
		this.getPersons();
	},
	methods: {
		openFormFrontPopup() {
			this.dialogForm = true;
			this.popup = false;
		},
		chat(item) {
			this.drawer = !this.drawer;
			this.person = item;
		},
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
			this.dialogForm = false;
		},
		editPerson(person) {
			this.drawer = false;
			this.editMode = true;
			this.person = person;
			this.dialogForm = true;
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
		async exportToPdf() {
			const pdf = await generatePdfReport(this.profile._id);
			let blob = new Blob([pdf], { type: 'application/pdf' });
			let link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = 'personas.pdf';
			link.click();
		},
		async exportToCsv() {
			const csv = await generateCsvReport(this.profile._id);
			let blob = new Blob([csv], { type: 'text/csv' });
			let link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = 'personas.csv';
			link.click();
		},
	},
};
</script>
