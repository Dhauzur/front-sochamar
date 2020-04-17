<template lang="html">
	<v-row>
		<v-col cols="12" sm="6" md="4">
			<v-autocomplete
				v-model="personSelect"
				:items="personsAutoComplete"
				label="Persona"
				outlined
				filled
				dense
				return-object
				append-icon="mdi-account-arrow-right"
			/>
		</v-col>
		<v-col cols="12" sm="6" md="3" class="d-inline-flex">
			<v-combobox
				v-model="schedulePersonSelect"
				outlined
				filled
				:items="['dsfsdfsd', 'ddddd']"
				append-icon="mdi-ballot-recount-outline"
				dense
				cache-items
				label="Programa"
			>
				<!-- <template v-slot:append>
					<v-btn v-if="schedulePersonSelect" icon class="mr-0 ml-2 mb-1">
						<v-icon>mdi-plus</v-icon>
					</v-btn>
				</template> -->
				<template v-slot:selection="{ item, index }">
					<v-chip v-if="index === 0">
						<span>{{ item }}</span>
						<span class=" btn"> DDD+ </span>
					</v-chip>
					<span v-if="index === 1" class="grey--text caption"
						>(+{{ value.length - 1 }} others)</span
					>
				</template>
			</v-combobox>
			<!-- <v-btn text icon class="ml-2" color="accent"> </v-btn> -->
		</v-col>

		<v-col cols="12" sm="10" md="3">
			<v-dialog ref="dialog" v-model="modal" width="290px">
				<template v-slot:activator="{ on }">
					<v-text-field
						v-model="date"
						label="Calendarización"
						outlined
						filled
						dense
						append-icon="mdi-calendar-clock"
						readonly
						v-on="on"
					></v-text-field>
				</template>
				<v-date-picker v-model="date" range>
					<v-spacer></v-spacer>
					<v-btn text color="primary" @click="modal = false">Cancel</v-btn>
					<v-btn text color="primary" @click="modal = false">OK</v-btn>
				</v-date-picker>
			</v-dialog>
		</v-col>

		<v-col cols="12" sm="auto">
			<v-btn color="accent" block> <v-icon>mdi-plus</v-icon>Ingresar </v-btn></v-col
		>
		<v-col cols="12">
			<!-- <timeline
				class="timelineContent"
				:groups="periods"
				:items="lodgings"
				:options="options"
			/> -->
		</v-col>
	</v-row>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
	data() {
		return {
			personSelect: null,
			schedulePersonSelect: null,
			date: [],
			modal: false,
		};
	},
	computed: {
		...mapGetters({
			personsAutoComplete: 'Person/personsAutoComplete',
			scheludePersons: 'Person/scheludePersons',
		}),
	},
	created() {
		this.setPersons(this.$store.getters['Persons/persons']);
	},
	methods: {
		...mapMutations({
			setPersons: 'Person/setPersons',
			selectPerson: 'Person/selectPerson',
			selectSchedulePerson: 'Person/selectSchedulePerson',
		}),
	},
};
</script>
