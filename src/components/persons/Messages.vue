<template>
	<v-container style="height: 100%">
		<v-row class="d-flex flex-column content">
			<!-- messages -->
			<v-col cols="12">
				<template v-if="message.length">
					<v-row
						v-for="(item, i) in message"
						:key="i"
						:justify="item.sender === sender ? 'end' : 'start'"
					>
						<v-col cols="10" class="pt-0">
							<v-alert text class="p-0 text-left" color="info" prominent>
								<div class="black--text title">{{ item.sender }}</div>
								<div style="max-width:160px; overflow-wrap: break-word;">
									{{ item.content }}
								</div>
								<div class="overline text-right">
									{{ formatTime(item.createAt) }}
								</div>
							</v-alert>
						</v-col>
					</v-row>
				</template>
				<template v-else>
					<v-overlay :value="overlay" absolute :opacity="0.8">
						<v-icon x-large>mdi-email-alert-outline</v-icon>
						<div>¡No tienes mensajes!</div>
						<v-btn small class="ma-2" color="primary" @click="overlay = false">
							Inicia una conversacion
						</v-btn>
					</v-overlay>
				</template>
			</v-col>
		</v-row>
		<v-row class="pb-3">
			<!-- input text -->
			<v-col cols="12">
				<form @submit.prevent="setMessage">
					<v-text-field
						v-model="text"
						hide-details
						color="accent"
						outlined
						dense
						filled
						label="Escriba un comentario..."
						type="text"
					>
						<template v-slot:append>
							<v-tooltip bottom>
								<template v-slot:activator="{ on }">
									<v-btn small text fab color="success" type="submit">
										<v-icon v-on="on">mdi-send</v-icon>
									</v-btn>
								</template>
								Enviar mensaje
							</v-tooltip>
						</template>
					</v-text-field>
				</form>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { pathConversation, getPerson } from '@/service/persons';
import moment from 'moment';

export default {
	props: {
		id: {
			type: String,
			default: '',
		},
		sender: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			overlay: true,
			person: null,
			message: [],
			text: '',
		};
	},
	created() {
		getPerson(this.id).then(person => {
			this.person = person;
			if (Array.isArray(person.conversation) && person.conversation.length) {
				this.overlay = false;
				this.message = person.conversation;
			}
		});
	},
	methods: {
		setMessage() {
			const data = {
				id: this.person._id,
				conversation: { sender: this.sender, content: this.text, createAt: moment() },
			};
			pathConversation(data).then(res => {
				this.message = res;
				this.text = '';
			});
		},
		formatTime(time) {
			return moment(time).format('LLL');
		},
	},
};
</script>

<style lang="scss" scoped>
.content {
	height: 90%;
	overflow-y: auto;
	overflow-x: hidden;
}
</style>
