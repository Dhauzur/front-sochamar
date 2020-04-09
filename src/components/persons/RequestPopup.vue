<template>
	<v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
		<template v-slot:activator="{ on }">
			<v-btn small color="accent" block dark v-on="on">
				<v-icon>mdi-plus</v-icon>
				Nuevo
			</v-btn>
		</template>
		<v-card max-width="430">
			<v-card-title primary-title>
				Agregar persona
				<v-spacer></v-spacer>
				<v-btn fab small color="error" @click="menu = false">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-card-title>
			<v-divider></v-divider>
			<v-card-text class="text-left">
				<v-row>
					<v-col cols="12">Invitar a una persona por correo electronico.</v-col>
					<v-col cols="12">
						<v-text-field
							v-model.trim="email"
							:loading="loading"
							color="accent"
							outlined
							dense
							label="Correo electronico"
							type="email"
							hint="Ejemplo: correo@correo.com"
							@click:append="sendRequest"
						>
							<template v-slot:append>
								<v-tooltip bottom>
									<template v-slot:activator="{ on }">
										<v-btn :disabled="loading" small text fab color="success">
											<v-icon v-on="on">mdi-send</v-icon>
										</v-btn>
									</template>
									Enviar invitación
								</v-tooltip>
							</template>
						</v-text-field>
					</v-col>
					<v-col cols="12">
						<v-divider></v-divider>
					</v-col>
					<v-col cols="12">Agregala tu mismo.</v-col>
					<v-col>
						<v-btn block small color="accent" @click="open">
							<v-icon>mdi-plus</v-icon>
							Agregar
						</v-btn>
					</v-col>
				</v-row>
			</v-card-text>
		</v-card>
	</v-menu>
</template>

<script>
export default {
	props: {
		open: {
			type: Function,
			required: true,
		},
	},
	data() {
		return {
			loading: false,
			menu: false,
			email: '',
		};
	},
	methods: {
		sendRequest() {
			this.loading = true;
			console.log('sending...');
			this.email = '';
			this.loading = false;
		},
	},
};
</script>
