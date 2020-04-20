<template>
	<v-alert v-model="alert" elevation="24" prominent border="left" colored-border color="primary">
		<v-row align="center">
			<v-col class="grow">
				<span class="success--text">{{ item.name }}</span> te envió una solicitud para que
				te sumes a su equipo.
			</v-col>
			<v-col class="shrink">
				<v-btn fab x-small color="success" @click="accept(item.idCompany)">
					<v-icon>mdi-check-bold</v-icon>
				</v-btn>
			</v-col>
			<v-col class="shrink">
				<v-btn v-if="alert" fab x-small color="error" @click="remove(item)">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-col>
		</v-row>
	</v-alert>
</template>

<script>
import { putPerson, pathRequest } from '@/service/persons';

export default {
	props: {
		person: {
			type: Object,
			default: () => {},
		},
		updatePerson: {
			type: Function,
			required: true,
		},
		item: {
			type: Object,
			default: () => {},
		},
		toast: {
			type: Function,
			required: true,
		},
	},
	data() {
		return {
			alert: true,
		};
	},
	methods: {
		accept(idCompany) {
			if (this.person.idCompany) {
				return this.toast('info', 'Ya perteneces a un equipo');
			}
			putPerson({ ...this.person, idCompany }, this.person._id).then(res => {
				this.updatePerson(res);
				this.remove(idCompany);
				this.toast('info', 'Solicitud Aceptada');
				this.alert = false;
			});
		},
		remove(item) {
			pathRequest({
				email: this.person.email,
				idProfile: item.idCompany,
				cancel: true,
			}).then(() => {
				this.alert = false;
			});
		},
	},
};
</script>
