<template lang="html">
	<!-- <timeline
  class="timelineContent"    :groups="periods"
  :items="lodgings"
  :options="options"
/>
</template> -->
	<v-row>
		<v-col md="3">
			<v-autocomplete
				v-model="personSelect"
				:items="personsAutoComplete"
				label="Selecione persona"
				outlined
				dense
				prepend-icon="mdi-account-arrow-right"
			/>
		</v-col>
		<v-col md="2">
			<v-menu
				v-model="menu1"
				:close-on-content-click="false"
				:nudge-right="40"
				transition="scale-transition"
				offset-y
				min-width="290px"
			>
				<template v-slot:activator="{ on }">
					<v-text-field
						v-model="date1"
						label="Fecha de inicio"
						prepend-icon="mdi-calendar-clock"
						readonly
						outlined
						dense
						v-on="on"
					></v-text-field>
				</template>
				<v-date-picker v-model="date1" @input="menu1 = false"></v-date-picker>
			</v-menu>
		</v-col>
		<v-col md="2">
			<v-menu
				v-model="menu2"
				:close-on-content-click="false"
				:nudge-right="40"
				transition="scale-transition"
				offset-y
				min-width="290px"
			>
				<template v-slot:activator="{ on }">
					<v-text-field
						v-model="date2"
						label="Fecha de inicio"
						prepend-icon="mdi-calendar-clock"
						readonly
						outlined
						dense
						v-on="on"
					></v-text-field>
				</template>
				<v-date-picker v-model="date2" @input="menu2 = false"></v-date-picker>
			</v-menu>
		</v-col>
		<v-col md="2">
			<v-select
				dense
				label="Selecione lugar"
				outlined
				:items="['soltero', 'casado']"
			></v-select>
		</v-col>
		<v-col md="2"> </v-col>
	</v-row>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
	data() {
		return {
			personSelect: null,
			date1: null,
			date2: null,
			menu1: false,
			menu2: false,
		};
	},
	computed: {
		...mapGetters({
			personsAutoComplete: 'Person/personsAutoComplete',
		}),
	},
	created() {
		this.setPersons(this.$store.getters['Persons/persons']);
	},
	methods: {
		...mapMutations({
			setPersons: 'Person/setPersons',
		}),
	},
};
</script>
