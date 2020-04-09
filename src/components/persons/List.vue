<template>
	<v-alert color="accent" border="bottom" elevation="4" colored-border class="pa-0 ma-0 pointer">
		<v-list three-line>
			<template>
				<v-list-item :key="item.title">
					<Avatar
						icon
						:name="item.firstName"
						:last-name="item.lastName"
						:url="item.avatar"
					/>
					<v-list-item-content>
						<v-list-item-title>
							{{ name(item.firstName, item.lastName) }}
						</v-list-item-title>
					</v-list-item-content>
					<v-list-item-action>
						<v-btn icon @click.stop="deleteOne(item._id)">
							<v-icon color="error">mdi-delete</v-icon>
						</v-btn>
						<v-menu v-if="item.documents.length" offset-y open-on-hover>
							<template v-slot:activator="{ on }">
								<v-btn icon large>
									<v-icon color="primary" large v-on.stop="on">
										mdi-folder-download
									</v-icon>
								</v-btn>
							</template>
							<v-list>
								<v-list-item
									v-for="(doc, i) in item.documents"
									:key="i"
									:href="doc.url"
								>
									<v-list-item-title>
										{{ doc.name }}
									</v-list-item-title>
								</v-list-item>
							</v-list>
						</v-menu>
						<v-icon v-else color="primary" large style="cursor: auto">
							mdi-folder-outline
						</v-icon>
					</v-list-item-action>
				</v-list-item>
			</template>
		</v-list>
	</v-alert>
</template>

<script>
import Avatar from '@/components/ui/Avatar';

export default {
	components: {
		Avatar,
	},
	props: {
		deleteOne: {
			type: Function,
			required: false,
		},
		item: {
			type: Object,
			required: true,
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
	},
};
</script>
