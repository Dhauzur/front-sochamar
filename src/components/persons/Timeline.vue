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
			:items="states"
			label="Selecione persona"
			prepend-icon="mdi-account-arrow-right"
		/>
	</div>
</template>

<script>
export default {
	data() {
		return {
			personSelect: null,
			isEditing: false,
			states: [
				{ text: 'New York', value: 5 },
				{ text: 'New ewYork', value: 1 },
				{ text: 'New weYork', value: 2 },
				{ text: 'Newqwe York', value: 3 },
			],
		};
	},
};
</script>
