<template>
	<v-card v-if="selectedPlace" elevation="6" max-height="600" style="overflow: auto">
		<v-list dense nav>
			<v-list-item-group v-model="selected" color="primary">
				<v-list-item
					v-for="item in lodgings"
					:key="item._id"
					active-class="primary--text"
					link
					@click="currentLodgign(item)"
				>
					<v-list-item-content>
						<v-list-item-title>{{ item.name }}</v-list-item-title>
						<v-list-item-subtitle>
							{{ item.start }} - {{ item.end }}
						</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
			</v-list-item-group>
		</v-list>
	</v-card>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
	data() {
		return {
			selected: null,
		};
	},
	computed: {
		...mapGetters({
			lodgings: 'Lodging/lodgings',
			selectedPlace: 'Lodging/selectedPlace',
		}),
	},
	methods: {
		currentLodgign(item) {
			this.setLodgingSelect(item);
		},
		...mapMutations({
			setLodgingSelect: 'Lodging/setLodgingSelect',
		}),
	},
};
</script>

<style lang="scss" scoped></style>
