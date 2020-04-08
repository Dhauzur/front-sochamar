<template lang="html">
	<!-- <timeline
  class="timelineContent"    :groups="periods"
  :items="lodgings"
  :options="options"
/>
</template> -->
	<div>
		{{ personSelect }}
		<v-autocomplete
			v-model="personSelect"
			:items="personsAutoComplete"
			label="Selecione persona"
			prepend-icon="mdi-account-arrow-right"
		/>
		<!-- <v-date-picker
			v-model="dates"
			no-title
			range
			locale="es"
			:show-current="false"
			scrollable
		/> -->

		<!-- <v-menu
			ref="menu"
			v-model="menu"
			:close-on-content-click="false"
			:return-value.sync="date"
			transition="scale-transition"
			offset-y
			locale="es"
			:show-current="false"
			min-width="290px"
		>
			<template v-slot:activator="{ on }">
				<v-text-field
					v-model="date"
					label="Picker in menu"
					readonly
					v-on="on"
				></v-text-field>
			</template>
			<v-date-picker v-model="date" no-title locale="es" :show-current="false" scrollable>
				<v-spacer></v-spacer>
				<v-btn text color="primary" @click="menu = false">Cancel</v-btn>
				<v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
			</v-date-picker>
		</v-menu> -->
		<v-menu
			v-model="menu"
			:close-on-content-click="false"
			:nudge-right="40"
			lazy
			transition="scale-transition"
			offset-y
			full-width
			min-width="290px"
		>
			<template v-slot:activator="{ on }">
				<v-text-field
					v-model="date"
					label="Picker without buttons"
					prepend-icon="event"
					readonly
					v-on="on"
				></v-text-field>
			</template>
			<v-date-picker v-model="date" @input="menu = false"></v-date-picker>
		</v-menu>
	</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
	data() {
		return {
			personSelect: null,
			date: new Date().toISOString().substr(0, 10),
			menu: false,
			modal: false,
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
