<template>
	<v-container>
		<v-row justify="center">
			<v-col
				v-for="(item, index) in persons"
				:key="index"
				cols="12"
				sm="6"
				md="4"
				xl="3"
				@click="selectedPerson(item)"
			>
				<v-alert
					color="accent"
					border="bottom"
					elevation="4"
					colored-border
					class="pa-0 ma-0 pointer"
				>
					<v-list three-line>
						<template>
							<v-list-item :key="item.title" active-class="pink--text" selectable>
								<v-list-item-avatar>
									<v-img :src="setAvatarlist(item.avatar)"></v-img>
								</v-list-item-avatar>

								<v-list-item-content>
									<v-list-item-title>
										{{ name(item.firstName, item.lastName) }}
									</v-list-item-title>
									<v-list-item-subtitle>
										<template v-for="(doc, i) in item.documents">
											<v-chip :key="i" class="ma-2" x-small :href="doc.url">
												{{ doc.name }}
											</v-chip>
										</template>
									</v-list-item-subtitle>
								</v-list-item-content>
								<v-list-item-action>
									<v-btn icon @click="deleteOne(item._id)">
										<v-icon color="error">mdi-delete</v-icon>
									</v-btn>
								</v-list-item-action>
							</v-list-item>
						</template>
					</v-list>
				</v-alert>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import avatarDefault from '@/assets/default.png';

export default {
	props: {
		deleteOne: {
			type: Function,
			required: false,
		},
		getAllpersons: {
			type: Function,
			required: false,
		},
		persons: {
			type: Array,
			required: false,
		},
		person: {
			type: Object,
			required: false,
		},
		selectedPerson: {
			type: Function,
			required: false,
		},
	},
	data() {
		return {
			selected: null,
		};
	},
	methods: {
		name(name, lastname) {
			const text = `${name} ${lastname ? lastname : ''}`;
			if (text.length > 14) {
				return `${text.substr(0, 14)}..`;
			}
			return text;
		},
		setAvatarlist(element) {
			if (typeof element === 'string') return element;
			else return avatarDefault;
		},
	},
};
</script>
