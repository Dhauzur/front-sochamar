<template lang="html">
	<!-- <timeline
  class="timelineContent"    :groups="periods"
  :items="lodgings"
  :options="options"
/>
</template> -->
	<v-row>
		<v-col cols="12" sm="6" md="3">
			<v-autocomplete
				v-model="personSelect"
				:items="personsAutoComplete"
				label="Persona"
				outlined
				filled
				dense
				append-icon="mdi-account-arrow-right"
			/>
		</v-col>
		<v-col cols="12" sm="6" md="3">
			<v-autocomplete
				v-model="schedulePersonSelect"
				:items="scheludePersons"
				label="Programa"
				outlined
				filled
				dense
				append-icon="mdi-ballot-recount-outline"
			/>
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
			<v-btn color="accent" block>
				<v-icon>mdi-plus</v-icon>
			</v-btn></v-col
		>
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
