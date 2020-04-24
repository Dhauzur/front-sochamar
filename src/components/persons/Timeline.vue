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
		<v-col cols="12" sm="6" md="3">
			<v-combobox
				v-model="schedulePersonSelect"
				outlined
				filled
				:items="itemsSchedule"
				append-icon="mdi-ballot-recount-outline"
				dense
				cache-items
				label="Programa"
			/>
			<div v-if="!verifyExistProgram && schedulePersonSelect">
				<v-chip label small color="blue lighten-3" class="mb-2">
					<span>
						{{ schedulePersonSelect }}
						<v-icon class=" ml-2" small @click="addSchedule()">mdi-plus</v-icon></span
					>
				</v-chip>
			</div>
			<div v-if="verifyExistProgram && schedulePersonSelect" class="">
				<v-chip label small color="red lighten-3" class="mb-2">
					<span>
						{{ schedulePersonSelect }}
						<v-icon color="error" class=" ml-2" small @click="subSchedule()"
							>mdi-delete</v-icon
						>
					</span>
				</v-chip>
			</div>
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
			itemsSchedule: [
				{ id: 0, text: 'Subida' },
				{ id: 1, text: 'Bajada' },
			],
		};
	},
	computed: {
		verifyExistProgram() {
			let verify = false;
			if (this.schedulePersonSelect != null)
				if (this.schedulePersonSelect.text != undefined) verify = true;
			// if (this.schedulePersonSelect.text != undefined)
			// 	this.itemsSchedule.forEach(item => {
			// 		console.log(item.text, this.schedulePersonSelect);
			// 		if (item.text == this.schedulePersonSelect) verify = true;
			// 	});
			return verify;
		},
		...mapGetters({
			personsAutoComplete: 'Person/personsAutoComplete',
			scheludePersons: 'Person/scheludePersons',
		}),
	},
	created() {
		this.setPersons(this.$store.getters['Persons/persons']);
	},
	methods: {
		subSchedule() {},
		addSchedule() {
			this.itemsSchedule.push({
				id: this.itemsSchedule.length + 1,
				text: this.schedulePersonSelect,
			});
		},
		...mapMutations({
			setPersons: 'Person/setPersons',
			selectPerson: 'Person/selectPerson',
			selectSchedulePerson: 'Person/selectSchedulePerson',
		}),
	},
};
</script>
