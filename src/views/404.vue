<template>
	<v-container class="mb-6">
		<v-row align="center" justify="center" style="height: 80vh;">
			<v-col cols="4">
				<v-alert outlined type="warning" prominent border="left">
					<v-row align="center">
						<v-col class="grow">Page not found.</v-col>
						<v-col class="shrink">
							<v-btn color="secondary" rounded small @click="() => $router.back()">
								Regresar
							</v-btn>
						</v-col>
					</v-row>
				</v-alert>
			</v-col>
		</v-row>
	</v-container>
</template>
