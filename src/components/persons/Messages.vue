<template>
	<v-sheet elevation="24">
		<v-container>
			<v-row>
				<!-- messages -->
				<v-col cols="12" style="height: 350px; overflow: auto">
					<v-row
						v-for="(item, i) in message"
						:key="i"
						:justify="item.sender === sender ? 'end' : 'start'"
					>
						<v-col cols="6" class="pt-0">
							<v-alert text class="p-0 text-left" color="info" prominent>
								<div class="black--text title">{{ item.sender }}</div>
								<span>{{ item.content }}</span>
								<div class="overline text-right">
									{{ formatTime(item.createAt) }}
								</div>
							</v-alert>
						</v-col>
					</v-row>
				</v-col>
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
	</v-sheet>
</template>

<script>
import { pathConversation } from '@/service/persons';
import moment from 'moment';

export default {
	props: {
		person: {
			type: Object,
			required: true,
		},
		sender: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			message: [],
			text: '',
		};
	},
	created() {
		this.message = this.person.conversation;
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
		setConversation(participant) {
			console.log(participant);
		},
		formatTime(time) {
			return moment(time).format('LLL');
		},
	},
};
</script>
