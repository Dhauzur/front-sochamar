<template>
	<v-sheet elevation="24">
		<v-container>
			<v-row>
				<v-col id="scrolling" cols="12" style="height: 350px; overflow: auto">
					<v-row
						v-for="(item, i) in message"
						:key="i"
						:justify="item.from === 'Yo' ? 'end' : 'start'"
					>
						<v-col cols="6" class="pt-0">
							<v-alert text class="p-0 text-left" color="info" prominent>
								<span class="black--text title">{{ item.from }}: </span>
								<span>{{ item.text }}</span>
								<div class="overline text-right">4:33pm</div>
							</v-alert>
						</v-col>
					</v-row>
				</v-col>
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
export default {
	data() {
		return {
			message: [
				{
					text: `Lorem ipsum dolor sit amet consectetur, adipisicing elit.`,
					from: 'Yo',
				},
				{
					text: `Lorem ipsum dolor sit amet consectetur, adipisicing elit.`,
					from: 'Admin',
				},
			],
			text: '',
		};
	},
	methods: {
		setMessage() {
			this.message.push({ text: this.text, from: 'Yo' });
			this.text = '';
		},
	},
};
</script>
